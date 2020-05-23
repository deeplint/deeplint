import {StackLintConfig} from './config'
import {Policy} from './policy/policy'
import YamlReader from './shared/YamlReader'
import * as path from 'path'
import * as fs from 'fs'

const DEFAULT_STACKLINT_CONFIG_FILE_NAME = 'stacklint.yaml'

export class StackLint {
  stackLintConfig: StackLintConfig

  policies: Map<string, Policy> = new Map<string, Policy>()

  private constructor(stackLintConfig: StackLintConfig) {
    this.stackLintConfig = stackLintConfig
  }

  static async build(configFile?: string): Promise<StackLint> {
    const configPath = path.resolve(configFile || DEFAULT_STACKLINT_CONFIG_FILE_NAME)
    if (fs.existsSync(configPath)) {
      const stackLintConfig: StackLintConfig = YamlReader.load(configPath)
      const stackLint = new StackLint(stackLintConfig)
      await stackLint.init()
      return stackLint
    }
    throw new Error('Can not find StackLint config file')
  }

  async init(): Promise<void> {
    Object.keys(this.stackLintConfig.policies).map(async key => {
      const policy = await Policy.build(this.stackLintConfig.policies[key], key)
      this.policies.set(key, policy)
    })
  }

  async show(policyKey?: string): Promise<any> {
    return null
  }

  async plan(): Promise<CheckingPlan | null> {
    return null
  }

  async check(checkingPlan: CheckingPlan | null): Promise<FixingPlan | null> {
    /**
     await Promise.all(Object.keys(this.stackLintConfig.plugins).map(async key => {
      const plugin = await Policy.build(this.stackLintConfig.plugins[key])
      const res = await plugin.getAllRuleResults()
      results.push(...res)
    }))
     */
    return null
  }

  async fix(fixingPlan: FixingPlan | null): Promise<boolean> {
    /**
     await Promise.all(Object.keys(this.stackLintConfig.plugins).map(async key => {
      const plugin = await Policy.build(this.stackLintConfig.plugins[key])
      const res = await plugin.getAllRuleResults()
      results.push(...res)
    }))
     */
    return true
  }
}
