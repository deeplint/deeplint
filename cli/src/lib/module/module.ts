import * as path from 'path'
import {Package} from '../package/package'
import {
  DEFAULT_DEEPLINT_CONFIG_FILE_NAME,
  DEFAULT_MODULE_SPEC_FILE_NAME,
  DEFAULT_PACKAGE_SPEC_FILE_NAME,
  ROOT_MODULE_NAME,
} from '../constant'
import YamlReader from '../shared/yaml-reader'
import {ModuleSpec} from './spec'
import {applyInputs, processInputs} from '../shared/input-processing'
import {ModuleConfig} from '../config'
import {resolveModulePath} from '../shared/path'
import {CheckingResult, FixingResult, Meta, Snapshot} from '../package/model'
import {validate} from '../package/validate'
import * as fs from 'fs'

export class Module {
  readonly meta: {
    readonly moduleName: string;
    readonly moduleConfig?: ModuleConfig;
    readonly modulePath: string;
    readonly moduleSpec: ModuleSpec;
  }

  private readonly packages: Map<string, Package>

  constructor(meta: {
    readonly moduleName: string;
    readonly moduleConfig: ModuleConfig;
    readonly modulePath: string;
    readonly moduleSpec: ModuleSpec;
  }, packages: Map<string, Package>) {
    this.meta = meta
    this.packages = packages
  }

  static async build(moduleConfig: ModuleConfig, moduleName: string): Promise<Module> {
    // 1. Get and validate the module path
    const modulePath: string = resolveModulePath(moduleName, moduleConfig.uses)
    if (moduleName !== ROOT_MODULE_NAME && !fs.existsSync(modulePath + path.sep + DEFAULT_PACKAGE_SPEC_FILE_NAME)) {
      throw new Error(`Can not find the module: ${moduleName} with path: ${modulePath}`)
    }

    if (moduleName === ROOT_MODULE_NAME && !fs.existsSync(modulePath + path.sep + DEFAULT_DEEPLINT_CONFIG_FILE_NAME)) {
      throw new Error(`Can not find the config: ${DEFAULT_DEEPLINT_CONFIG_FILE_NAME}`)
    }

    // 2. Load and validate module spec
    const moduleSpec = moduleName === ROOT_MODULE_NAME ?
      YamlReader.load(modulePath + path.sep + DEFAULT_DEEPLINT_CONFIG_FILE_NAME) : YamlReader.load(modulePath + path.sep + DEFAULT_MODULE_SPEC_FILE_NAME)

    if (!validate('ModuleSpec', moduleSpec)) {
      throw new Error(`Module spec ${JSON.stringify(moduleSpec)} does not follow the required format`)
    }
    // 3. Process and apply inputs
    const inputs = processInputs(moduleName, moduleConfig.with, moduleSpec.inputs)
    const processedModuleSpec = applyInputs(moduleSpec, inputs)

    // 4. Build packages
    const packages: Map<string, Package> = new Map<string, Package>()

    await Object.keys(processedModuleSpec.packages).map(async key => {
      const dlPackage = await Package.build(processedModuleSpec.packages[key], key, moduleName)
      packages.set(key, dlPackage)
    })

    return new Module({
      moduleName: moduleName,
      moduleConfig: moduleConfig,
      modulePath: modulePath,
      moduleSpec: moduleSpec,
    }, packages)
  }

  getPackagesMeta(): { [key: string]: Meta } {
    const res: { [key: string]: Meta } = {}

    Object.keys(this.meta.moduleSpec.packages).map(async packageKey => {
      const dlPackage = this.packages.get(packageKey)
      if (dlPackage === undefined) {
        throw (new Error(`Can not locate package: ${packageKey}`))
      }
      res[packageKey] = dlPackage.meta
    })
    return res
  }

  async snap(): Promise<{ [key: string]: Snapshot }> {
    const res: { [key: string]: Snapshot } = {}
    await Promise.all(Object.keys(this.meta.moduleSpec.packages).map(async packageKey => {
      const dlPackage = this.packages.get(packageKey)
      if (dlPackage === undefined) {
        throw (new Error(`Can not locate package: ${packageKey}`))
      }
      res[packageKey] = await dlPackage.snap()
    }))

    return res
  }

  async check(snapshots: { [key: string]: Snapshot }): Promise<{ [key: string]: CheckingResult }> {
    const res: { [key: string]: CheckingResult } = {}

    await Promise.all(Object.keys(snapshots).map(async packageKey => {
      const dlPackage = this.packages.get(packageKey)
      if (dlPackage === undefined) {
        throw (new Error(`Can not locate package: ${packageKey}`))
      }
      res[packageKey] = await dlPackage.check(snapshots[packageKey])
    }))

    return res
  }

  async fix(checkingResults: { [key: string]: CheckingResult }): Promise<{ [key: string]: FixingResult }> {
    const res: { [key: string]: FixingResult } = {}
    await Promise.all(Object.keys(checkingResults).map(async packageKey => {
      const dlPackage = this.packages.get(packageKey)
      if (dlPackage === undefined) {
        throw (new Error(`Can not locate package: ${packageKey}`))
      }
      res[packageKey] = await dlPackage.fix(checkingResults[packageKey])
    }))
    return res
  }
}
