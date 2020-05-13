export interface ProviderConfig {

}

export interface RuleConfig {

}

export interface PluginConfig {
  providers: {
    [key: string]: {};
  };
  rules: {};
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
