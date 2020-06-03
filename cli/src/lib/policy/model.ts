import {PolicySpec} from './spec'
import {PolicyConfig} from '../config'

export interface Meta {
  readonly policyName: string;

  readonly policyPath: string;

  readonly policySpec: PolicySpec;

  readonly policyConfig: PolicyConfig;

}

export interface Resource {
  name: string;
  type: string;
  properties: { [key: string]: any };
  meta?: { [key: string]: any };
}

export interface Snapshot {
  timestamp: Date;
  resources: {
    [key: string]: Resource[];
  };
}

export interface CheckingResult {
  passed: boolean;
  problem?: {
    resource?: string;
    message: string;
    data?: {
      [key: string]: any;
    };
    fix?: string;
  };
}

export interface CheckingResults {
  [key: string]: CheckingResult;
}

export interface FixingResults {
  [key: string]: boolean;
}
