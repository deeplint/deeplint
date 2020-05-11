import Context from './context'
import {StacklintConfig} from './config'

export default class StackLint {
  context: Context | undefined

  constructor(context: Context) {
    this.context = context
  }

  static async build(stackLintConfig: StacklintConfig): Promise<StackLint> {
    return new StackLint(await Context.build())
  }

  async run(options: any): Promise<any> {
    // 1. Check options
    return this.context
  }
}
