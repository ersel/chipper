const path = require('path');
const fs = require('fs');
const createHTMLTable = require('../utils/createTable/');
const parseAliases = require('../utils/parseAliases/');
const scanner = require('../../lib/scanner/cache/scanCache');
const openFile = require('../utils/openFile/');

const scanResults = (scanData, searchPath) =>
	scanData
		.map(source => {
			const filteredImports = source.importedModules.filter(imported =>
				imported.absolute.startsWith(searchPath)
			);
			if (filteredImports.length) {
				return {
					...source,
					importedModules: filteredImports
				};
			}
			return null;
		})
		.filter(r => r);

const surfaceAction = (args, opts) => {
	const { target } = args;
	const aliases = opts.alias
		? parseAliases(opts.alias, opts.projectRoot)
		: {};

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
		let results = [];

		// CHECK IF SCAN TARGET IS A NODE_MODULE
		const potentialNodeModulePath = path.resolve(
			opts.projectRoot,
			'node_modules',
			target
		);
		try {
			if (fs.statSync(potentialNodeModulePath)) {
				console.log(
					`Detected ${target} as a node_module dependency. Scanning for imports.`
				);
				results = scanResults(scanData, potentialNodeModulePath);
			}
		} catch (e) {}

		// CHECK IF SCAN TARGET IS AN ALIAS
		const aliasesArr = Object.keys(aliases);
		const aliasKey = aliasesArr.find(a => target.startsWith(a));
		if (aliasKey) {
			const searchTarget = target.replace(aliasKey, aliases[aliasKey]);
			console.log(
				`Detected ${target} as an aliased dependency. Scanning for imports.`
			);
			results = scanResults(scanData, searchTarget);
		}

		// CHECK LOCAL MODULE AND DIRECTORY IMPORTS
		if (!results.length) {
			let searchTarget = target;
			if (!path.isAbsolute(target)) {
				searchTarget = path.resolve(opts.projectRoot, target);
			}
			console.log(`Scanning for imports depending on ${searchTarget}`);
			results = scanResults(scanData, searchTarget);
		}

		if (results.length) {
			const htmlReport = createHTMLTable(results, opts.projectRoot);
			const fileTimeStamp = new Date().toISOString().substring(0, 16);
			const reportFileName = `./chipper-report-${fileTimeStamp}.html`;
			fs.writeFileSync(reportFileName, htmlReport, 'utf8');
			openFile(reportFileName);
		} else {
			console.log('No results found.');
		}
	});
};

module.exports = surfaceAction;
