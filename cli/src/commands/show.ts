import {Command, flags} from '@oclif/command'
import {StackLint} from '../lib/stacklint'

export default class Show extends Command {
  static description = 'Show policies information'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{}]

  async run() {
    const {args, flags} = this.parse(Show)
    const stackLint = await StackLint.build()
    const result = await stackLint.show()
    result.forEach((value, key) => {
      this.log(key)
      this.log(JSON.stringify(value))
    })
  }
}
