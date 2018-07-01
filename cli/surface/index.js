const path = require('path');
const fs = require('fs');
const createHTMLTable = require('../utils/createTable/');
const parseAliases = require('../utils/parseAliases/');
const scanner = require('../../lib/scanner/cache/');
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
		const { target } = args;
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
			const table = [
				['Source Module', 'Imported Module', 'Imported Symbols']
			];
			results.forEach(result => {
				result.importedModules.forEach(imported => {
					const symbols = imported.imports
						.map(i => {
							if (i.imported !== i.local) {
								return `${i.imported} as ${i.local}`;
							}
							return i.imported;
						})
						.join(', ');
					const row = [
						result.sourceFile.replace(opts.projectRoot, ''),
						imported.absolute.replace(opts.projectRoot, ''),
						symbols
					];
					table.push(row);
				});
			});
			const htmlReport = createHTMLTable(table);
			const fileTimeStamp = new Date().toISOString().substring(0, 16);
			fs.writeFileSync(
				`./chipper-report-${fileTimeStamp}.html`,
				htmlReport,
				'utf8'
			);
			openFile(`./chipper-report-${fileTimeStamp}.html`);
		} else {
			console.log('No results found.');
		}
	});
};

module.exports = surfaceAction;
