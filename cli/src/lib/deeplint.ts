import {DeepLintConfig} from './config'
import YamlReader from './shared/yaml-reader'
import * as path from 'path'
import * as fs from 'fs'
import {DEFAULT_DEEPLINT_CONFIG_FILE_NAME} from './constant'
import {CheckingResult, FixingResult, Meta, Snapshot} from './pack/model'
import {validate} from './pack/validate'
import {Pack} from './pack/pack'

export class Deeplint {
  private readonly deepLintConfig: DeepLintConfig

  private readonly packs: {
    [key: string]: Pack;
  }

  private constructor(deepLintConfig: DeepLintConfig, packs: {
    [key: string]: Pack;
  }) {
    this.deepLintConfig = deepLintConfig
    this.packs = packs
  }

  static async build(configFile?: string): Promise<Deeplint> {
    const configPath = path.resolve(configFile || DEFAULT_DEEPLINT_CONFIG_FILE_NAME)
    if (fs.existsSync(configPath)) {
      const deepLintConfig: DeepLintConfig = YamlReader.load(configPath)
      if (!validate('DeepLintConfig', deepLintConfig)) {
        throw new Error(`DeepLint config ${JSON.stringify(deepLintConfig)} does not follow the required format`)
      }

      const packs: {
        [key: string]: Pack;
      } = {}

      await Object.keys(deepLintConfig.packs).map(async key => {
        packs[key] = await Pack.build(deepLintConfig.packs[key], key)
      })
      return new Deeplint(deepLintConfig, packs)
    }
    throw new Error('Can not find DeepLint config file')
  }

  getPacksMeta(): { [key: string]: Meta } {
    const res: { [key: string]: Meta } = {}

    Object.keys(this.packs).map(async packKey => {
      const dlPack = this.packs[packKey]
      if (dlPack === undefined) {
        throw (new Error(`Can not locate pack: ${packKey}`))
      }
      res[packKey] = dlPack.meta
    })
    return res
  }

  async snap(): Promise<{ [key: string]: Snapshot }> {
    const res: { [key: string]: Snapshot } = {}
    await Promise.all(Object.keys(this.packs).map(async packKey => {
      const dlPack = this.packs[packKey]
      if (dlPack === undefined) {
        throw (new Error(`Can not locate pack: ${packKey}`))
      }
      res[packKey] = await dlPack.snap()
    }))

    return res
  }

  async check(snapshots: { [key: string]: Snapshot }): Promise<{ [key: string]: CheckingResult }> {
    const res: { [key: string]: CheckingResult } = {}

    await Promise.all(Object.keys(snapshots).map(async packKey => {
      const dlPack = this.packs[packKey]
      if (dlPack === undefined) {
        throw (new Error(`Can not locate pack: ${packKey}`))
      }
      res[packKey] = await dlPack.check(snapshots[packKey])
    }))
    return res
  }

  async fix(checkingResults: { [key: string]: CheckingResult }): Promise<{ [key: string]: FixingResult }> {
    const res: { [key: string]: FixingResult } = {}
    await Promise.all(Object.keys(checkingResults).map(async packKey => {
      const dlPack = this.packs[packKey]
      if (dlPack === undefined) {
        throw (new Error(`Can not locate pack: ${packKey}`))
      }
      res[packKey] = await dlPack.fix(checkingResults[packKey])
    }))
    return res
  }
}
