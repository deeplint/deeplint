import * as path from 'path'
import {
  DEFAULT_PACK_SPEC_FILE_NAME,
} from '../constant'

const PWD_PATH = process.cwd()

export function resolveLocalNodeModule(nodeModuleName: string, pathName?: string): string {
  const paths = [PWD_PATH]
  if (pathName) {
    paths.push(pathName)
  }
  return require.resolve(nodeModuleName, {paths: paths})
}

export function resolvePackPath(packUses: string): string {
  return path.dirname(resolveLocalNodeModule(packUses + path.sep + DEFAULT_PACK_SPEC_FILE_NAME))
}

export function resolveFunctionPath(uses: string, packPath: string): string {
  return resolveLocalNodeModule(uses, packPath)
}
