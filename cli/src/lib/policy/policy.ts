import * as path from 'path'
import YamlReader from '../shared/yaml-reader'
import {CheckingResult, FixingResult, Meta, Problem, Resource, Snapshot} from './model'
import {Invoker} from './invoker'
import * as _ from 'lodash'
import {DEFAULT_POLICY_SPEC_FILE_NAME} from '../constant'
import {CheckContext, Context} from './context'
import {validate} from './validate'
import {PolicyConfig} from '../module/spec'
import {processInputs} from '../shared/input-processing'
import {resolvePolicyPath} from '../shared/path'
import * as fs from 'fs'

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

  get scanners() {
    return this.meta.policySpec.scanners
  }

  get inputs() {
    return this.processedInputs
  }

  static async build(policyConfig: PolicyConfig, policyName: string, moduleName: string): Promise<Policy> {
    const policyPath: string = resolvePolicyPath(moduleName, policyName, policyConfig.uses)
    if (!fs.existsSync(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)) {
      throw new Error(`Can not find the policy: ${policyName} in module: ${moduleName} with path: ${policyPath}`)
    }

    const policySpec = YamlReader.load(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)
    if (!validate('PolicySpec', policySpec)) {
      throw new Error(`Policy spec ${JSON.stringify(policySpec)} does not follow the required format`)
    }

    const inputs = processInputs(policyName, policyConfig.with, policySpec.inputs)

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
    await Promise.all(Object.keys(this.meta.policySpec.scanners).map(async scannerKey => {
      const functionPath = this.meta.policySpec.scanners[scannerKey].uses.startsWith('@deeplint/deepscanner') ?
        this.meta.policySpec.scanners[scannerKey].uses :
        path.resolve(this.meta.policyPath, this.meta.policySpec.scanners[scannerKey].uses)

      const resources_temp: Resource[] = await Invoker.run(new Context(this.meta, this.processedInputs), functionPath, this.meta.policySpec.scanners[scannerKey].main)
      resources_temp.forEach(resource => {
        if (!validate('Resource', resource)) {
          throw new Error(`Resource ${JSON.stringify(resource)} does not follow the required format`)
        }
      })
      resources[scannerKey] = resources_temp
    }))
    return {
      timestamp: new Date(),
      resources: resources,
    }
  }

  async check(snapshot: Snapshot): Promise<CheckingResult> {
    const checkingResult: CheckingResult = {
      timestamp: new Date(),
      problems: {},
    }
    const context = new CheckContext(this.meta, this.processedInputs, snapshot)
    await Promise.all(Object.keys(this.rules).map(async ruleKey => {
      const functionPath = path.resolve(this.path, this.rules[ruleKey].uses)
      const problems = await Invoker.run(context, functionPath, this.rules[ruleKey].main)
      for (const problem of problems) {
        if (!validate('Problem', problem)) {
          throw new Error(`Checking Result ${JSON.stringify(problem)} does not follow the required format`)
        }
      }
      checkingResult.problems[ruleKey] = problems
    }))
    return checkingResult
  }

  async fix(checkingResult: CheckingResult): Promise<FixingResult> {
    const fixingResult: FixingResult = {
      timestamp: new Date(),
      fixes: [],
    }
    await Promise.all(Object.keys(checkingResult.problems).map(async key => {
      checkingResult.problems[key].map(async problem => {
        if (problem.fix && problem.fix.action && this.actions) {
          if (_.has(this.actions, problem.fix.action)) {
            try {
              const functionPath = path.resolve(this.path, this.actions[problem.fix.action].uses)
              const res = await Invoker.run(problem, functionPath, this.actions[problem.fix.action].main)
              fixingResult.fixes.push({
                rule: key,
                problem: problem,
                isFixed: res.isFixed,
                error: res.error,
              })
            } catch (error) {
              fixingResult.fixes.push({
                rule: key,
                problem: problem,
                isFixed: false,
                error: error.toString(),
              })
            }
          } else {
            fixingResult.fixes.push({
              rule: key,
              problem: problem,
              isFixed: false,
              error: `Invalid fix action: ${problem.fix.action}`,
            })
          }
        }
      })
    }))
    return fixingResult
  }
}
