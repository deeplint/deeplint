import * as path from 'path'
import * as fs from 'fs'
import YamlReader from '../shared/YamlReader'
import {PolicySpec} from './spec'
import {PolicyConfig} from '../config'
import {CheckingPlan, FixingPlan, FixingResult, PolicyInfo, Resource, Result} from './model'
import {Invoker} from './invoker'
import * as _ from 'lodash'

const DEFAULT_POLICY_SPEC_FILE_NAME = 'stacklint-policy.yaml'

export class Policy {
  private readonly policyName: string

  private readonly policyPath: string

  private readonly policyConfig: PolicyConfig

  private readonly policySpec: PolicySpec

  private constructor(policyConfig: PolicyConfig, policyName: string, policyPath: string, policySpec: PolicySpec) {
    this.policyName = policyName
    this.policyConfig = policyConfig
    this.policyPath = policyPath
    this.policySpec = policySpec
  }

  static loadPolicySpec(policyPath: string): PolicySpec {
    return YamlReader.load(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)
  }

  static async build(policyConfig: PolicyConfig, name: string): Promise<Policy> {
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
    return new Policy(policyConfig, name, policyPath, this.loadPolicySpec(policyPath))
  }

  async show(): Promise<PolicyInfo> {
    return {
      PolicyConfig: this.policyConfig,
      PolicySpec: this.policySpec,
    }
  }

  async plan(): Promise<CheckingPlan> {
    const resources: {
      [key: string]: Resource[];
    } = {}
    await Promise.all(Object.keys(this.policySpec.resources).map(async resourceKey => {
      const functionPath = path.resolve(this.policyPath, this.policySpec.resources[resourceKey].main)
      resources[resourceKey] = await Invoker.run(null, functionPath, this.policySpec.resources[resourceKey].handler)
    }))
    return {
      resources: resources,
      rules: this.policySpec.rules,
    }
  }

  async check(checkingPlan?: CheckingPlan): Promise<FixingPlan> {
    const fixingPlan: {
      [key: string]: Result;
    } = {}
    const checkingPlanLocal: CheckingPlan = checkingPlan || await this.plan()

    await Promise.all(Object.keys(checkingPlanLocal.rules).map(async ruleKey => {
      const functionPath = path.resolve(this.policyPath, checkingPlanLocal.rules[ruleKey].main)
      fixingPlan[ruleKey] = await Invoker.run(null, functionPath, checkingPlanLocal.rules[ruleKey].handler)
    }))

    return fixingPlan
  }

  async fix(fixingPlan?: FixingPlan): Promise<FixingResult> {
    if(fixingPlan === undefined) {
      throw new Error('Can not fix without a plan')
    }
    const fixingResult: {
      [key: string]: boolean;
    } = {}
    await Promise.all(Object.keys(fixingPlan).map(async key => {
      const result = fixingPlan[key]
      if (result.fix !== undefined) {
        if (!_.has(this.policySpec.actions, result.fix)) {
          throw new Error(`Invalid fix action: ${result.fix}`)
        }
        const functionPath = path.resolve(this.policyPath, this.policySpec.actions[result.fix].main)
        fixingResult[key] = await Invoker.run(null, functionPath, this.policySpec.actions[result.fix].handler)
      }
    }))
    return fixingResult
  }
}
