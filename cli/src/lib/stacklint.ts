import {StackLintConfig} from './config'
import {Plugin} from './plugin'

export default class StackLint {
  stackLintConfig: StackLintConfig

  private constructor(stackLintConfig: StackLintConfig) {
    this.stackLintConfig = stackLintConfig
  }

  static async build(stackLintConfig: StackLintConfig): Promise<StackLint> {
    // validate the config and construct StackLint
    return new StackLint(stackLintConfig)
  }

  async run(options: { [key: string]: any }): Promise<any> {
    // 1. Check options
    // 2. Run each plugin to collect results
    const results: any[] = []
    await Promise.all(Object.keys(this.stackLintConfig.plugins).map(async key => {
      const plugin = await Plugin.build(this.stackLintConfig.plugins[key])

      results.push(await plugin.getResult())
    }))

    return results
  }
}
