import {Command, flags} from '@oclif/command'

export default class Fix extends Command {
  static description = 'Fix founded problems based on fixing plan'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    this.log('Fixing command is not implemented yet')
  }
}
