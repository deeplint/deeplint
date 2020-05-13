export interface ProviderConfig {
  using: string;
  main: string;
}
export interface RuleConfig {
  using: string;
  main: string;
  meta: {
    type: string;
    description: string;
    category: string;
    deprecated: boolean;
  };
}
export interface PluginConfig {
  providers: {
    [key: string]: ProviderConfig;
  };
  rules: {
    [key: string]: RuleConfig;
  };
}

export interface StackLintConfig {
  plugins: {
    [key: string]: {
      main: string;
      with: {
        [key: string]: any;
      };
    };
  };
}
