const path = require('path');
const fs = require('fs');

const resolvePathWithoutExtension = ({
	extensions,
	pathOfImportingModule,
	importedPath,
	isDirectory,
	isRelative
}) => {
	const potentialPaths = extensions.map(ext =>
		path.join(
			isRelative ? pathOfImportingModule : '',
			`${importedPath}${isDirectory ? 'index' : ''}.${ext}`
		)
	);
	let filePath = '';
	const foundImportedModule = potentialPaths.some(testPath => {
		filePath = testPath;
		return fs.existsSync(testPath);
	});
	if (foundImportedModule) return filePath;
	throw new Error(`Could not resolve import`);
};

const resolveFilePath = ({
	importedPath,
	pathOfImportingModule,
	extensions
}) => {
	let isRelativePath = false;
	let isAbsolutePath = false;
	let isDirectory = false;
	const endsWithExtension = extensions.some(extension =>
		importedPath.endsWith(extension)
	);
	if (!endsWithExtension) {
		isDirectory = importedPath.endsWith('/');
	}

	if (
		importedPath.startsWith('./') ||
		importedPath.startsWith('../') ||
		importedPath.startsWith('~/')
	) {
		isRelativePath = true;
	}

	if (importedPath.startsWith('/')) {
		isAbsolutePath = true;
	}

	if (isRelativePath && endsWithExtension) {
		return path.resolve(pathOfImportingModule, importedPath);
	} else if (isRelativePath && !endsWithExtension) {
		return resolvePathWithoutExtension({
			extensions,
			pathOfImportingModule,
			importedPath,
			isDirectory,
			isRelative: true
		});
	}

	if (isAbsolutePath && endsWithExtension) {
		return importedPath;
	} else if (isAbsolutePath && !endsWithExtension) {
		return resolvePathWithoutExtension({
			extensions,
			pathOfImportingModule,
			importedPath,
			isDirectory,
			isRelative: false
		});
	}
};

module.exports = resolveFilePath;
