import {Command, flags} from '@oclif/command'
import {install} from '../lib/install'

export default class Install extends Command {
  static description = 'Initialize the workspace, download required modules and policies'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    const {flags} = this.parse(Install)

    await install()
  }
}
