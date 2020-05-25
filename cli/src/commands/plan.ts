import {Command, flags} from '@oclif/command'
import {StackLint} from '../lib/stacklint'

export default class Plan extends Command {
  static description = 'Create checking plan'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    const stackLint = await StackLint.build()
    const result = await stackLint.plan()
    result.forEach((value, key) => {
      this.log(key)
      this.log(JSON.stringify(value))
    })
  }
}
