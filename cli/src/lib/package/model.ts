import {PackageSpec} from './spec'
import {PackageConfig} from '../module/spec'

export interface Meta {
  readonly packageName: string;

  readonly packagePath: string;

  readonly packageSpec: PackageSpec;

  readonly packageConfig: PackageConfig;

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

export interface Problem {
  message: string;
  data?: {
    [key: string]: any;
  };
  fix?: {
    action?: string;
    advice?: string;
  };
}

export interface CheckingResult {
  timestamp: Date;
  problems: {
    [key: string]: Problem[];
  };
}

export interface Fix {
  rule: string;
  problem: Problem;
  isFixed?: boolean;
  error?: string;
}

export interface FixingResult {
  timestamp: Date;
  fixes: Fix[];
}
