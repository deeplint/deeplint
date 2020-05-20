export interface Result {
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
  readonly inputs: object

  private results: Map<string, Result[]> = new Map<string, Result[]>()

  private resources: Map<string, Resource[]> = new Map<string, Resource[]>()

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

  reportResource(resources: Resource[], providerKey: string): void {
    if (!this.resources.has(providerKey)) {
      this.resources.set(providerKey, resources)
    }
    this.resources.get(providerKey)?.push(...resources)
  }

  getProviderResources(providerKey: string): Array<Resource> | undefined {
    return this.resources.get(providerKey)
  }
}
