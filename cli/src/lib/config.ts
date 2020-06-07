import {PolicyConfig} from './module/spec'

export interface ModuleConfig {
  uses: string;
  version?: string;
  with?: {
    [key: string]: any;
  };
}

export interface DeepLintConfig {
  modules?: {
    [key: string]: ModuleConfig;
  };
  policies?: {
    [key: string]: PolicyConfig;
  };
}
