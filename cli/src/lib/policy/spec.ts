export interface MetaSpec {
  name: string;
  author: string;
  description?: string;
  policyFormatVersion: '1.0.0';
  version?: string;
}

export interface ScannerSpec {
  type: string;
  uses: string;
  main: string;
  with?: object;
}

export interface RuleSpec {
  type: string;
  uses: string;
  main: string;
  with?: object;
  meta: {
    type: 'error' | 'warn' | 'info';
    description?: string;
    tags?: string[];
    deprecated?: boolean;
  };
}

export interface ActionSpec {
  type: string;
  uses: string;
  main: string;
  with?: object;
}

export interface InputSpec {
  type: 'String' | 'Number' | 'Boolean';
  description?: string;
  default: string | number | boolean;
}

export interface PolicySpec {
  meta: MetaSpec;
  inputs?: {
    [key: string]: InputSpec;
  };
  scanners: {
    [key: string]: ScannerSpec;
  };
  rules: {
    [key: string]: RuleSpec;
  };
  actions?: {
    [key: string]: ActionSpec;
  };
}
