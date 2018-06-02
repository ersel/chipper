const scanner = require('../');
const fs = require('fs');
const hash = require('object-hash');
const ramda = require('ramda');
const path = require('path');

const CACHE_DIRECTORY = '.chipper';

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

const saveCache = ({ results, cacheDirectoryPath, cacheFilePath }) => {
	if (!fs.existsSync(cacheDirectoryPath)) {
		fs.mkdirSync(cacheDirectoryPath);
	}
	const cacheContents = {
		scannedAt: new Date().toJSON().slice(0, 19),
		results
	};
	fs.writeFileSync(cacheFilePath, JSON.stringify(cacheContents));
	return results;
};

const cache = (scannerArgs, forceRescan) => {
	const fileHash = calculateHash(scannerArgs);
	const cacheDirectoryPath = path.join(
		scannerArgs.projectRootPath,
		CACHE_DIRECTORY
	);
	const cacheFilePath = `${cacheDirectoryPath}/${fileHash}.json`;

	if (!forceRescan && fs.existsSync(cacheFilePath)) {
		const cachedResult = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
		console.info(
			`Using cached scan from ${cachedResult.scannedAt}, ${cacheFilePath}`
		); // eslint-disable
		console.info('Use rescan flag to invalidate cache.'); // eslint-disable
		return Promise.resolve(cachedResult.results);
	}
	return scanner(scannerArgs).then(results =>
		saveCache({ results, cacheFilePath, cacheDirectoryPath })
	);
};

module.exports = cache;
