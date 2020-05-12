import Context from './context'
import {StackLintConfig} from './config'

export default class StackLint {
  context: Context | undefined

  constructor(context: Context) {
    this.context = context
  }

  static async build(stackLintConfig: StackLintConfig): Promise<StackLint> {
    return new StackLint(await Context.build())
  }

  async run(options: any): Promise<any> {
    // 1. Check options
    return this.context
  }
}
