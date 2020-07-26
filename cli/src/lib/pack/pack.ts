import * as path from 'path'
import YamlReader from '../shared/yaml-reader'
import {CheckingResult, FixingResult, Meta, Resource, Snapshot} from './model'
import {Invoker} from './invoker'
import * as _ from 'lodash'
import {DEFAULT_PACK_SPEC_FILE_NAME} from '../constant'
import {CheckContext, Context} from './context'
import {validate} from './validate'
import {processInputs} from '../shared/input-processing'
import {resolveFunctionPath, resolvePackPath} from '../shared/path'
import * as fs from 'fs'
import {PackConfig} from '../config'

export class Pack {
  readonly meta: Meta

  private readonly processedInputs: { [key: string]: any }

  constructor(meta: Meta, processedInputs: { [key: string]: any }) {
    this.meta = meta
    this.processedInputs = processedInputs
  }

  get rules() {
    return this.meta.packSpec.rules
  }

  get name() {
    return this.meta.packName
  }

  get path() {
    return this.meta.packPath
  }

  get actions() {
    return this.meta.packSpec.actions
  }

  get scanners() {
    return this.meta.packSpec.scanners
  }

  get inputs() {
    return this.processedInputs
  }

  static async build(packConfig: PackConfig, packName: string): Promise<Pack> {
    const packPath: string = resolvePackPath(packConfig.uses)
    if (!fs.existsSync(packPath + path.sep + DEFAULT_PACK_SPEC_FILE_NAME)) {
      throw new Error(`Can not find the pack: ${packName} with path: ${packPath}`)
    }

    const packSpec = YamlReader.load(packPath + path.sep + DEFAULT_PACK_SPEC_FILE_NAME)
    if (!validate('PackSpec', packSpec)) {
      throw new Error(`Pack spec ${JSON.stringify(packSpec)} does not follow the required format`)
    }
    const inputs = processInputs(packName, packConfig.with, packSpec.inputs)
    const processedPackSpec = YamlReader.loadWithData(packPath + path.sep + DEFAULT_PACK_SPEC_FILE_NAME, inputs)
    return new Pack({
      packName: packName,

      packPath: packPath,

      packSpec: processedPackSpec,

      packConfig: packConfig,

    }, inputs)
  }

  async snap(): Promise<Snapshot> {
    const resources: {
      [key: string]: Resource[];
    } = {}
    await Promise.all(Object.keys(this.meta.packSpec.scanners).map(async scannerKey => {
      const functionPath = resolveFunctionPath(this.meta.packSpec.scanners[scannerKey].uses, this.meta.packPath)
      const context = new Context(this.meta, this.meta.packSpec.scanners[scannerKey].with)
      const resources_temp: Resource[] = await Invoker.run(context, functionPath, this.meta.packSpec.scanners[scannerKey].main)
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
      result: {},
    }
    await Promise.all(Object.keys(this.rules).map(async ruleKey => {
      const context = new CheckContext(this.meta, snapshot, this.rules[ruleKey].with)
      const functionPath = resolveFunctionPath(this.meta.packSpec.rules[ruleKey].uses, this.meta.packPath)
      const problems = await Invoker.run(context, functionPath, this.rules[ruleKey].main)
      for (const problem of problems) {
        if (!validate('Problem', problem)) {
          throw new Error(`Checking Result ${JSON.stringify(problem)} does not follow the required format`)
        }
      }
      checkingResult.result[ruleKey] = {
        meta: this.rules[ruleKey].meta,
        problems: problems,
      }
    }))
    return checkingResult
  }

  async fix(checkingResult: CheckingResult): Promise<FixingResult> {
    const fixingResult: FixingResult = {
      timestamp: new Date(),
      fixes: [],
    }
    await Promise.all(Object.keys(checkingResult.result).map(async key => {
      checkingResult.result[key].problems.map(async problem => {
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
