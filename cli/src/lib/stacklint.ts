import {StackLintConfig} from './config'
import {Policy} from './policy/policy'
import YamlReader from './shared/YamlReader'
import * as path from 'path'
import * as fs from 'fs'
import {CheckingPlan, FixingPlan, FixingResult, PolicyInfo} from './policy/model'

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

  async show(policyKey?: string): Promise<Map<string, PolicyInfo>> {
    const res = new Map<string, PolicyInfo>()
    if (policyKey) {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res.set(policyKey, await policy.show())
    } else {
      await Promise.all(Object.keys(this.stackLintConfig.policies).map(async policyKey => {
        const policy = this.policies.get(policyKey)
        if (policy === undefined) {
          throw (new Error(`Can not locate policy: ${policyKey}`))
        }
        res.set(policyKey, await policy.show())
      }))
    }
    return res
  }

  async plan(policyKey?: string): Promise<Map<string, CheckingPlan>> {
    const res = new Map<string, CheckingPlan>()
    if (policyKey) {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res.set(policyKey, await policy.plan())
    } else {
      await Promise.all(Object.keys(this.stackLintConfig.policies).map(async policyKey => {
        const policy = this.policies.get(policyKey)
        if (policy === undefined) {
          throw (new Error(`Can not locate policy: ${policyKey}`))
        }
        res.set(policyKey, await policy.plan())
      }))
    }
    return res
  }

  async check(checkingPlans?: Map<string, CheckingPlan>): Promise<Map<string, FixingPlan>> {
    const res = new Map<string, FixingPlan>()
    if (checkingPlans) {
      await Promise.all(Object.keys(checkingPlans).map(async policyKey => {
        const policy = this.policies.get(policyKey)
        if (policy === undefined) {
          throw (new Error(`Can not locate policy: ${policyKey}`))
        }
        res.set(policyKey, await policy.check(checkingPlans.get(policyKey)))
      }))
    } else {
      await Promise.all(Object.keys(this.stackLintConfig.policies).map(async policyKey => {
        const policy = this.policies.get(policyKey)
        if (policy === undefined) {
          throw (new Error(`Can not locate policy: ${policyKey}`))
        }
        res.set(policyKey, await policy.check())
      }))
    }
    return res
  }

  async fix(fixingPlans: Map<string, FixingPlan>): Promise<Map<string, FixingResult>> {
    const res = new Map<string, FixingResult>()
    await Promise.all(Object.keys(fixingPlans).map(async policyKey => {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res.set(policyKey, await policy.fix(fixingPlans.get(policyKey)))
    }))
    return res
  }
}
