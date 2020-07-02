import {InputSpec, MetaSpec} from '../package/spec'

export interface PackageConfig {
  uses: string;
  version?: string;
  with?: {
    [key: string]: any;
  };
}

export interface ModuleSpec {
  meta?: MetaSpec;
  inputs?: {
    [key: string]: InputSpec;
  };
  packages: {
    [key: string]: PackageConfig;
  };
}
