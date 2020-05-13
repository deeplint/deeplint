import {Context, RuleResult} from './context'
import {PluginConfig} from './config'

export class Plugin {
  private pluginConfig: PluginConfig

  private constructor(pluginConfig: PluginConfig) {
    this.pluginConfig = pluginConfig
  }

  static async build(pluginConfig: any): Promise<Plugin> {
    // Validate the config and construc the Plugin
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

  async getResources(): Promise<any> {
    // 1. Check options
    // 2，Initialize providers
    // 3. Run each provider to collect resources
    // 4. Run rules against resources
    return null
  }
}
