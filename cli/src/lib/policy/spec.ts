export interface ScannerSpec {
  type: string;
  uses: string;
  main: string;
}

export interface RuleSpec {
  type: string;
  uses: string;
  main: string;
  meta: {
    type: string;
    description: string;
    category: string;
    deprecated: boolean;
  };
}

export interface ActionSpec {
  type: string;
  uses: string;
  main: string;
}

export interface InputSpec {
  type: 'String' | 'Number' | 'Boolean';
  description?: string;
  default: string;
}

export interface MetaSpec {
  name: string;
  author: string;
  description?: string;
  policyFormatVersion: '1.0.0';
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
