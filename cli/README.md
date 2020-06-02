@stacklint/cli
==============

StackLint

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@stacklint/cli.svg)](https://npmjs.org/package/@stacklint/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@stacklint/cli.svg)](https://npmjs.org/package/@stacklint/cli)
[![License](https://img.shields.io/npm/l/@stacklint/cli.svg)](https://github.com/stacklint/stacklint/blob/master/LICENSE)

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
@stacklint/cli/0.2.0 darwin-x64 node-v12.13.1
$ stacklint --help [COMMAND]
USAGE
  $ stacklint COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`stacklint check`](#stacklint-check)
* [`stacklint fix`](#stacklint-fix)
* [`stacklint help [COMMAND]`](#stacklint-help-command)
* [`stacklint show`](#stacklint-show)
* [`stacklint snap`](#stacklint-snap)

## `stacklint check`

Execute checking plan

```
USAGE
  $ stacklint check

OPTIONS
  -h, --help               show CLI help
  -o, --out=out            Output file
  -s, --snapshot=snapshot  Snapshot file
```

_See code: [src/commands/check.ts](https://github.com/stacklint/stacklint/blob/v0.2.0/src/commands/check.ts)_

## `stacklint fix`

Fix founded problems based on fixing plan

```
USAGE
  $ stacklint fix

OPTIONS
  -f, --force
  -h, --help   show CLI help
```

_See code: [src/commands/fix.ts](https://github.com/stacklint/stacklint/blob/v0.2.0/src/commands/fix.ts)_

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

## `stacklint show`

Display the policies, snapshots and checking results in the human-readable format

```
USAGE
  $ stacklint show

OPTIONS
  -c, --check=check
  -f, --force
  -h, --help               show CLI help
  -p, --policy=policy
  -s, --snapshot=snapshot
```

_See code: [src/commands/show.ts](https://github.com/stacklint/stacklint/blob/v0.2.0/src/commands/show.ts)_

## `stacklint snap`

Take a snapshot of resources covered in existing workspace

```
USAGE
  $ stacklint snap

OPTIONS
  -h, --help     show CLI help
  -o, --out=out  snapshot output file
```

_See code: [src/commands/snap.ts](https://github.com/stacklint/stacklint/blob/v0.2.0/src/commands/snap.ts)_
<!-- commandsstop -->
