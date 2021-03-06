import * as path from 'path'
import YamlReader from '../shared/yaml-reader'
import {CheckingResult, FixingResult, Meta, Resource, Snapshot} from './model'
import {Invoker} from './invoker'
import * as _ from 'lodash'
import {DEFAULT_PACKAGE_SPEC_FILE_NAME} from '../constant'
import {CheckContext, Context} from './context'
import {validate} from './validate'
import {processInputs} from '../shared/input-processing'
import {resolveFunctionPath, resolvePackagePath} from '../shared/path'
import * as fs from 'fs'
import {PackageConfig} from '../config'

export class Package {
  readonly meta: Meta

  private readonly processedInputs: { [key: string]: any }

  constructor(meta: Meta, processedInputs: { [key: string]: any }) {
    this.meta = meta
    this.processedInputs = processedInputs
  }

  get rules() {
    return this.meta.packageSpec.rules
  }

  get name() {
    return this.meta.packageName
  }

  get path() {
    return this.meta.packagePath
  }

  get actions() {
    return this.meta.packageSpec.actions
  }

  get scanners() {
    return this.meta.packageSpec.scanners
  }

  get inputs() {
    return this.processedInputs
  }

  static async build(packageConfig: PackageConfig, packageName: string): Promise<Package> {
    const packagePath: string = resolvePackagePath(packageConfig.uses)
    if (!fs.existsSync(packagePath + path.sep + DEFAULT_PACKAGE_SPEC_FILE_NAME)) {
      throw new Error(`Can not find the package: ${packageName} with path: ${packagePath}`)
    }

    const packageSpec = YamlReader.load(packagePath + path.sep + DEFAULT_PACKAGE_SPEC_FILE_NAME)
    if (!validate('PackageSpec', packageSpec)) {
      throw new Error(`Package spec ${JSON.stringify(packageSpec)} does not follow the required format`)
    }
    const inputs = processInputs(packageName, packageConfig.with, packageSpec.inputs)
    const processedPackageSpec = YamlReader.loadWithData(packagePath + path.sep + DEFAULT_PACKAGE_SPEC_FILE_NAME, inputs)
    return new Package({
      packageName: packageName,

      packagePath: packagePath,

      packageSpec: processedPackageSpec,

      packageConfig: packageConfig,

    }, inputs)
  }

  async snap(): Promise<Snapshot> {
    const resources: {
      [key: string]: Resource[];
    } = {}
    await Promise.all(Object.keys(this.meta.packageSpec.scanners).map(async scannerKey => {
      const functionPath = resolveFunctionPath(this.meta.packageSpec.scanners[scannerKey].uses, this.meta.packagePath)
      const context = new Context(this.meta, this.meta.packageSpec.scanners[scannerKey].with)
      const resources_temp: Resource[] = await Invoker.run(context, functionPath, this.meta.packageSpec.scanners[scannerKey].main)
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
      const functionPath = resolveFunctionPath(this.meta.packageSpec.rules[ruleKey].uses, this.meta.packagePath)
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
