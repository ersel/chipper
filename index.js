#!/usr/bin/env node
const prog = require('caporal');
const packageJSON = require('./package.json');
const surfaceAction = require('./cli/surface');
const dependenciesAction = require('./cli/dependencies');
const nayliasAction = require('./cli/naylias');

prog.version(packageJSON.version);

const GLOBAL_OPTIONS = [
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
	.alias('surf')
	.argument(
		'target',
		'Target module or directory of modules to analyse usage.',
		prog.STRING
	)
	.action(surfaceAction);

const depsCmd = prog
	.command(
		'dependencies',
		'List all imports by a module or a directory of modules'
	)
	.alias('dep')
	.argument(
		'target',
		'Target module or directory of modules to see all imports for',
		prog.STRING
	)
	.action(dependenciesAction);

const nayliasCmd = prog
	.command('naylias', 'List all modules where an alias could be utilized')
	.alias('nay')
	.argument('alias', 'Alias to check for utilization', prog.STRING)
	.action(nayliasAction);

GLOBAL_OPTIONS.forEach(o => {
	surfaceCmd.option(...o);
	depsCmd.option(...o);
	nayliasCmd.option(...o);
});

prog.parse(process.argv);
