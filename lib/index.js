const ramda = require('ramda');
const fs = require('fs');
const path = require('path');
const util = require('util');
const glob = require('../utils/glob');
const resolveES6Imports = require('../utils/es6-import-resolver');
const resolvePath = require('../utils/filepath-resolver');

const readFile = util.promisify(fs.readFile);
const basePath = process.cwd();
async function readModules(paths) {
	return Promise.all(
		paths.map(async p => ({ [p]: await readFile(p, 'utf8') }))
	);
}

async function chipper(targetDirectory, includedPatterns, excludedPatterns) {
	const filesToAnalyse = glob(
		targetDirectory,
		includedPatterns,
		excludedPatterns
	).map(p => path.join(basePath, targetDirectory, p));

	const chunksOfFiles = ramda.splitEvery(2, filesToAnalyse);
	return Promise.all(
		chunksOfFiles.map(async files => {
			const modules = await readModules(files);
			return modules.map(m =>
				Object.keys(m).map(key => ({
					[key]: resolveES6Imports(m[key])
				}))
			);
		})
	)
		.then(results => ramda.flatten(results))
		.then(results =>
			results.map(m =>
				Object.keys(m).map(key => ({
					[key]: m[key].map(imported => ({
						...imported,
						absolute: resolvePath({
							importedPath: imported.source,
							pathOfImportingModule: path.dirname(key),
							extensions: ['js', 'ts'],
							aliases: {
								'aliased-library': `${basePath}/__fixtures__/es6`
							},
							projectRootPath: `${basePath}/__fixtures__/es6`
						})
					}))
				}))
			)
		);
}

module.exports = chipper;
