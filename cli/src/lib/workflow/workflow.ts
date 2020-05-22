import {Context, Result} from './context'
import * as path from 'path'
import * as fs from 'fs'
import * as _ from 'lodash'
import YamlReader from '../shared/YamlReader'
import {PolicySpec} from './spec'
import {PolicyConfig} from '../config'

const DEFAULT_POLICY_SPEC_FILE_NAME = 'stacklint-workflow.yaml'

export interface Resource {
  [key: string]:
    {
      type: string;
      properties: { [key: string]: any };
    };
}

export class Workflow {
  private readonly policyName: string

  private readonly policyPath: string

  private readonly policyConfig: PolicyConfig

  private readonly policySpec: PolicySpec

  private readonly context: Context

  private resources: Map<string, Resource[]> = new Map<string, Resource[]>()

  private constructor(policyConfig: PolicyConfig, policyName: string, policyPath: string, policySpec: PolicySpec) {
    this.policyName = policyName
    this.policyConfig = policyConfig
    this.policyPath = policyPath
    this.policySpec = policySpec
    this.context = new Context(policyConfig)
  }

  static getPolicySpec(policyPath: string): PolicySpec {
    return YamlReader.load(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)
  }

  static async build(policyConfig: PolicyConfig, name: string): Promise<Workflow> {
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
    return new Workflow(policyConfig, name, policyPath, this.getPolicySpec(policyPath))
  }

  /**
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

  async getAllResources(): Promise<Resource[]> {
    const results: Resource[] = new Array<Resource>()
    await Promise.all(Object.keys(this.policySpec.providers).map(async providerKey => {
      const res = await this.getProviderResources(providerKey)
      if (res !== undefined) {
        results.push(...res)
      }
    }))
    return results
  }

  private async getProviderResources(providerKey: string): Promise<Resource[]> {
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

  reportResource(resources: Resource[], providerKey: string): void {
    if (!this.resources.has(providerKey)) {
      this.resources.set(providerKey, resources)
    }
    this.resources.get(providerKey)?.push(...resources)
  }

  getProviderResources(providerKey: string): Array<Resource> | undefined {
    return this.resources.get(providerKey)
  }
}
