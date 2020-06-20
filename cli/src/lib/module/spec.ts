import {InputSpec, MetaSpec} from '../policy/spec'

export interface PolicyConfig {
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
  policies: {
    [key: string]: PolicyConfig;
  };
}
