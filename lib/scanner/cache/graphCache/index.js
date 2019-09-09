const scanner = require('../../');
const fs = require('fs');
const path = require('path');
const calculateHash = require('../hash');
const constructGraph = require('../../../../utils/construct-graph');

const CACHE_DIRECTORY = '.chipper';

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

const graphCache = (scannerArgs, forceRescan) => {
	const fileHash = calculateHash(scannerArgs);
	const cacheDirectoryPath = path.join(
		scannerArgs.projectRootPath,
		CACHE_DIRECTORY
	);
	const cacheFilePath = `${cacheDirectoryPath}/${fileHash}.graph.json`;

	if (!forceRescan && fs.existsSync(cacheFilePath)) {
		const cachedResult = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
		console.info(
			`Using cached scan from ${cachedResult.scannedAt}, ${cacheFilePath}`
		);
		console.info('Use --rescan option to invalidate cache.');
		return Promise.resolve(cachedResult.results);
	}
	return scanner(scannerArgs).then(results =>
		saveCache({
			results: constructGraph(results).serialize(),
			cacheFilePath,
			cacheDirectoryPath
		})
	);
};

module.exports = graphCache;
