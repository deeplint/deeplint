import {Command, flags} from '@oclif/command'
import {StackLint} from '../lib/stacklint'
import * as figures from 'figures'
import * as chalk from 'chalk'
import * as fs from 'fs'
import {DEFAULT_CHECK_OUTPUT} from '../lib/constant'
import YamlReader from '../lib/shared/yaml-reader'

export default class Check extends Command {
  static description = 'Execute checking plan'

  static flags = {
    help: flags.help({char: 'h'}),
    snapshot: flags.string({char: 's', description: 'Snapshot file'}),
    out: flags.string({char: 'o', description: 'Output file'}),
  }

  async run() {
    const {flags} = this.parse(Check)
    try {
      this.log(` ${figures.tick} ${chalk.green.bold('Initializing StackLint')} \n`)

      const stackLint = await StackLint.build()

      this.log(` ${figures.tick} ${chalk.green.bold('Loading Snapshot')} \n`)

      const snapshots = flags.snapshot ? YamlReader.load(flags.snapshot) : await stackLint.snap()

      this.log(` ${figures.tick} ${chalk.green.bold('Checking...')} \n`)

      const result = await stackLint.check(snapshots)
      const out = flags.out || DEFAULT_CHECK_OUTPUT
      this.log(` ${figures.tick} ${chalk.green.bold('Outputting to ')} ${chalk.blue.bold(out)}\n`)

      fs.writeFileSync(out, JSON.stringify(result))
    } catch (error) {
      this.error(error)
    }
  }
}
