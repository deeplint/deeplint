import * as path from 'path'
import * as fs from 'fs'
import YamlReader from '../shared/yaml-reader'
import {PolicySpec} from './spec'
import {PolicyConfig} from '../config'
import {CheckingPlan, FixingPlan, FixingResult, Resource} from './model'
import {Invoker} from './invoker'
import * as _ from 'lodash'
import {Context} from './context'

const DEFAULT_POLICY_SPEC_FILE_NAME = 'stacklint-policy.yaml'

export class Policy {
  private readonly policyName: string

  private readonly policyPath: string

  private readonly policyConfig: PolicyConfig

  private readonly policySpec: PolicySpec

  private readonly processedInputs: { [key: string]: any }

  constructor(policyConfig: PolicyConfig, policyName: string, policyPath: string, policySpec: PolicySpec, processedInputs: { [key: string]: any }) {
    this.policyName = policyName
    this.policyConfig = policyConfig
    this.policyPath = policyPath
    this.policySpec = policySpec
    this.processedInputs = processedInputs
  }

  static processInputs(policyConfig: PolicyConfig, policySpec: PolicySpec, policyName: string): { [key: string]: any } {
    const res: { [key: string]: any } = {}
    Object.keys(policySpec.inputs).forEach(inputKey => {
      const inputSpec = policySpec.inputs[inputKey]
      if (_.has(policyConfig.with, inputKey)) {
        if (inputSpec.type === 'Number') {
          res[inputKey] = Number(policyConfig.with[inputKey])
        } else if (inputSpec.type === 'Boolean') {
          res[inputKey] = Boolean(policyConfig.with[inputKey])
        } else if (inputSpec.type === 'String') {
          res[inputKey] = String(policyConfig.with[inputKey])
        } else {
          res[inputKey] = policyConfig.with[inputKey]
        }
      } else if (_.has(process.env, inputKey)) {
        res[inputKey] = process.env[inputKey]
      } else if (inputSpec.default) {
        res[inputKey] = inputSpec.default
      } else {
        throw new Error(`Policy: ${policyName} misses required input: ${inputKey}.
                     Description: ${inputSpec.description}`)
      }
    })
    return res
  }

  buildContext(): Context {
    return new Context(this.policyName, this.policyPath, this.policySpec, this.processedInputs)
  }

  static loadPolicySpec(policyPath: string): PolicySpec {
    return YamlReader.load(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)
  }

  static async build(policyConfig: PolicyConfig, policyName: string): Promise<Policy> {
    let policyPath: string
    if (policyConfig.main.startsWith('./')) {
      policyPath = path.resolve(policyConfig.main)
      if (!fs.existsSync(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)) {
        throw new Error(`Can not find the policy: ${this.name} with path: ${policyConfig.main}`)
      }
    } else if (policyConfig.main.startsWith('http')) {
      throw new Error('Git based policy sharing is not supported yet')
    } else {
      throw new Error('Node module based policy sharing is not supported yet')
    }
    const policySpec = Policy.loadPolicySpec(policyPath)
    const processedInputs = Policy.processInputs(policyConfig, policySpec, policyName)
    return new Policy(policyConfig, policyName, policyPath, this.loadPolicySpec(policyPath), processedInputs)
  }

  async show(): Promise<CheckingPlan> {
    const resources: {
      [key: string]: Resource[];
    } = {}
    await Promise.all(Object.keys(this.policySpec.resources).map(async resourceKey => {
      const functionPath = path.resolve(this.policyPath, this.policySpec.resources[resourceKey].main)
      resources[resourceKey] = await Invoker.run(this.buildContext(), functionPath, this.policySpec.resources[resourceKey].handler)
    }))
    return {
      resources: resources,
      rules: this.policySpec.rules,
    }
  }

  async check(checkingPlan?: CheckingPlan): Promise<FixingPlan> {
    const fixingPlan: FixingPlan = {}
    const checkingPlanLocal: CheckingPlan = checkingPlan || await this.show()
    const context = this.buildContext()
    context.setResources(checkingPlanLocal.resources)
    await Promise.all(Object.keys(checkingPlanLocal.rules).map(async ruleKey => {
      const functionPath = path.resolve(this.policyPath, checkingPlanLocal.rules[ruleKey].main)
      fixingPlan[ruleKey] = await Invoker.run(context, functionPath, checkingPlanLocal.rules[ruleKey].handler)
    }))
    return fixingPlan
  }

  async fix(fixingPlan?: FixingPlan): Promise<FixingResult> {
    if (fixingPlan === undefined) {
      throw new Error('Can not fix without a plan')
    }
    const fixingResult: FixingResult = {}
    await Promise.all(Object.keys(fixingPlan).map(async key => {
      const results = fixingPlan[key]
      await results.map(async result => {
        if (result.fix !== undefined) {
          if (!_.has(this.policySpec.actions, result.fix)) {
            throw new Error(`Invalid fix action: ${result.fix}`)
          }
          const functionPath = path.resolve(this.policyPath, this.policySpec.actions[result.fix].main)
          fixingResult[key] = await Invoker.run(this.buildContext(), functionPath, this.policySpec.actions[result.fix].handler)
        }
      })
    }))
    return fixingResult
  }
}
