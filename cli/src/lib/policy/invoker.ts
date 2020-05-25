import {Context} from './context'

export class Invoker {
  static async run(context: Context | null, path: string, handler: string): Promise<any> {
    try {
      const functions = require(path)
      return functions[handler](context)
    } catch (error) {
      throw error
    }
  }
}
