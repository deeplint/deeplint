import {Resource} from './model'
import {PolicySpec} from './spec'

export class Context {
  readonly processedInputs: object

  readonly policyName: string

  readonly policyPath: string

  readonly policySpec: PolicySpec

  private resources: { [key: string]: Resource[] } = {}

  constructor(policyName: string, policyPath: string, policySpec: PolicySpec, processedInputs: object) {
    this.processedInputs = processedInputs
    this.policyName = policyName
    this.policyPath = policyPath
    this.policySpec = policySpec
  }

  setResources(resources: { [key: string]: Resource[] }): void {
    this.resources = resources
  }

  getResources() {
    return this.resources
  }
}
