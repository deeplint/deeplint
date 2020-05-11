export default class Context {
  static async build(): Promise<Context> {
    return new Context()
  }

  async run(): Promise<any> {
    return ''
  }
}
