const aliasParser = require('../utils/index');
const scanner = require('../../lib/scanner/cache/');

const surfaceAction = (args, opts) => {
	scanner(
		{
			targetDirectory: opts.targetDir,
			projectRootPath: opts.projectRoot,
			includedPatterns: opts.incl,
			excludedPatterns: opts.excl,
			extensions: opts.ext,
			aliases: aliasParser(opts.alias, opts.projectRoot)
		},
		opts.rescan
	).then(results => {
		console.log(results);
	});
	// todo: check args if it's a node_module, a single module, or a directory of modules
	// todo: do path check to filter matching scan results
	// print results nicely
	// offer exports as csv or json
};

module.exports = surfaceAction;
