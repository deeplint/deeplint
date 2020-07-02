import {DEFAULT_DEEPLINT_CONFIG_FILE_NAME, DEFAULT_MODULE_SPEC_FILE_NAME, ROOT_MODULE_NAME} from './constant'
import * as fs from 'fs'
import * as path from 'path'
import {DeepLintConfig} from './config'
import YamlReader from './shared/yaml-reader'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import {resolveModulePath, resolvePackagePath} from './shared/path'
import {ModuleSpec} from './module/spec'

export async function checkoutFromGit(gitURL: string, dir: string, version?: string): Promise<void> {
  await git.clone({
    fs,
    http,
    dir: dir,
    url: gitURL,
    depth: 1,
  })
  if (version) {
    await git.checkout({
      fs,
      dir: dir,
      ref: version,
    })
  }
}

export async function install(configFile?: string): Promise<void> {
  const configPath = path.resolve(configFile || DEFAULT_DEEPLINT_CONFIG_FILE_NAME)
  if (fs.existsSync(configPath)) {
    const deepLintConfig: DeepLintConfig = YamlReader.load(configPath)
    if (deepLintConfig.packages) {
      await Object.keys(deepLintConfig.packages).map(async key => {
        if (deepLintConfig.packages && deepLintConfig.packages[key].uses.toLowerCase().startsWith('http') &&
          deepLintConfig.packages[key].uses.toLowerCase().endsWith('git')) {
          const dir = resolvePackagePath(ROOT_MODULE_NAME, key, deepLintConfig.packages[key].uses.toLowerCase())
          await checkoutFromGit(deepLintConfig.packages[key].uses, dir, deepLintConfig.packages[key].version)
        }
      })
    }
    if (deepLintConfig.modules) {
      await Object.keys(deepLintConfig.modules).map(async moduleKey => {
        if (deepLintConfig.modules && deepLintConfig.modules[moduleKey].uses.toLowerCase().startsWith('http') &&
          deepLintConfig.modules[moduleKey].uses.toLowerCase().endsWith('git')) {
          const dir = resolveModulePath(moduleKey, deepLintConfig.modules[moduleKey].uses.toLowerCase())
          await checkoutFromGit(deepLintConfig.modules[moduleKey].uses, dir, deepLintConfig.modules[moduleKey].version)
          const moduleSpec: ModuleSpec = YamlReader.load(dir + path.sep + DEFAULT_MODULE_SPEC_FILE_NAME)
          if (moduleSpec.packages) {
            await Object.keys(moduleSpec.packages).map(async key => {
              if (deepLintConfig.packages && deepLintConfig.packages[key].uses.toLowerCase().startsWith('http') &&
                deepLintConfig.packages[key].uses.toLowerCase().endsWith('git')) {
                const dir = resolvePackagePath(moduleKey, key, deepLintConfig.packages[key].uses.toLowerCase())
                await checkoutFromGit(deepLintConfig.packages[key].uses, dir, deepLintConfig.packages[key].version)
              }
            })
          }
        }
      })
    }
  }
}
