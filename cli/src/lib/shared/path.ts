import * as path from 'path'
import {
  DEFAULT_DEEPLINT_FOLDER,
  DEFAULT_DEEPLINT_MODULE_FOLDER,
  DEFAULT_DEEPLINT_POLICY_FOLDER,
  ROOT_MODULE_NAME,
} from '../constant'

const PWD_PATH = process.cwd()

export function resolveModulePath(moduleName: string, moduleUses: string): string {
  if (moduleName === ROOT_MODULE_NAME) {
    return PWD_PATH
  }
  const modulePath = moduleUses.startsWith('./') ? path.resolve(moduleUses) :
    path.join(PWD_PATH, DEFAULT_DEEPLINT_FOLDER, DEFAULT_DEEPLINT_MODULE_FOLDER, moduleName)
  return modulePath
}

export function resolvePolicyPath(moduleName: string, policyName: string, policyUses: string): string {
  const policyPath = policyUses.startsWith('./') ? path.resolve(policyUses) :
    path.join(PWD_PATH, DEFAULT_DEEPLINT_FOLDER, DEFAULT_DEEPLINT_MODULE_FOLDER, moduleName, DEFAULT_DEEPLINT_POLICY_FOLDER, policyName)
  return policyPath
}

