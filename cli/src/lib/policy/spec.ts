export interface ProviderSpec {
  type: string;
  main: string;
  handler: string;
}

export interface RuleSpec {
  type: string;
  main: string;
  handler: string;
  meta: {
    type: string;
    description: string;
    category: string;
    deprecated: boolean;
  };
}

export interface ActionSpec {
  type: string;
  main: string;
  handler: string;
}

export interface InputSpec {
  type: 'String' | 'Number' | 'Boolean';
  description?: string;
  default: string;
}

export interface PolicySpec {
  inputs: {
    [key: string]: InputSpec;
  };
  providers: {
    [key: string]: ProviderSpec;
  };
  rules: {
    [key: string]: RuleSpec;
  };
  actions: {
    [key: string]: ActionSpec;
  };
}
