import {Context, Resource, RuleResult} from './context'
import {PluginConfig} from './config'
import * as path from 'path'

export class Plugin {
  private pluginConfig: PluginConfig
  private pluginDir: string

  private constructor(pluginConfig: PluginConfig) {
    this.pluginConfig = pluginConfig
  }

  static async build(options: { [key: string]: string }, pluginConfig: PluginConfig): Promise<Plugin> {
    // Validate the config and construc the Plugin
    console.log(path.resolve(options.main))
    return new Plugin(pluginConfig)
  }

  async getResult(): Promise<RuleResult[]> {
    // 2，Initialize providers
    // 3. Run each provider to collect resources
    // 4. Run rules against resources
    return [{
      resource: 'test',
      message: 'this is a test',
    }]
  }

  async getResources(): Promise<Resource[]> {
    const results: RuleResult[] = new Array<RuleResult>()
    return results
  }
}
