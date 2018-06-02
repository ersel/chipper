#!/usr/bin/env node
const prog = require('caporal');
const ramda = require('ramda');
const scanner = require('./lib/scanner/cache/');
const packageJSON = require('./package.json');

prog.version(packageJSON.version);

const GLOBAL_CHIPPER_OPTIONS = [
	['--targetDir', 'Target scan directory', prog.STRING, '.'],
	['--projectRoot', 'Project root path', prog.STRING, process.cwd()],
	['--ext', 'File extensions to be matched', prog.LIST, 'js'],
	['--incl', 'Glob patterns to include in scan', prog.LIST, '**/*.js'],
	[
		'--excl',
		'Glob patterns to exclude in scan',
		prog.LIST,
		'node_modules/**'
	],
	[
		'--alias',
		'Alias used within your project. E.g: my-alias-name:path/to/my/alias',
		prog.REPEATABLE,
		'',
		false
	],
	[
		'--rescan',
		'Invalidates chipper cache and forces a rescan',
		prog.BOOL,
		false,
		false
	]
];

const surfaceCmd = prog
	.command(
		'surface',
		'Examine the surface area of a module or a directory of modules'
	)
	.alias('s')
	.action((args, opts) => {
		const aliases = ramda.flatten([opts.alias]).reduce((acc, alias) => {
			const [k, v] = alias.split(':');
			acc[k] = v;
			return acc;
		}, {});
		scanner(
			{
				targetDirectory: opts.targetDir,
				projectRootPath: opts.projectRoot,
				includedPatterns: opts.incl,
				excludedPatterns: opts.excl,
				extensions: opts.ext,
				aliases
			},
			opts.rescan
		).then(results => {
			console.log(results);
		});
		// todo: check args if it's a node_module, a single module, or a directory of modules
	});

const depsCmd = prog
	.command(
		'dependencies',
		'List all imports by a module or a directory of modules'
	)
	.alias('d')
	.action((args, options) => {
		console.log(args, options);
	});

GLOBAL_CHIPPER_OPTIONS.map(o => surfaceCmd.option(...o));
GLOBAL_CHIPPER_OPTIONS.map(o => depsCmd.option(...o));

prog.parse(process.argv);
