import * as path from 'path'
import {Policy} from '../policy/policy'
import {DEFAULT_MODULE_SPEC_FILE_NAME} from '../constant'
import YamlReader from '../shared/yaml-reader'
import {ModuleSpec} from './spec'
import {applyInputs, processInputs} from '../shared/input-processing'
import {ModuleConfig} from '../config'
import {resolveModulePath} from '../shared/path'
import {CheckingResults, FixingResults, Meta, Snapshot} from '../policy/model'

export class Module {
  readonly meta: {
    readonly moduleName: string;
    readonly moduleConfig?: ModuleConfig;
    readonly modulePath: string;
    readonly moduleSpec: ModuleSpec;
  }

  private readonly policies: Map<string, Policy>

  constructor(meta: {
    readonly moduleName: string;
    readonly moduleConfig: ModuleConfig;
    readonly modulePath: string;
    readonly moduleSpec: ModuleSpec;
  }, policies: Map<string, Policy>) {
    this.meta = meta
    this.policies = policies
  }

  static async build(moduleConfig: ModuleConfig, moduleName: string): Promise<Module> {
    // 1. Get and validate the module path
    const modulePath: string = resolveModulePath(moduleName, moduleConfig.uses)

    // 2. Load and validate module spec
    const moduleSpec = YamlReader.load(modulePath + path.sep + DEFAULT_MODULE_SPEC_FILE_NAME)

    // 3. Process and apply inputs
    const inputs = processInputs(name, moduleConfig.with, moduleSpec.inputs)
    const processedModuleSpec = applyInputs(moduleSpec, inputs)

    // 4. Build policies
    const policies: Map<string, Policy> = new Map<string, Policy>()

    await Object.keys(processedModuleSpec.policies).map(async key => {
      const policy = await Policy.build(processedModuleSpec.policies[key], key, moduleName)
      policies.set(key, policy)
    })

    return new Module({
      moduleName: moduleName,
      moduleConfig: moduleConfig,
      modulePath: modulePath,
      moduleSpec: moduleSpec,
    }, policies)
  }

  getPoliciesMeta(): { [key: string]: Meta } {
    const res: { [key: string]: Meta } = {}

    Object.keys(this.meta.moduleSpec.policies).map(async policyKey => {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res[policyKey] = policy.meta
    })
    return res
  }

  async snap(): Promise<{ [key: string]: Snapshot }> {
    const res: { [key: string]: Snapshot } = {}
    await Promise.all(Object.keys(this.meta.moduleSpec.policies).map(async policyKey => {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res[policyKey] = await policy.snap()
    }))

    return res
  }

  async check(snapshots: { [key: string]: Snapshot }): Promise<{ [key: string]: CheckingResults }> {
    const res: { [key: string]: CheckingResults } = {}

    await Promise.all(Object.keys(snapshots).map(async policyKey => {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res[policyKey] = await policy.check(snapshots[policyKey])
    }))

    return res
  }

  async fix(checkingResults: { [key: string]: CheckingResults }): Promise<{ [key: string]: FixingResults }> {
    const res: { [key: string]: FixingResults } = {}
    await Promise.all(Object.keys(checkingResults).map(async policyKey => {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res[policyKey] = await policy.fix(checkingResults[policyKey])
    }))
    return res
  }
}
