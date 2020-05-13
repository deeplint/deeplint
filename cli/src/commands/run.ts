import {Command, flags} from '@oclif/command'
import YamlReader from '../lib/shared/YamlReader'
import StackLint from "../lib/stacklint";

export default class Run extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Run)

    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/yyy/Workspace/stacklint/stacklint/cli/src/commands/run.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
    // read stacklint.yaml
    const stackLintConfig = YamlReader.load('./stacklint.yaml')
    // initialize StackLint and run
    const stackLint = await StackLint.build(stackLintConfig)
    const result = await stackLint.run()
    this.log(result)
  }
}
