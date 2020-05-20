export interface ProviderSpec {
  using: string;
  main: string;
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
export interface PolicySpec {
  providers: {
    [key: string]: ProviderSpec;
  };
  rules: {
    [key: string]: RuleSpec;
  };
}
