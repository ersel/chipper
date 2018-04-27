const glob = require('glob');
const R = require('ramda');

const getModules = (
	targetDirectory,
	includedPatterns = ['**/*.js'],
	excludedPatterns = ['node_modules/*']
) => {
	const globOptions = {
		cwd: targetDirectory,
		ignore: excludedPatterns
	};
	const modulesFound = R.flatten(
		includedPatterns.map(pattern => glob.sync(pattern, globOptions))
	);
	return modulesFound;
};

module.exports = getModules;
