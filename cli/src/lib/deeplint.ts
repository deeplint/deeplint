import {DeepLintConfig} from './config'
import YamlReader from './shared/yaml-reader'
import * as path from 'path'
import * as fs from 'fs'
import {DEFAULT_DEEPLINT_CONFIG_FILE_NAME} from './constant'
import {CheckingResult, FixingResult, Meta, Snapshot} from './package/model'
import {validate} from './package/validate'
import {Package} from './package/package'

export class Deeplint {
  private readonly deepLintConfig: DeepLintConfig

  private readonly packages: {
    [key: string]: Package;
  }

  private constructor(deepLintConfig: DeepLintConfig, packages: {
    [key: string]: Package;
  }) {
    this.deepLintConfig = deepLintConfig
    this.packages = packages
  }

  static async build(configFile?: string): Promise<Deeplint> {
    const configPath = path.resolve(configFile || DEFAULT_DEEPLINT_CONFIG_FILE_NAME)
    if (fs.existsSync(configPath)) {
      const deepLintConfig: DeepLintConfig = YamlReader.load(configPath)
      if (!validate('DeepLintConfig', deepLintConfig)) {
        throw new Error(`DeepLint config ${JSON.stringify(deepLintConfig)} does not follow the required format`)
      }

      const packages: {
        [key: string]: Package;
      } = {}

      await Object.keys(deepLintConfig.packages).map(async key => {
        packages[key] = await Package.build(deepLintConfig.packages[key], key)
      })
      return new Deeplint(deepLintConfig, packages)
    }
    throw new Error('Can not find DeepLint config file')
  }

  getPackagesMeta(): { [key: string]: Meta } {
    const res: { [key: string]: Meta } = {}

    Object.keys(this.packages).map(async packageKey => {
      const dlPackage = this.packages[packageKey]
      if (dlPackage === undefined) {
        throw (new Error(`Can not locate package: ${packageKey}`))
      }
      res[packageKey] = dlPackage.meta
    })
    return res
  }

  async snap(): Promise<{ [key: string]: Snapshot }> {
    const res: { [key: string]: Snapshot } = {}
    await Promise.all(Object.keys(this.packages).map(async packageKey => {
      const dlPackage = this.packages[packageKey]
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
      const dlPackage = this.packages[packageKey]
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
      const dlPackage = this.packages[packageKey]
      if (dlPackage === undefined) {
        throw (new Error(`Can not locate package: ${packageKey}`))
      }
      res[packageKey] = await dlPackage.fix(checkingResults[packageKey])
    }))
    return res
  }
}
