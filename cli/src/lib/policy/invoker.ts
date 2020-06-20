import {Context} from './context'
import {Problem} from './model'

export class Invoker {
  static async run(context: Context | Problem | null, path: string, handler: string): Promise<any> {
    try {
      const functions = require(path)
      return functions[handler](context)
    } catch (error) {
      throw error
    }
  }
}
