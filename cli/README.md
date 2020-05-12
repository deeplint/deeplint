@stacklint/cli
==============

StackLint

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@stacklint/cli.svg)](https://npmjs.org/package/@stacklint/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@stacklint/cli.svg)](https://npmjs.org/package/@stacklint/cli)
[![License](https://img.shields.io/npm/l/@stacklint/cli.svg)](https://github.com/stacklint/stacklint/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @stacklint/cli
$ stacklint COMMAND
running command...
$ stacklint (-v|--version|version)
@stacklint/cli/0.1.0 darwin-x64 node-v12.13.1
$ stacklint --help [COMMAND]
USAGE
  $ stacklint COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`stacklint hello [FILE]`](#stacklint-hello-file)
* [`stacklint help [COMMAND]`](#stacklint-help-command)
* [`stacklint run [FILE]`](#stacklint-run-file)

## `stacklint hello [FILE]`

describe the command here

```
USAGE
  $ stacklint hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ stacklint hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/stacklint/stacklint/blob/v0.1.0/src/commands/hello.ts)_

## `stacklint help [COMMAND]`

display help for stacklint

```
USAGE
  $ stacklint help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `stacklint run [FILE]`

describe the command here

```
USAGE
  $ stacklint run [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/run.ts](https://github.com/stacklint/stacklint/blob/v0.1.0/src/commands/run.ts)_
<!-- commandsstop -->
