import {Command, flags} from '@oclif/command'
import {Deeplint} from '../lib/deeplint'
import * as chalk from 'chalk'
import * as figures from 'figures'
import * as _ from 'lodash'
import {Meta} from '../lib/package/model'
import YamlReader from '../lib/shared/yaml-reader'

export default class Show extends Command {
  static description = 'Display the packages, snapshots and checking results in the human-readable format'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),

    package: flags.string({char: 'p'}),

    snapshot: flags.string({char: 's'}),

    check: flags.string({char: 'c'}),
  }

  async run() {
    const {flags} = this.parse(Show)

    try {
      this.log(` ${figures.tick} ${chalk.green.bold('Initializing DeepLint')} \n`)
      const deeplint = await Deeplint.build()
      this.log(` ${figures.tick} ${chalk.green.bold('Retrieving packages')} \n`)
      const packages = deeplint.getPackagesMeta()
      this.log(` ${figures.tick} ${chalk.green.bold('Showing...')} \n`)
      if (flags.package) {
        const dlPackage = packages[flags.package]
        if (dlPackage) {
          this.showPackage(dlPackage)
        } else {
          this.error(`Can not find package: ${chalk.red(flags.package)}`)
        }
      } else if (flags.snapshot) {
        const snapshot = YamlReader.load(flags.snapshot)
        this.log(JSON.stringify(snapshot, null, 4))
      } else if (flags.check) {
        const check = YamlReader.load(flags.check)
        this.log(JSON.stringify(check, null, 4))
      } else {
        this.showSummary(packages)
      }
    } catch (error) {
      this.error(error)
    }
  }

  showSummary(result: { [key: string]: Meta }): void {
    const Table = require('cli-table')
    const table = new Table({
      head: ['Package', 'Providers', 'Rules', 'Actions'],
    })
    for (const packageKey of Object.keys(result)) {
      table.push([
        chalk.blue(packageKey),
        _.size(result[packageKey].packageSpec.scanners),
        _.size(result[packageKey].packageSpec.rules),
        _.size(result[packageKey].packageSpec.actions),
      ])
    }

    this.log(table.toString())
  }

  showPackage(packageMeta: Meta): void {
    const Table = require('cli-table')
    const table = new Table()
    table.push(
      {Name: packageMeta.packageName},
      {Path: packageMeta.packagePath},
      {Rules: JSON.stringify(packageMeta.packageSpec.rules, null, 4)},
      {Providers: JSON.stringify(packageMeta.packageSpec.scanners, null, 4)},
      {Actions: JSON.stringify(packageMeta.packageSpec.actions, null, 4)},
      {Inputs: JSON.stringify(packageMeta.packageSpec.inputs, null, 4)},
      {Configs: JSON.stringify(packageMeta.packageConfig, null, 4)},
    )
    this.log(table.toString())
  }
}
