const hash = require('object-hash');
const ramda = require('ramda');

const calculateHash = scannerArgs => {
	const argsToHash = ramda.pick(
		[
			'targetDirectory',
			'includedPatterns',
			'excludedPatterns',
			'extensions',
			'aliases',
			'projectRootPath'
		],
		scannerArgs
	);
	return hash(argsToHash);
};

module.exports = calculateHash;
