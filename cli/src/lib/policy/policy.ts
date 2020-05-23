import {Context} from './context'
import * as path from 'path'
import * as fs from 'fs'
import * as _ from 'lodash'
import YamlReader from '../shared/YamlReader'
import {PolicySpec, RuleSpec} from './spec'
import {PolicyConfig} from '../config'

const DEFAULT_POLICY_SPEC_FILE_NAME = 'stacklint-policy.yaml'

export interface PolicyInfo {
  PolicyConfig: PolicyConfig;
  PolicySpec: PolicySpec;
}

export interface Resource {
  key: { [key: string]: any };
  properties: { [key: string]: any };
}

export interface CheckingPlan {
  resources: {
    [key: string]: Resource[];
  };
  rules: {
    [key: string]: RuleSpec;
  };
}

export interface Result {
  resource: string;
  message: string;
  fix: string;
}

export interface FixingPlan {
  [key: string]: Result;
}

export class Policy {
  private readonly policyName: string

  private readonly policyPath: string

  private readonly policyConfig: PolicyConfig

  private readonly policySpec: PolicySpec

  private readonly context: Context

  private constructor(policyConfig: PolicyConfig, policyName: string, policyPath: string, policySpec: PolicySpec) {
    this.policyName = policyName
    this.policyConfig = policyConfig
    this.policyPath = policyPath
    this.policySpec = policySpec
    this.context = new Context(policyConfig)
  }

  static loadPolicySpec(policyPath: string): PolicySpec {
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
    return new Policy(policyConfig, name, policyPath, this.loadPolicySpec(policyPath))
  }

  async show(): Promise<PolicyInfo> {
    return {
      PolicyConfig: this.policyConfig,
      PolicySpec: this.policySpec,
    }
  }

  async plan(): Promise<CheckingPlan> {
    const results: Resource[] = new Array<Resource>()
    await Promise.all(Object.keys(this.policySpec.providers).map(async providerKey => {
      const res = await this.getProviderResources(providerKey)
      if (res !== undefined) {
        results.push(...res)
      }
    }))
    return results
  }

  async check(checkingPlan?: CheckingPlan): Promise<FixingPlan | null> {
    /**
     await Promise.all(Object.keys(this.stackLintConfig.plugins).map(async key => {
      const plugin = await Policy.build(this.stackLintConfig.plugins[key])
      const res = await plugin.getAllRuleResults()
      results.push(...res)
    }))
     */
    return null
  }

  async fix(fixingPlan?: FixingPlan): Promise<boolean> {
    /**
     await Promise.all(Object.keys(this.stackLintConfig.plugins).map(async key => {
      const plugin = await Policy.build(this.stackLintConfig.plugins[key])
      const res = await plugin.getAllRuleResults()
      results.push(...res)
    }))
     */
    return true
  }

  /**
   private async getResourcesForProvider(providerKey: string): Promise<Resource[]> {
    if (_.has(this.policySpec.providers, providerKey)) {
      if (this.context.getProviderResources(providerKey) === undefined) {
        const provider = this.policySpec.providers[providerKey]
        const providerPath = path.resolve(this.policyPath, provider.main)
        const providerMain = require(providerPath)
        providerMain.handler(this.context)
      }
      return this.context.getProviderResources(providerKey)
    }
    throw new Error('Can not find the provider')
  }

   async getAllRuleResults(): Promise<Result[]> {
    const results: Result[] = new Array<Result>()
    const resources = await this.getAllResources()

    await Promise.all(Object.keys(this.policySpec.rules).map(async ruleKey => {
      const res = await this.getRuleResult(ruleKey)
      results.push(...res)
    }))
    return results
  }

   async getRuleResult(ruleKey: string): Promise<Result[]> {
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
   */
}
