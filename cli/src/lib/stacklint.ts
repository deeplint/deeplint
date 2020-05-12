import {StackLintConfig} from './config'

export default class StackLint {

  static async build(stackLintConfig: StackLintConfig): Promise<StackLint> {
    return new StackLint()
  }

  async run(options: any): Promise<any> {
    // 1. Check options
    // 3. Run each plugin to collect results

    // 4. Run extra local rules
    return null
  }
}
