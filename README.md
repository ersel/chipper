# Chipper 🔬

> Chipper `|'tʃɪpə|` adjective, informal, Northern England
> 
> cheerful and lively

## What is Chipper?
Chipper is a static analysis tool which examines ES6 imports across your codebase.

## Why use Chipper?
You can use Chipper to find out:


> What are the consumers of a module, directory of modules, a 3rd party dependency or an alias?

`$ chipper surface lodash`

> What are all the dependencies of a module or a directory of modules?

`$ chipper dependencies src/services/`

> Which modules can make use of an alias definition?

`$ chipper naylias my-utils --alias my-utils:src/utils/`

## Installation

You can install chipper globally via npm.

`npm i chipper -g`

CLI should be available after installation, type `chipper` and you should see the help screen.

## Usage
Chipper has 3 commands `surface`, `dependencies`, and `naylias`. A scan is done when you run chipper for the first time. After the scan is complete, chipper will cache the results in `.chipper` directory. You can find the raw scan data in json files.

`surface` and `dependencies` commands produce a HTML report. 

`naylias` command prints the list of modules that could use as alias.

### Options
All 3 chipper commands accepts the same set of options. All options have defaults set, so you only need to pass them if you need to change the default behaviour.

```
--targetDir        Target scan directory
```

You can pass a relative path. Chipper will look for all files under that directory to scan for imports. By default this will be set to the current working directory.

```                                                         
--projectRoot      Project root path                                                             
```

You can set project root path by passing an absolute path. By default this will be set to the directory where you are running the `chipper` command from.

```
--ext              File extensions to be matched 
```

You can pass a list of file extensions to be searched for. By default chipper will only scan for `.js` files. You can pass multiple extensions by doing `--ext js,mjs,ts`

```
--incl             Glob patterns to include in scan                            
```
You can pass list of glob patterns to search for files `*.js,*.ts`. By default it will match all js files in all directories recursively. `**/*.js` 

```
--excl             Glob patterns to exclude in scan                                              
```
You can pass a list of globals to be excluded from scan. By default everything under node_modules directory would be ignored. 

```
--alias            Alias used within your project. 
```
You can define aliases used within your project using the --`alias` option followed by the absolute path to aliased directory. Chipper can consume multiple alias options.

```
--rescan           Invalidates chipper cache and forces a rescan
```
Chipper caches scan results in the `.chipper` directory by calculating a hash of all the options. If Chipper is re-run with the same options, instead of doing a scan it will use the cached data. Passing `--rescan` option will invalidate the cache and do a full scan.


### Commands
#### surface (surf for short)
You can use the surface command to see all dependents of a certain module, a directory of modules, a 3rd party dependency from `node_modules`, or an alias.

See all modules which rely on lodash:

`chipper surface lodash`

See all modules which rely on a local module:
`chipper surface src/utils/calculateDuration.js`

See all modules which rely on a directory of modules:

`chipper surface src/utils/`

See all modules which rely on an alias:

`chipper surface my-awesome-services --alias my-awesome-services:/home/my-project/src/utils`

#### dependencies (dep for short)
You can use dependencies command to see a list of all imports by a module or a directory of modules.

See all dependencies of all 
`chipper dependencies src/utils/calculateDuration.js`

See all dependencies of all JS modules under `src/utils` directory.
`chipper dependencies src/utils/`

It's also possible to use the dependencies command with an alias.

### naylias (nay)
You can use naylias command to find out if any JavaScript module in your project is not making use of an alias definition.

`chipper naylias my-awesome-services --alias my-awesome-services:/home/my-project/src/utils`

## Limitations
Currently only root level imports are supported.

Dynamic imports are not supported.

## Contributing
Feedback and contributions are welcome. Feel free to open issues if you encounter any problems.