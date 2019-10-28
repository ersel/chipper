const ramda = require('ramda');
const fs = require('fs');
const path = require('path');
const util = require('util');
const glob = require('../../utils/glob');
const sequence = require('../../utils/sequence');
const resolveES6Imports = require('../../utils/es6-import-resolver');
const resolveCJSImports = require('../../utils/static-require-resolver');
const resolvePath = require('../../utils/filepath-resolver');

const readFile = util.promisify(fs.readFile);
async function readModules(paths) {
	return Promise.all(
		paths.map(p =>
			readFile(p, 'utf8').then(contents => ({
				sourceFile: p,
				fileContents: contents
			}))
		)
	);
}

async function scanner({
	targetDirectory,
	includedPatterns,
	excludedPatterns,
	extensions,
	aliases,
	projectRootPath,
	fileScanParallelism = 50
}) {
	const filesToAnalyse = glob(
		path.join(projectRootPath, targetDirectory),
		includedPatterns,
		excludedPatterns
	);

	const chunksOfFiles = ramda.splitEvery(fileScanParallelism, filesToAnalyse);
	return sequence(chunksOfFiles, async files => {
		const modules = await readModules(files);
		return modules.map(({ sourceFile, fileContents }) => ({
			sourceFile,
			importedModules: [
				...resolveES6Imports(fileContents, sourceFile),
				...resolveCJSImports(fileContents, sourceFile)
			]
		}));
	})
		.then(results => ramda.flatten(results))
		.then(results =>
			results.map(({ sourceFile, importedModules }) => ({
				sourceFile,
				importedModules: importedModules.map(
					({ source, imports, type }) => ({
						source,
						absolute: resolvePath({
							importedPath: source,
							pathOfImportingModule: path.dirname(sourceFile),
							extensions,
							aliases,
							projectRootPath
						}),
						imports,
						type
					})
				)
			}))
		);
}

module.exports = scanner;
