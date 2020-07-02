import {Meta, Resource, Snapshot} from './model'

export class Context {
  readonly meta: Meta

  readonly inputs: { [key: string]: any }

  constructor(meta: Meta, inputs: { [key: string]: any }) {
    this.meta = meta
    this.inputs = inputs
  }
}

export class CheckContext extends Context {
  private readonly snapshot: Snapshot

  constructor(meta: Meta, inputs: { [key: string]: any }, snapshot: Snapshot) {
    super(meta, inputs)
    this.snapshot = snapshot
  }

  getResources(): {
    [key: string]: Resource[];
    } {
    return this.snapshot.resources
  }
}
