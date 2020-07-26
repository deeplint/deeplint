export interface PackConfig {
  uses: string;
  with?: {
    [key: string]: any;
  };
}
export interface DeepLintConfig {
  packs: {
    [key: string]: PackConfig;
  };
}
