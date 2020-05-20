import {Context, Resource, RuleResult} from './context'
import * as path from 'path'
import * as fs from 'fs'
import * as _ from 'lodash'
import YamlReader from '../shared/YamlReader'
import {PolicySpec} from './spec'
import {PolicyConfig} from '../config'

const DEFAULT_POLICY_SPEC_FILE_NAME = 'stacklint-policy.yaml'

export class Policy {
  private readonly policyName: string

  private readonly policyPath: string

  private readonly policyConfig: PolicyConfig

  private readonly policySpec: PolicySpec

  private constructor(policyConfig: PolicyConfig, policyName: string, policyPath: string, policySpec: PolicySpec) {
    this.policyName = policyName
    this.policyConfig = policyConfig
    this.policyPath = policyPath
    this.policySpec = policySpec
  }

  static getPolicySpec(policyPath: string): PolicySpec {
    return YamlReader.load(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)
  }

  static async build(policyConfig: PolicyConfig, name: string): Promise<Policy> {
    let policyPath: string
    if (policyConfig.main.startsWith('./')) {
      policyPath = path.resolve(policyConfig.main)
      if (!fs.existsSync(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)) {
        throw new Error(`Can not find the policy: ${this.name} with path: ${policyConfig.main}`)
      }
    } else if (policyConfig.main.startsWith('http')) {
      throw new Error('Git based policy sharing is not supported yet')
    } else {
      throw new Error('Node module based policy sharing is not supported yet')
    }
    return new Policy(policyConfig, name, policyPath, this.getPolicySpec(policyPath))
  }

  async getAllRuleResults(): Promise<RuleResult[]> {
    const results: RuleResult[] = new Array<RuleResult>()
    const resources = await this.getAllResources()

    await Promise.all(Object.keys(this.policySpec.rules).map(async ruleKey => {
      const res = await this.getRuleResult(ruleKey, resources)
      results.push(...res)
    }))
    return results
  }

  async getRuleResult(ruleKey: string): Promise<RuleResult[]> {
    // 2，Initialize providers
    // 3. Run each provider to collect resources
    // 4. Run rules against resources
    if (_.has(this.policySpec.rules, ruleKey)) {
      const rule = this.policySpec.rules[ruleKey]
      const ruleMain = require(this.policySpec + path.sep + rule.main)
      return ruleMain.handler({})
    }
    throw new Error('can not find the provider')
  }

  async getAllResources(): Promise<Resource[]> {
    const results: Resource[] = new Array<Resource>()
    await Promise.all(Object.keys(this.policySpec.providers).map(async providerKey => {
      const res = await this.getResources(providerKey)
      results.push(...res)
    }))
    return results
  }

  async getResources(providerKey: string): Promise<Resource[]> {
    if (_.has(this.policySpec.providers, providerKey)) {
      const provider = this.policySpec.providers[providerKey]
      const providerPath = path.resolve(this.policyPath, provider.main)
      const providerMain = require(providerPath)
      return providerMain.handler({})
    }
    throw new Error('can not find the provider')
  }
}
