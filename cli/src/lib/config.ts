export interface PolicyConfig {
  main: string;
  with: {
    [key: string]: any;
  };
}
export interface StackLintConfig {
  policies: {
    [key: string]: PolicyConfig;
  };
}
