export interface ProviderSpec {
  using: string;
  main: string;
  handler: string;
}

export interface RuleSpec {
  using: string;
  main: string;
  meta: {
    type: string;
    description: string;
    category: string;
    deprecated: boolean;
  };
}

export interface ActionSpec {
  using: string;
  main: string;
}

export interface PolicySpec {
  resources: {
    [key: string]: ProviderSpec;
  };
  rules: {
    [key: string]: RuleSpec;
  };
  actions: {
    [key: string]: ActionSpec;
  };
}
