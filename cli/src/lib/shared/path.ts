import * as path from 'path'
import {
  DEFAULT_PACKAGE_SPEC_FILE_NAME,
} from '../constant'

const PWD_PATH = process.cwd()

export function resolveLocalNodeModule(nodeModuleName: string): string {
  return path.dirname(require.resolve(nodeModuleName, {paths: [PWD_PATH]}))
}

export function resolvePackagePath(packageName: string, packageUses: string): string {
  return resolveLocalNodeModule(packageUses + path.sep + DEFAULT_PACKAGE_SPEC_FILE_NAME)
}

