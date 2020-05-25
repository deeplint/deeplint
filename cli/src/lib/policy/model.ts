import {RuleSpec, PolicySpec} from './spec'
import {PolicyConfig} from '../config'

export interface PolicyInfo {
  PolicyConfig: PolicyConfig;
  PolicySpec: PolicySpec;
}

export interface Resource {
  key: { [key: string]: any };
  properties: { [key: string]: any };
}

export interface CheckingPlan {
  resources: {
    [key: string]: Resource[];
  };
  rules: {
    [key: string]: RuleSpec;
  };
}

export interface Result {
  resource?: string;
  message: string;
  data?: {
    [key: string]: any;
  };
  fix?: string;
}

export interface FixingPlan {
  [key: string]: Result;
}

export interface FixingResult {
  [key: string]: boolean;
}