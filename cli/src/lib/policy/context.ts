export interface Result {
  resource: string;
  message: string;
}

export class Context {
  readonly inputs: object

  private results: Map<string, Result[]> = new Map<string, Result[]>()

  constructor(inputs: object) {
    this.inputs = inputs
  }

  static async build(config: object): Promise<Context> {
    return new Context(config)
  }

  getRuleResult(ruleKey: string): Array<Result> | undefined {
    return this.results.get(ruleKey)
  }

  reportRuleResult(results: Result[], ruleKey: string): void {
    if (!this.results.has(ruleKey)) {
      this.results.set(ruleKey, results)
    }
    this.results.get(ruleKey)?.push(...results)
  }
}
