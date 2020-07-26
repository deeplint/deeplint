import {Command, flags} from '@oclif/command'
import {Deeplint} from '../lib/deeplint'
import * as chalk from 'chalk'
import * as figures from 'figures'
import * as _ from 'lodash'
import {Meta} from '../lib/pack/model'
import YamlReader from '../lib/shared/yaml-reader'

export default class Show extends Command {
  static description = 'Display the packs, snapshots and checking results in the human-readable format'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),

    pack: flags.string({char: 'p'}),

    snapshot: flags.string({char: 's'}),

    check: flags.string({char: 'c'}),
  }

  async run() {
    const {flags} = this.parse(Show)

    try {
      this.log(` ${figures.tick} ${chalk.green.bold('Initializing DeepLint')} \n`)
      const deeplint = await Deeplint.build()
      this.log(` ${figures.tick} ${chalk.green.bold('Retrieving packs')} \n`)
      const packs = deeplint.getPacksMeta()
      this.log(` ${figures.tick} ${chalk.green.bold('Showing...')} \n`)
      if (flags.pack) {
        const dlPack = packs[flags.pack]
        if (dlPack) {
          this.showPack(dlPack)
        } else {
          this.error(`Can not find pack: ${chalk.red(flags.pack)}`)
        }
      } else if (flags.snapshot) {
        const snapshot = YamlReader.load(flags.snapshot)
        this.log(JSON.stringify(snapshot, null, 4))
      } else if (flags.check) {
        const check = YamlReader.load(flags.check)
        this.log(JSON.stringify(check, null, 4))
      } else {
        this.showSummary(packs)
      }
    } catch (error) {
      this.error(error)
    }
  }

  showSummary(result: { [key: string]: Meta }): void {
    const Table = require('cli-table')
    const table = new Table({
      head: ['Pack', 'Scanners', 'Rules', 'Actions'],
    })
    for (const packKey of Object.keys(result)) {
      table.push([
        chalk.blue(packKey),
        _.size(result[packKey].packSpec.scanners),
        _.size(result[packKey].packSpec.rules),
        _.size(result[packKey].packSpec.actions),
      ])
    }

    this.log(table.toString())
  }

  showPack(packMeta: Meta): void {
    const Table = require('cli-table')
    const table = new Table()
    table.push(
      {Name: packMeta.packName},
      {Path: packMeta.packPath},
      {Rules: JSON.stringify(packMeta.packSpec.rules, null, 4)},
      {Providers: JSON.stringify(packMeta.packSpec.scanners, null, 4)},
      {Actions: JSON.stringify(packMeta.packSpec.actions, null, 4)},
      {Inputs: JSON.stringify(packMeta.packSpec.inputs, null, 4)},
      {Configs: JSON.stringify(packMeta.packConfig, null, 4)},
    )
    this.log(table.toString())
  }
}
