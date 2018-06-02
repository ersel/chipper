const path = require('path');
const fs = require('fs');
const ramda = require('ramda');

const resolvePotentialPaths = ramda.memoizeWith(
	paths => paths.join(),
	paths => paths.find(testPath => fs.existsSync(testPath))
);

const resolvePathWithoutExtension = ({
	extensions,
	basePath,
	importedPath,
	isDirectory,
	isRelativePath,
	isNodeModulesDependency,
	isAliasedImport
}) => {
	const useBasePath =
		isRelativePath || isNodeModulesDependency || isAliasedImport;
	let potentialPaths = extensions.map(ext =>
		path.join(
			useBasePath ? basePath : '',
			`${importedPath}${isDirectory ? 'index' : ''}.${ext}`
		)
	);
	let foundImportedModule = resolvePotentialPaths(potentialPaths);
	if (foundImportedModule) return foundImportedModule;
	if (!isDirectory) {
		potentialPaths = extensions.map(ext =>
			path.join(basePath, `${importedPath}/index.${ext}`)
		);
		foundImportedModule = resolvePotentialPaths(potentialPaths);
		if (foundImportedModule) return foundImportedModule;
	}
	return `Unable to import: ${importedPath}`;
};

const resolveDirectNodeModuleImport = ramda.memoizeWith(
	ramda.identity,
	pathToNodeModule =>
		JSON.parse(
			fs.readFileSync(
				path.resolve(pathToNodeModule, 'package.json'),
				'utf8'
			)
		)
);

const resolveNodeModuleImport = ramda.memoizeWith(
	({ importedPath }) => importedPath,
	args => resolvePathWithoutExtension(args)
);

const resolveAliasedImport = ramda.memoizeWith(
	({ basePath, importedPath }) => `${basePath}${importedPath}`,
	args => resolvePathWithoutExtension(args)
);

const resolveAbsoluteImport = ramda.memoizeWith(
	({ importedPath }) => importedPath,
	args => resolvePathWithoutExtension(args)
);

const resolveFilePath = ({
	importedPath,
	pathOfImportingModule,
	projectRootPath,
	extensions,
	aliases = {}
}) => {
	let isRelativePath = false;
	let isAbsolutePath = false;
	let isDirectory = false;
	const endsWithExtension = extensions.some(extension =>
		importedPath.endsWith(`.${extension}`)
	);
	if (!endsWithExtension) {
		isDirectory = importedPath.endsWith('/');
	}

	if (importedPath.startsWith('.') || importedPath.startsWith('~/')) {
		isRelativePath = true;
	}

	if (path.isAbsolute(importedPath)) {
		isAbsolutePath = true;
	}

	if (isRelativePath && endsWithExtension) {
		return path.resolve(pathOfImportingModule, importedPath);
	} else if (isRelativePath && !endsWithExtension) {
		return resolvePathWithoutExtension({
			extensions,
			basePath: pathOfImportingModule,
			importedPath,
			isDirectory,
			isRelativePath
		});
	}

	if (isAbsolutePath && endsWithExtension) {
		return importedPath;
	} else if (isAbsolutePath && !endsWithExtension) {
		return resolveAbsoluteImport({
			extensions,
			basePath: pathOfImportingModule,
			importedPath,
			isDirectory,
			isRelativePath
		});
	}

	// aliased modules
	const aliasedNames = Object.keys(aliases);
	let importedPathWithAliasResolved;
	let aliasUsed;
	const isAliasedImport = aliasedNames.some(alias => {
		aliasUsed = alias;
		return importedPath.startsWith(alias);
	});
	if (isAliasedImport) {
		importedPathWithAliasResolved = importedPath.replace(aliasUsed, '');
		if (importedPathWithAliasResolved.startsWith('/')) {
			importedPathWithAliasResolved = `.${importedPathWithAliasResolved}`;
		}
		if (importedPathWithAliasResolved === '') {
			isDirectory = true;
			importedPathWithAliasResolved = './';
		}
		const aliasPath = aliases[aliasUsed];

		if (endsWithExtension) {
			return path.resolve(aliasPath, importedPathWithAliasResolved);
		}
		return resolveAliasedImport({
			extensions,
			basePath: aliasPath,
			importedPath: importedPathWithAliasResolved,
			isDirectory,
			isRelativePath,
			isAliasedImport
		});
	}

	// only option left is 3rd party deps from node_modules
	const isDefaultImport = !importedPath.includes('/');
	if (endsWithExtension) {
		return path.resolve(projectRootPath, 'node_modules', importedPath);
	} else if (!endsWithExtension && !isDefaultImport) {
		return resolveNodeModuleImport({
			extensions,
			basePath: `${projectRootPath}/node_modules`,
			importedPath,
			isDirectory,
			isRelativePath,
			isNodeModulesDependency: true
		});
	}

	// direct import from node modules
	// import xyz from 'my-module'
	const pathToNodeModule = path.resolve(
		projectRootPath,
		'node_modules',
		importedPath
	);
	const packageJSON = resolveDirectNodeModuleImport(pathToNodeModule);
	const entryModule =
		packageJSON.module ||
		packageJSON.main ||
		ramda.path(['files', 0], packageJSON) ||
		'Unable-To-Import';

	return path.resolve(pathToNodeModule, entryModule);
};

module.exports = resolveFilePath;
