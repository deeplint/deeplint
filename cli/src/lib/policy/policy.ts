import * as path from 'path'
import * as fs from 'fs'
import * as _ from 'lodash'
import YamlReader from '../shared/YamlReader'
import {PolicySpec, RuleSpec} from './spec'
import {PolicyConfig} from '../config'
import {CheckingPlan, FixingPlan, PolicyInfo, Resource, Result} from './model'
import {Invoker} from './invoker'

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
    const resources: {
      [key: string]: Resource[];
    } = {}
    await Promise.all(Object.keys(this.policySpec.resources).map(async resourceKey => {
      const functionPath = path.resolve(this.policyPath, this.policySpec.resources[resourceKey].main)
      resources[resourceKey] = await Invoker.run(null, functionPath, this.policySpec.resources[resourceKey].handler)
    }))
    return {
      resources: resources,
      rules: this.policySpec.rules,
    }
  }

  async check(checkingPlan?: CheckingPlan): Promise<FixingPlan> {
    const fixingPlan: {
      [key: string]: Result;
    } = {}
    const checkingPlanLocal: CheckingPlan = checkingPlan || await this.plan()

    await Promise.all(Object.keys(checkingPlanLocal.rules).map(async ruleKey => {
      const functionPath = path.resolve(this.policyPath, checkingPlanLocal.rules[ruleKey].main)
      fixingPlan[ruleKey] = await Invoker.run(null, functionPath, checkingPlanLocal.rules[ruleKey].handler)
    }))

    return fixingPlan
  }

  async fix(fixingPlan?: FixingPlan): Promise<boolean> {
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
