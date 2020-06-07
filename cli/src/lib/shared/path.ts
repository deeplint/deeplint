import * as fs from 'fs'
import * as path from 'path'
import {
  DEFAULT_DEEPLINT_FOLDER,
  DEFAULT_DEEPLINT_MODULE_FOLDER,
  DEFAULT_DEEPLINT_POLICY_FOLDER,
  DEFAULT_POLICY_SPEC_FILE_NAME,
} from '../constant'

const PWD_PATH = process.cwd()

export function resolveModulePath(moduleName: string, moduleUses: string): string {
  console.log(path.resolve())
  const modulePath = moduleUses.startsWith('./') ? path.resolve(moduleUses) :
    path.join(PWD_PATH, DEFAULT_DEEPLINT_FOLDER, DEFAULT_DEEPLINT_MODULE_FOLDER, moduleName)

  console.log(modulePath)

  if (!fs.existsSync(modulePath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)) {
    throw new Error(`Can not find the module: ${moduleName} with path: ${moduleUses}`)
  }
  return modulePath
}

export function resolvePolicyPath(moduleName: string, policyName: string, policyUses: string): string {
  console.log(path.resolve())
  const policyPath = policyUses.startsWith('./') ? path.resolve(policyUses) :
    path.join(PWD_PATH, DEFAULT_DEEPLINT_FOLDER, DEFAULT_DEEPLINT_MODULE_FOLDER, moduleName, DEFAULT_DEEPLINT_POLICY_FOLDER, policyName)
  console.log(policyPath)

  if (!fs.existsSync(policyPath + path.sep + DEFAULT_POLICY_SPEC_FILE_NAME)) {
    throw new Error(`Can not find the policy: ${policyName} in module: ${moduleName} with path: ${policyUses}`)
  }
  return policyPath
}

