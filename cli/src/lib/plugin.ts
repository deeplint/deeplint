import {Context, Resource, RuleResult} from './context'
import {PluginConfig} from './config'
import * as path from 'path'
import * as fs from 'fs'
import * as _ from 'lodash'
import YamlReader from './shared/YamlReader'

export class Plugin {
  private pluginConfig: PluginConfig

  private pluginPath: string

  private constructor(pluginConfig: PluginConfig, pluginPath: string) {
    this.pluginConfig = pluginConfig
    this.pluginPath = pluginPath
  }

  static async build(options: { [key: string]: any }): Promise<Plugin> {
    const pluginPath = path.resolve(options.main)
    console.log(pluginPath + path.sep + 'stacklint-plugin.yaml')
    if (path.isAbsolute(pluginPath) &&
      fs.existsSync(pluginPath + path.sep + 'stacklint-plugin.yaml')) {
      return new Plugin(YamlReader.load(pluginPath + path.sep + 'stacklint-plugin.yaml'),
        pluginPath)
    }
    throw new Error('Can not find the plugin')
  }

  async getAllRuleResults(): Promise<RuleResult[]> {
    // 2，Initialize providers
    // 3. Run each provider to collect resources
    // 4. Run rules against resources

    const results: RuleResult[] = new Array<RuleResult>()
    const resources = await this.getAllResources()
    console.log(resources)

    await Promise.all(Object.keys(this.pluginConfig.rules).map(async ruleKey => {
      const res = await this.getRuleResult(ruleKey, resources)
      results.push(...res)
    }))
    return results
  }

  async getRuleResult(ruleKey: string, resources: Resource[]): Promise<RuleResult[]> {
    // 2，Initialize providers
    // 3. Run each provider to collect resources
    // 4. Run rules against resources
    if (_.has(this.pluginConfig.rules, ruleKey)) {
      const rule = this.pluginConfig.rules[ruleKey]
      const ruleMain = require(this.pluginPath + path.sep + rule.main)
      return ruleMain.handler({})
    }
    throw new Error('can not find the provider')
  }

  async getAllResources(): Promise<Resource[]> {
    const results: Resource[] = new Array<Resource>()
    await Promise.all(Object.keys(this.pluginConfig.providers).map(async providerKey => {
      const res = await this.getResources(providerKey)
      results.push(...res)
    }))
    return results
  }

  async getResources(providerKey: string): Promise<Resource[]> {
    if (_.has(this.pluginConfig.providers, providerKey)) {
      const provider = this.pluginConfig.providers[providerKey]
      const providerMain = require(this.pluginPath + path.sep + provider.main)
      return providerMain.handler({})
    }
    throw new Error('can not find the provider')
  }
}
