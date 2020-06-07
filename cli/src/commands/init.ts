import {Command, flags} from '@oclif/command'
import {init} from '../lib/init'

export default class Init extends Command {
  static description = 'Initialize the workspace, download required modules and policies'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    const {flags} = this.parse(Init)

    await init()
  }
}
