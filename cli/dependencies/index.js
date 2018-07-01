const path = require('path');
const fs = require('fs');
const scanner = require('../../lib/scanner/cache/');
const parseAliases = require('../utils/parseAliases/');
const openFile = require('../utils/openFile/');
const createHTMLTable = require('../utils/createTable/');

const filterResults = (scanData, searchTarget) =>
	scanData.filter(({ sourceFile }) => sourceFile.startsWith(searchTarget));

const dependenciesAction = (args, opts) => {
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
		let searchTarget;

		// CHECK IF SCAN TARGET IS AN ALIAS
		const aliasesArr = Object.keys(aliases);
		const aliasKey = aliasesArr.find(a => target.startsWith(a));
		if (aliasKey) {
			searchTarget = target.replace(aliasKey, aliases[aliasKey]);
			console.log(
				`Detected ${target} as an alias. Scanning for all imports from ${searchTarget}`
			);
			results = filterResults(scanData, searchTarget);
		}

		if (!results.length) {
			searchTarget = target;
			if (!path.isAbsolute(target)) {
				searchTarget = path.resolve(opts.projectRoot, target);
			}
			console.log(`Scanning for all imports from ${searchTarget}`);
			results = filterResults(scanData, searchTarget);
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

module.exports = dependenciesAction;
