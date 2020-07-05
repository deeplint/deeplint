export interface PackageConfig {
  uses: string;
  with?: {
    [key: string]: any;
  };
}
export interface DeepLintConfig {
  packages: {
    [key: string]: PackageConfig;
  };
}
