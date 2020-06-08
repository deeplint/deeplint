DeepLint CLI
==============

DeepLint is an open-source cloud security and excellence tool that helps you check cloud environments and infrastructure-as-code templates
to find and fix misconfigurations. 

[![Version](https://img.shields.io/npm/v/deeplint.svg)](https://npmjs.org/package/deeplint)
[![Downloads/week](https://img.shields.io/npm/dw/@deeplint/cli.svg)](https://npmjs.org/package/@deeplint/cli)
[![License](https://img.shields.io/npm/l/@deeplint/cli.svg)](https://github.com/deeplint/deeplint/blob/master/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g deeplint
$ deeplint COMMAND
running command...
$ deeplint (-v|--version|version)
deeplint/0.4.0 darwin-x64 node-v12.13.1
$ deeplint --help [COMMAND]
USAGE
  $ deeplint COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`deeplint check`](#deeplint-check)
* [`deeplint fix`](#deeplint-fix)
* [`deeplint help [COMMAND]`](#deeplint-help-command)
* [`deeplint install`](#deeplint-install)
* [`deeplint scan`](#deeplint-scan)
* [`deeplint show`](#deeplint-show)

## `deeplint check`

Execute checking plan

```
USAGE
  $ deeplint check

OPTIONS
  -h, --help               show CLI help
  -o, --out=out            Output file
  -s, --snapshot=snapshot  Snapshot file
```

_See code: [src/commands/check.ts](https://github.com/deeplint/deeplint/blob/v0.4.0/src/commands/check.ts)_

## `deeplint fix`

Fix founded problems based on fixing plan

```
USAGE
  $ deeplint fix

OPTIONS
  -f, --force
  -h, --help   show CLI help
```

_See code: [src/commands/fix.ts](https://github.com/deeplint/deeplint/blob/v0.4.0/src/commands/fix.ts)_

## `deeplint help [COMMAND]`

display help for deeplint

```
USAGE
  $ deeplint help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `deeplint install`

Initialize the workspace, download required modules and policies

```
USAGE
  $ deeplint install

OPTIONS
  -f, --force
  -h, --help   show CLI help
```

_See code: [src/commands/install.ts](https://github.com/deeplint/deeplint/blob/v0.4.0/src/commands/install.ts)_

## `deeplint scan`

Scan resources in the cloud environments and generate snapshot

```
USAGE
  $ deeplint scan

OPTIONS
  -h, --help     show CLI help
  -o, --out=out  snapshot output file
```

_See code: [src/commands/scan.ts](https://github.com/deeplint/deeplint/blob/v0.4.0/src/commands/scan.ts)_

## `deeplint show`

Display the modules, policies, snapshots and checking results in the human-readable format

```
USAGE
  $ deeplint show

OPTIONS
  -c, --check=check
  -f, --force
  -h, --help               show CLI help
  -m, --module=module
  -p, --policy=policy
  -s, --snapshot=snapshot
```

_See code: [src/commands/show.ts](https://github.com/deeplint/deeplint/blob/v0.4.0/src/commands/show.ts)_
<!-- commandsstop -->
