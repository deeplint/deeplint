import * as path from 'path'
import * as fs from 'fs'
import YamlReader from '../shared/yaml-reader'
import {PolicySpec} from './spec'
import {PolicyConfig} from '../config'
import {CheckingResults, FixingResults, Meta, Resource, Snapshot} from './model'
import {Invoker} from './invoker'
import * as _ from 'lodash'
import {DEFAULT_POLICY_SPEC_FILE_NAME} from '../constant'
import {CheckContext, Context} from './context'
import {validate} from './validate'

export class Policy {
  readonly meta: Meta

  private readonly processedInputs: { [key: string]: any }

  constructor(meta: Meta, processedInputs: { [key: string]: any }) {
    this.meta = meta
    this.processedInputs = processedInputs
  }

  get rules() {
    return this.meta.policySpec.rules
  }

  get name() {
    return this.meta.policyName
  }

  get path() {
    return this.meta.policyPath
  }

  get actions() {
    return this.meta.policySpec.actions
  }

  get providers() {
    return this.meta.policySpec.providers
  }

  get inputs() {
    return this.processedInputs
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

  static loadPolicySpec(policyPath: string): PolicySpec {
    return YamlReader.load(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)
  }

  static async build(policyConfig: PolicyConfig, policyName: string): Promise<Policy> {
    let policyPath: string = policyConfig.main
    if (policyPath.startsWith('./')) {
      policyPath = path.resolve(policyPath)
      if (!fs.existsSync(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)) {
        throw new Error(`Can not find the policy: ${this.name} with path: ${policyConfig.main}`)
      }
    } else if (policyConfig.main.startsWith('http')) {
      throw new Error('Git based policy sharing is not supported yet')
    } else {
      throw new Error('Node module based policy sharing is not supported yet')
    }
    const policySpec = Policy.loadPolicySpec(policyPath)
    const inputs = Policy.processInputs(policyConfig, policySpec, policyName)
    return new Policy({
      policyName: policyName,

      policyPath: policyPath,

      policySpec: policySpec,

      policyConfig: policyConfig,

    }, inputs)
  }

  async snap(): Promise<Snapshot> {
    const resources: {
      [key: string]: Resource[];
    } = {}
    await Promise.all(Object.keys(this.meta.policySpec.providers).map(async providerKey => {
      const functionPath = path.resolve(this.meta.policyPath, this.meta.policySpec.providers[providerKey].main)
      const resources_temp: Resource[] = await Invoker.run(new Context(this.meta, this.processedInputs), functionPath, this.meta.policySpec.providers[providerKey].handler)
      resources_temp.forEach(resource => {
        if (!validate('Resource', resource)) {
          throw new Error(`Resource ${JSON.stringify(resource)} does not follow the required format`)
        }
      })
      resources[providerKey] = resources_temp
    }))
    return {
      timestamp: new Date(),
      resources: resources,
    }
  }

  async check(snapshot: Snapshot): Promise<CheckingResults> {
    const checkingResults: CheckingResults = {}
    const context = new CheckContext(this.meta, this.processedInputs, snapshot)
    await Promise.all(Object.keys(this.rules).map(async ruleKey => {
      const functionPath = path.resolve(this.path, this.rules[ruleKey].main)
      const checkingResult = await Invoker.run(context, functionPath, this.rules[ruleKey].handler)
      if (!validate('CheckingResult', checkingResult)) {
        throw new Error(`Checking Result ${JSON.stringify(checkingResult)} does not follow the required format`)
      }
      checkingResults[ruleKey] = checkingResult
    }))
    return checkingResults
  }

  async fix(checkingResults: CheckingResults): Promise<FixingResults> {
    const fixingResults: FixingResults = {}
    await Promise.all(Object.keys(checkingResults).map(async key => {
      const checkingResult = checkingResults[key]
      if (!checkingResult.passed && checkingResult.problem) {
        if (checkingResult.problem.fix !== undefined) {
          if (!_.has(this.actions, checkingResult.problem.fix)) {
            throw new Error(`Invalid fix action: ${checkingResult.problem.fix}`)
          }
          const functionPath = path.resolve(this.path, this.actions[checkingResult.problem.fix].main)
          fixingResults[key] = await Invoker.run(new Context(this.meta, this.inputs), functionPath, this.actions[checkingResult.problem.fix].handler)
        }
      }
    }))
    return fixingResults
  }
}
