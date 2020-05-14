export interface RuleResult {
  resource: string;
  message: string;
}

export interface Resource {
  [key: string]:
    {
      type: string;
      properties: { [key: string]: any };
    };
}

export class Context {
  private result: Array<RuleResult> = new Array<RuleResult>()

  static async build(): Promise<Context> {
    return new Context()
  }

  get Result(): Array<RuleResult> {
    return this.result
  }

  report(result: RuleResult): boolean {
    this.result.push(result)
    return true
  }
}
