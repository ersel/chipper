const scanner = require('../../lib/scanner/cache/');
const parseAliases = require('../utils/parseAliases/');

const nayliasAction = (args, opts) => {
	const { alias } = args;
	const aliases = opts.alias
		? parseAliases(opts.alias, opts.projectRoot)
		: {};

	if (!aliases[alias]) {
		const errorMsg = `${alias} was not defined. Check --alias option.`;
		console.error(errorMsg);
		throw new Error(errorMsg);
	}
	const resolvedAliasPath = aliases[alias];

	return scanner(
		{
			targetDirectory: opts.targetDir,
			projectRootPath: opts.projectRoot,
			includedPatterns: opts.incl,
			excludedPatterns: opts.excl,
			extensions: opts.ext,
			aliases
		},
		opts.rescan
	).then(scanData => {
		const results = scanData
			.filter(({ importedModules }) =>
				importedModules.some(
					({ source, absolute }) =>
						absolute.startsWith(resolvedAliasPath) &&
						!source.startsWith(alias)
				)
			)
			.map(({ sourceFile, importedModules }) => ({
				sourceFile,
				numberOfImportsCanBeAliased: importedModules.filter(
					({ source, absolute }) =>
						absolute.startsWith(resolvedAliasPath) &&
						!source.startsWith(alias)
				).length
			}));

		results.forEach(({ sourceFile, numberOfImportsCanBeAliased }) =>
			console.log(`${sourceFile} (${numberOfImportsCanBeAliased})`)
		);
		return results;
	});
};

module.exports = nayliasAction;
