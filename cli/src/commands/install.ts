import {Command, flags} from '@oclif/command'
import {install} from '../lib/install'
import * as figures from 'figures'
import * as chalk from 'chalk'

export default class Install extends Command {
  static description = 'Initialize the workspace, download required modules and packages'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    const {flags} = this.parse(Install)
    this.log(` ${figures.tick} ${chalk.green.bold('Initializing DeepLint')} \n`)

    await install()
  }
}
