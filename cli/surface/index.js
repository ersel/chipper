const utils = require('../utils/index');
const scanner = require('../../lib/scanner/cache/');

const surfaceAction = (args, opts) => {
	scanner(
		{
			targetDirectory: opts.targetDir,
			projectRootPath: opts.projectRoot,
			includedPatterns: opts.incl,
			excludedPatterns: opts.excl,
			extensions: opts.ext,
			aliases: utils.parseAliases(opts.alias, opts.projectRoot)
		},
		opts.rescan
	).then(results => {
		console.log(results);
	});
	// todo: do path check to filter matching scan results
	// print results nicely
	// offer exports as csv or json
};

module.exports = surfaceAction;
