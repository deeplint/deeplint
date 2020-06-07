import {DEFAULT_DEEPLINT_CONFIG_FILE_NAME, DEFAULT_MODULE_SPEC_FILE_NAME, ROOT_MODULE_NAME} from './constant'
import * as fs from 'fs'
import * as path from 'path'
import {DeepLintConfig} from './config'
import YamlReader from './shared/yaml-reader'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import {resolveModulePath, resolvePolicyPath} from './shared/path'
import {ModuleSpec} from './module/spec'

export async function checkoutFromGit(gitURL: string, version: string, dir: string): Promise<void> {
  await git.clone({
    fs,
    http,
    dir: dir,
    url: gitURL,
    depth: 1,
  })
  await git.checkout({
    fs,
    dir: dir,
    ref: version,
  })
}

export async function init(configFile?: string): Promise<void> {
  const configPath = path.resolve(configFile || DEFAULT_DEEPLINT_CONFIG_FILE_NAME)
  if (fs.existsSync(configPath)) {
    const deepLintConfig: DeepLintConfig = YamlReader.load(configPath)
    if (deepLintConfig.policies) {
      await Object.keys(deepLintConfig.policies).map(async key => {
        if (deepLintConfig.policies && deepLintConfig.policies[key].uses.toLowerCase().startsWith('http') &&
          deepLintConfig.policies[key].uses.toLowerCase().endsWith('git')) {
          const dir = resolvePolicyPath(ROOT_MODULE_NAME, key, deepLintConfig.policies[key].uses.toLowerCase())
          await checkoutFromGit(deepLintConfig.policies[key].uses, deepLintConfig.policies[key].version, dir)
        }
      })
    }
    if (deepLintConfig.modules) {
      await Object.keys(deepLintConfig.modules).map(async moduleKey => {
        if (deepLintConfig.modules && deepLintConfig.modules[moduleKey].uses.toLowerCase().startsWith('http') &&
          deepLintConfig.modules[moduleKey].uses.toLowerCase().endsWith('git') && deepLintConfig.modules[moduleKey].version) {
          const dir = resolveModulePath(moduleKey, deepLintConfig.modules[moduleKey].uses.toLowerCase())
          await checkoutFromGit(deepLintConfig.modules[moduleKey].uses, deepLintConfig.modules[moduleKey].version, dir)
          const moduleSpec: ModuleSpec = YamlReader.load(dir + path.sep + DEFAULT_MODULE_SPEC_FILE_NAME)
          if (moduleSpec.policies) {
            await Object.keys(moduleSpec.policies).map(async key => {
              if (deepLintConfig.policies && deepLintConfig.policies[key].uses.toLowerCase().startsWith('http') &&
                deepLintConfig.policies[key].uses.toLowerCase().endsWith('git')) {
                const dir = resolvePolicyPath(moduleKey, key, deepLintConfig.policies[key].uses.toLowerCase())
                await checkoutFromGit(deepLintConfig.policies[key].uses, deepLintConfig.policies[key].version, dir)
              }
            })
          }
        }
      })
    }
  }
}
