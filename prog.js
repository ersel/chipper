const prog = require('caporal');
const packageJSON = require('./package.json');
const surfaceAction = require('./cli/surface');
const dependenciesAction = require('./cli/dependencies');
const dependentAction = require('./cli/dependent');
const nayliasAction = require('./cli/naylias');

prog.version(packageJSON.version);

const GLOBAL_OPTIONS = [
	['--target-dir <path>', 'Target scan directory', prog.STRING, '.'],
	['--project-root <path>', 'Project root path', prog.STRING, process.cwd()],
	['--ext <extensions>', 'File extensions to be matched', prog.LIST, 'js'],
	[
		'--incl <glob-patterns>',
		'Glob patterns to include in scan',
		prog.LIST,
		'**/*.js'
	],
	[
		'--excl <glob-patterns>',
		'Glob patterns to exclude in scan',
		prog.LIST,
		'node_modules/**'
	],
	[
		'--alias <aliases>',
		'Alias used within your project. E.g: my-alias-name:path/to/my/alias',
		prog.REPEATABLE,
		'',
		false
	],
	[
		'--rescan <boolean>',
		'Invalidates chipper cache and forces a rescan',
		prog.BOOL,
		false,
		false
	],
	[
		'--silence-console <boolean>',
		'Disable all console messages',
		prog.BOOL,
		false,
		false
	],
	[
		'--file-scan-parallelism <number>',
		'Number of files to scan at once',
		prog.INTEGER,
		50
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

const dependentCmd = prog
	.command('dependent', 'Check if a module depends on another module')
	.argument(
		'source',
		'Source module to check if it is dependent on target module',
		prog.STRING
	)
	.argument('target', 'target module', prog.STRING)
	.action(dependentAction);

const nayliasCmd = prog
	.command('naylias', 'List all modules where an alias could be utilized')
	.alias('nay')
	.argument('alias', 'Alias to check for utilization', prog.STRING)
	.action(nayliasAction);

GLOBAL_OPTIONS.forEach(o => {
	surfaceCmd.option(...o);
	depsCmd.option(...o);
	nayliasCmd.option(...o);
	dependentCmd.option(...o);
});

module.exports = prog;
