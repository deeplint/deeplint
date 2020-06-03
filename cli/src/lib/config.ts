export interface PolicyConfig {
  main: string;
  with: {
    [key: string]: any;
  };
}
export interface DeepLintConfig {
  policies: {
    [key: string]: PolicyConfig;
  };
}
