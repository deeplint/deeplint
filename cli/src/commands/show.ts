import {Command, flags} from '@oclif/command'
import {Deeplint} from '../lib/deeplint'
import * as chalk from 'chalk'
import * as figures from 'figures'
import * as _ from 'lodash'
import {Meta} from '../lib/policy/model'
import YamlReader from '../lib/shared/yaml-reader'
import {ROOT_MODULE_NAME} from '../lib/constant'

export default class Show extends Command {
  static description = 'Display the modules, policies, snapshots and checking results in the human-readable format'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),

    policy: flags.string({char: 'p'}),

    module: flags.string({char: 'm'}),

    snapshot: flags.string({char: 's'}),

    check: flags.string({char: 'c'}),
  }

  async run() {
    const {flags} = this.parse(Show)

    try {
      this.log(` ${figures.tick} ${chalk.green.bold('Initializing DeepLint')} \n`)
      const deeplint = await Deeplint.build()
      this.log(` ${figures.tick} ${chalk.green.bold('Retrieving modules and policies')} \n`)
      const policies = deeplint.getPoliciesMeta()
      this.log(` ${figures.tick} ${chalk.green.bold('Showing...')} \n`)
      if (flags.policy) {
        const policy = policies[flags.policy]
        if (policy) {
          this.showPolicy(policies[ROOT_MODULE_NAME][flags.policy])
        } else {
          this.error(`Can not find policy: ${chalk.red(flags.policy)}`)
        }
      } else if (flags.snapshot) {
        const snapshot = YamlReader.load(flags.snapshot)
        this.log(JSON.stringify(snapshot, null, 4))
      } else if (flags.check) {
        const check = YamlReader.load(flags.check)
        this.log(JSON.stringify(check, null, 4))
      } else {
        this.showSummary(policies)
      }
    } catch (error) {
      this.error(error)
    }
  }

  showSummary(result: { [key: string]: { [key: string]: Meta } }): void {
    const Table = require('cli-table')
    const table = new Table({
      head: ['Module', 'Policy', 'Providers', 'Rules', 'Actions'],
    })
    for (const moduleKey of Object.keys(result)) {
      for (const policyKey of Object.keys(result[moduleKey])) {
        table.push([
          chalk.blue(moduleKey),
          chalk.blue(policyKey),
          _.size(result[moduleKey][policyKey].policySpec.scanners),
          _.size(result[moduleKey][policyKey].policySpec.rules),
          _.size(result[moduleKey][policyKey].policySpec.actions),
        ])
      }
    }
    this.log(table.toString())
  }

  showPolicy(policyMeta: Meta): void {
    const Table = require('cli-table')
    const table = new Table()
    table.push(
      {Name: policyMeta.policyName},
      {Path: policyMeta.policyPath},
      {Rules: JSON.stringify(policyMeta.policySpec.rules, null, 4)},
      {Providers: JSON.stringify(policyMeta.policySpec.scanners, null, 4)},
      {Actions: JSON.stringify(policyMeta.policySpec.actions, null, 4)},
      {Inputs: JSON.stringify(policyMeta.policySpec.inputs, null, 4)},
      {Configs: JSON.stringify(policyMeta.policyConfig, null, 4)},
    )
    this.log(table.toString())
  }
}
