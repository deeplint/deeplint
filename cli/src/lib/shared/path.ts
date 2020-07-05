import * as path from 'path'
import {
  DEFAULT_PACKAGE_SPEC_FILE_NAME,
} from '../constant'

const PWD_PATH = process.cwd()

export function resolveLocalNodeModule(nodeModuleName: string, pathName?: string): string {
  const paths = [PWD_PATH]
  if (pathName) {
    paths.push(pathName)
  }
  return path.dirname(require.resolve(nodeModuleName, {paths: paths}))
}

export function resolvePackagePath(packageUses: string): string {
  return resolveLocalNodeModule(packageUses + path.sep + DEFAULT_PACKAGE_SPEC_FILE_NAME)
}

export function resolveFunctionPath(uses: string, packagePath: string): string {
  return resolveLocalNodeModule(uses, packagePath)
}
