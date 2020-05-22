export interface WorkflowConfig {
  main: string;
  with: {
    [key: string]: any;
  };
}
export interface StackLintConfig {
  policies: {
    [key: string]: WorkflowConfig;
  };
}
