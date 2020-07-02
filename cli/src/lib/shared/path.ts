import * as path from 'path'
import {
  DEFAULT_DEEPLINT_FOLDER,
  DEFAULT_DEEPLINT_MODULE_FOLDER,
  DEFAULT_DEEPLINT_PACKAGE_FOLDER,
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

export function resolvePackagePath(moduleName: string, packageName: string, packageUses: string): string {
  const packagePath = packageUses.startsWith('./') ? path.resolve(packageUses) :
    path.join(PWD_PATH, DEFAULT_DEEPLINT_FOLDER, DEFAULT_DEEPLINT_MODULE_FOLDER, moduleName,   DEFAULT_DEEPLINT_PACKAGE_FOLDER, packageName)
  return packagePath
}

