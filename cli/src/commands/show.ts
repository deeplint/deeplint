import {Command, flags} from '@oclif/command'
import {StackLint} from '../lib/stacklint'
import * as chalk from 'chalk'
import * as figures from 'figures'
import {Meta} from '../lib/policy/model'
import YamlReader from '../lib/shared/yaml-reader'

export default class Show extends Command {
  static description = 'Display the policies, snapshots and checking results in the human-readable format'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),

    policy: flags.string({char: 'p'}),

    snapshot: flags.string({char: 's'}),

    check: flags.string({char: 'c'}),
  }

  async run() {
    const {flags} = this.parse(Show)

    try {
      this.log(` ${figures.tick} ${chalk.green.bold('Initializing StackLint')} \n`)
      const stackLint = await StackLint.build()
      this.log(` ${figures.tick} ${chalk.green.bold('Retrieving policies')} \n`)
      const policies = stackLint.getPoliciesMeta()
      this.log(` ${figures.tick} ${chalk.green.bold('Showing...')} \n`)
      if (flags.policy) {
        const policy = policies[flags.policy]
        if (policy) {
          this.showPolicy(policies[flags.policy])
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
      // this.showRaw(result)
    } catch (error) {
      this.error(error)
    }
  }

  showSummary(result: {
    [key: string]: Meta;
  }): void {
    const Table = require('cli-table')
    const table = new Table({
      head: ['Policy', 'Providers', 'Rules', 'Actions'],
    })

    for (const policyKey of Object.keys(result)) {
      table.push([chalk.blue(policyKey),
        Object.keys(result[policyKey].policySpec.providers).length,
        Object.keys(result[policyKey].policySpec.rules).length,
        Object.keys(result[policyKey].policySpec.actions).length])
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
      {Providers: JSON.stringify(policyMeta.policySpec.providers, null, 4)},
      {Actions: JSON.stringify(policyMeta.policySpec.actions, null, 4)},
      {Inputs: JSON.stringify(policyMeta.policySpec.inputs, null, 4)},
      {Configs: JSON.stringify(policyMeta.policyConfig, null, 4)},
    )
    this.log(table.toString())
  }
}
