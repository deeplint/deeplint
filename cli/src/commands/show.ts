import {Command, flags} from '@oclif/command'
import {StackLint} from '../lib/stacklint'

export default class Show extends Command {
  static description = 'Show policy checking plans'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    const stackLint = await StackLint.build()
    const result = await stackLint.show()
    result.forEach((value, key) => {
      this.log(key)
      this.log(JSON.stringify(value))
    })
  }
}
