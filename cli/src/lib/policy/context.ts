import {Resource} from './model'
import {PolicySpec} from './spec'

export class Context {
  readonly inputs: object

  readonly policyName: string

  readonly policyPath: string

  readonly policySpec: PolicySpec

  private resources: Map<string, Resource[]> = new Map<string, Resource[]>()

  constructor(policyName: string, policyPath: string, policySpec: PolicySpec, inputs: object) {
    this.inputs = inputs
  }
}
