import {StackLintConfig} from './config'
import {Policy} from './policy/policy'
import YamlReader from './shared/yaml-reader'
import * as path from 'path'
import * as fs from 'fs'
import {DEFAULT_SNAPSHOT_OUTPUT, DEFAULT_STACKLINT_CONFIG_FILE_NAME} from './constant'
import {CheckingResults, FixingResults, Meta, Snapshot} from './policy/model'

export class StackLint {
  private readonly stackLintConfig: StackLintConfig

  private readonly policies: Map<string, Policy>

  private constructor(stackLintConfig: StackLintConfig, policies: Map<string, Policy>) {
    this.stackLintConfig = stackLintConfig
    this.policies = policies
  }

  static async build(configFile?: string): Promise<StackLint> {
    const configPath = path.resolve(configFile || DEFAULT_STACKLINT_CONFIG_FILE_NAME)
    if (fs.existsSync(configPath)) {
      const stackLintConfig: StackLintConfig = YamlReader.load(configPath)
      const policies: Map<string, Policy> = new Map<string, Policy>()
      await Object.keys(stackLintConfig.policies).map(async key => {
        const policy = await Policy.build(stackLintConfig.policies[key], key)
        policies.set(key, policy)
      })
      return new StackLint(stackLintConfig, policies)
    }
    throw new Error('Can not find StackLint config file')
  }

  static async loadSnapshot(snapshotPath?: string): Promise<{
    [key: string]: Snapshot;
  } | undefined> {
    const snapshotFullPath = path.resolve(snapshotPath || DEFAULT_SNAPSHOT_OUTPUT)
    if (fs.existsSync(snapshotFullPath)) {
      return YamlReader.load(snapshotFullPath)
    }
    return undefined
  }

  getPoliciesMeta(): {
    [key: string]: Meta;
    } {
    const res: {
      [key: string]: Meta;
    } = {}

    Object.keys(this.stackLintConfig.policies).map(async policyKey => {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res[policyKey] = policy.meta
    })
    return res
  }

  async snap(): Promise<{
    [key: string]: Snapshot;
  }> {
    const res: {
      [key: string]: Snapshot;
    } = {}

    await Promise.all(Object.keys(this.stackLintConfig.policies).map(async policyKey => {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res[policyKey] = await policy.snap()
    }))

    return res
  }

  async check(snapshots: {
    [key: string]: Snapshot;
  }): Promise<{ [key: string]: CheckingResults }> {
    const res: { [key: string]: CheckingResults } = {}

    await Promise.all(Object.keys(snapshots).map(async policyKey => {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res[policyKey] = await policy.check(snapshots[policyKey])
    }))

    return res
  }

  async fix(checkingResults: { [key: string]: CheckingResults }): Promise<{ [key: string]: FixingResults }> {
    const res: { [key: string]: FixingResults } = {}
    await Promise.all(Object.keys(checkingResults).map(async policyKey => {
      const policy = this.policies.get(policyKey)
      if (policy === undefined) {
        throw (new Error(`Can not locate policy: ${policyKey}`))
      }
      res[policyKey] = await policy.fix(checkingResults[policyKey])
    }))
    return res
  }
}
