import {StackLintConfig} from './config'
import {Plugin} from './plugin'
import {RuleResult} from './context'

export default class StackLint {
  stackLintConfig: StackLintConfig

  private constructor(stackLintConfig: StackLintConfig) {
    this.stackLintConfig = stackLintConfig
  }

  static async build(stackLintConfig: StackLintConfig): Promise<StackLint> {
    // validate the config and construct StackLint
    return new StackLint(stackLintConfig)
  }

  async run(): Promise<any> {
    const results: RuleResult[] = new Array<RuleResult>()
    await Promise.all(Object.keys(this.stackLintConfig.plugins).map(async key => {
      const plugin = await Plugin.build(this.stackLintConfig.plugins[key])
      const res = await plugin.getAllRuleResults()
      results.push(...res)
    }))
    return results
  }
}
