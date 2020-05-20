import {StackLintConfig} from './config'
import {Policy} from './policy/policy'
import {RuleResult} from './policy/context'

export default class StackLint {
  stackLintConfig: StackLintConfig
  policies: Map<string, Policy> = new Map<string, Policy>()

  private constructor(stackLintConfig: StackLintConfig) {
    this.stackLintConfig = stackLintConfig
  }

  async init(): Promise<void> {
    // build and validate the policy object
    await Promise.all(Object.keys(this.stackLintConfig.policies).map(async key => {
      const policy = await Policy.build(this.stackLintConfig.policies[key])
      this.policies.set(key, policy)
      results.push(...res)
    }))
  }

  static async build(stackLintConfig: StackLintConfig): Promise<StackLint> {
    const stackLint = new StackLint(stackLintConfig)
    await stackLint.init()
    return stackLint
  }

  async run(): Promise<any> {
    const results: RuleResult[] = new Array<RuleResult>()
    await Promise.all(Object.keys(this.stackLintConfig.plugins).map(async key => {
      const plugin = await Policy.build(this.stackLintConfig.plugins[key])
      const res = await plugin.getAllRuleResults()
      results.push(...res)
    }))
    return results
  }
}
