import {DeepLintConfig} from './config'
import YamlReader from './shared/yaml-reader'
import * as path from 'path'
import * as fs from 'fs'
import {DEFAULT_DEEPLINT_CONFIG_FILE_NAME, ROOT_MODULE_NAME} from './constant'
import {CheckingResults, FixingResults, Meta, Snapshot} from './policy/model'
import {Module} from './module/module'
import {validate} from './policy/validate';

export class Deeplint {
  private readonly deepLintConfig: DeepLintConfig

  private readonly modules: { [key: string]: Module }

  private constructor(deepLintConfig: DeepLintConfig, modules: { [key: string]: Module }) {
    this.deepLintConfig = deepLintConfig
    this.modules = modules
  }

  static async build(configFile?: string): Promise<Deeplint> {
    const configPath = path.resolve(configFile || DEFAULT_DEEPLINT_CONFIG_FILE_NAME)
    if (fs.existsSync(configPath)) {
      const deepLintConfig: DeepLintConfig = YamlReader.load(configPath)
      if (!validate('DeepLintConfig', deepLintConfig)) {
        throw new Error(`DeepLint config ${JSON.stringify(deepLintConfig)} does not follow the required format`)
      }
      const modules: { [key: string]: Module } = {}
      modules[ROOT_MODULE_NAME] = await Module.build({
        uses: ROOT_MODULE_NAME,
      }, ROOT_MODULE_NAME)

      if (deepLintConfig.modules) {
        await Promise.all(Object.keys(deepLintConfig.modules).map(async moduleKey => {
          if (deepLintConfig.modules && deepLintConfig.modules[moduleKey]) {
            modules[moduleKey] = await Module.build(deepLintConfig.modules[moduleKey], moduleKey)
          }
        }))
      }
      return new Deeplint(deepLintConfig, modules)
    }
    throw new Error('Can not find DeepLint config file')
  }

  getPoliciesMeta(): { [key: string]: { [key: string]: Meta } } {
    const res: { [key: string]: { [key: string]: Meta } } = {}
    Object.keys(this.modules).map(async moduleKey => {
      const module = this.modules[moduleKey]
      if (module === undefined) {
        throw (new Error(`Can not locate module: ${moduleKey}`))
      }
      res[moduleKey] = module.getPoliciesMeta()
    })
    return res
  }

  async snap(): Promise<{ [key: string]: { [key: string]: Snapshot } }> {
    const res: { [key: string]: { [key: string]: Snapshot } } = {}

    await Promise.all(Object.keys(this.modules).map(async moduleKey => {
      const module = this.modules[moduleKey]
      if (module === undefined) {
        throw (new Error(`Can not locate module: ${moduleKey}`))
      }
      res[moduleKey] = await module.snap()
    }))

    return res
  }

  async check(snapshots: { [key: string]: { [key: string]: Snapshot } }): Promise<{ [key: string]: { [key: string]: CheckingResults } }> {
    const res: { [key: string]: { [key: string]: CheckingResults } } = {}
    await Promise.all(Object.keys(snapshots).map(async moduleKey => {
      const module = this.modules[moduleKey]
      if (module === undefined) {
        throw (new Error(`Can not locate module: ${module}`))
      }
      res[moduleKey] = await module.check(snapshots[moduleKey])
    }))
    return res
  }

  async fix(checkingResults: { [key: string]: { [key: string]: CheckingResults } }): Promise<{ [key: string]: { [key: string]: FixingResults } }> {
    const res: { [key: string]: { [key: string]: FixingResults } } = {}
    await Promise.all(Object.keys(checkingResults).map(async moduleKey => {
      const module = this.modules[moduleKey]
      if (module === undefined) {
        throw (new Error(`Can not locate module: ${moduleKey}`))
      }
      res[moduleKey] = await module.fix(checkingResults[moduleKey])
    }))
    return res
  }
}
