import * as path from 'path'
import {
  DEFAULT_MODULE_SPEC_FILE_NAME, DEFAULT_PACKAGE_SPEC_FILE_NAME,
  ROOT_MODULE_NAME,
} from '../constant'

const PWD_PATH = process.cwd()

export function resolveLocalNodeModule(nodeModuleName: string): string {
  return path.dirname(require.resolve(nodeModuleName, {paths: [PWD_PATH]}))
}

export function resolveModulePath(moduleName: string, moduleUses: string): string {
  if (moduleName === ROOT_MODULE_NAME) {
    return PWD_PATH
  }
  return resolveLocalNodeModule(moduleUses + path.sep + DEFAULT_MODULE_SPEC_FILE_NAME)
}

export function resolvePackagePath(moduleName: string, packageName: string, packageUses: string): string {
  return resolveLocalNodeModule(packageUses + path.sep + DEFAULT_PACKAGE_SPEC_FILE_NAME)
}

