const ramda = require('ramda');
const path = require('path');
const fs = require('fs');

const parseAliases = (aliases, rootPath) =>
	ramda.flatten([aliases]).reduce((acc, alias) => {
		const [k, v] = alias.split(':');
		if (k && v) {
			const absolutePath = path.resolve(rootPath, v);
			acc[k] = absolutePath;
		} else {
			throw new Error(
				`Could not parse ${alias}. Aliases should be key-value pairs in the form my-alias:/path/to/my-alias/`
			);
		}
		return acc;
	}, {});

const parseTargetPath = (targetPath, projectRootPath, aliases) => {
	if (!ramda.is(String, targetPath)) {
		throw new Error(
			`Target Path should be a String. Received: ${typeof targetPath}`
		);
	}

	if (path.isAbsolute(targetPath)) {
		return targetPath;
	}

	try {
		const targetPathResolved = path.resolve(projectRootPath, targetPath);
		fs.statSync(targetPathResolved);
		return targetPathResolved;
	} catch (e) {} // eslint-disable-line no-empty

	try {
		const targetPathNodeModule = path.resolve(
			projectRootPath,
			'node_modules',
			targetPath
		);
		fs.statSync(targetPathNodeModule);
		return targetPathNodeModule;
	} catch (e) {} // eslint-disable-line no-empty

	const aliasNames = Object.keys(aliases);
	const aliasedImport = aliasNames.find(alias =>
		targetPath.startsWith(alias)
	);
	if (aliasedImport) return aliases[aliasedImport];

	throw new Error(
		'Unable to resolve target module. Did you forget to specify the file extension?'
	);
};

module.exports = {
	parseAliases,
	parseTargetPath
};
