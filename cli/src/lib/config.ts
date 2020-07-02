import {PackageConfig} from './module/spec'

export interface ModuleConfig {
  uses: string;
  version: string;
  with?: {
    [key: string]: any;
  };
}

export interface DeepLintConfig {
  modules?: {
    [key: string]: ModuleConfig;
  };
  packages?: {
    [key: string]: PackageConfig;
  };
}
