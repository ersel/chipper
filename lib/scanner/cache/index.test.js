const cache = require('./');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const basePath = process.cwd();

jest.mock('../', () =>
	jest.fn().mockImplementation(() => Promise.resolve('mocked scan'))
);

describe('Cache Layer', () => {
	const testDirectory = '__fixtures__/es6';
	const testScannerArgs = {
		targetDirectory: '.',
		includedPatterns: ['**/*.js', '**/*.ts'],
		excludedPatterns: ['.cache', 'node_modules/**'],
		extensions: ['ts', 'js', 'mjs'],
		aliases: {
			'aliased-library': `/__fixtures__/es6`
		},
		projectRootPath: `${basePath}/${testDirectory}`,
		customAcornObj: null
	};
	const CACHE_FILE_HASH = 'ca4f4255cc5109c8a1c20a46f98335eb6ffe08b1';
	const CACHE_DIRECTORY = '.chipper';
	const CACHE_DIRECTORY_PATH = path.join(
		testScannerArgs.projectRootPath,
		CACHE_DIRECTORY
	);
	const CACHE_FILE_PATH = `${CACHE_DIRECTORY_PATH}/${CACHE_FILE_HASH}.json`;

	beforeEach(done => {
		rimraf(CACHE_DIRECTORY_PATH, done);
	});

	it('should skip cache layer if rescan is enabled', done => {
		fs.mkdirSync(CACHE_DIRECTORY_PATH);
		fs.writeFileSync(
			CACHE_FILE_PATH,
			JSON.stringify({ scannedAt: 'testDate', results: 'mocked cache' })
		);
		cache({
			scannerArgs: testScannerArgs,
			forceRescan: true
		}).then(results => {
			expect(results).toBe('mocked scan');
			done();
		});
	});

	it('should save results of scan into .chipper directory with hash of arguments', done => {
		cache({
			scannerArgs: testScannerArgs,
			forceRescan: true
		}).then(results => {
			expect(results).toBe('mocked scan');

			const cacheFileExists = fs.existsSync(CACHE_FILE_PATH);
			expect(cacheFileExists).toBe(true);
			done();
		});
	});

	it('should use existing cache if rescan is not enforced', done => {
		fs.mkdirSync(CACHE_DIRECTORY_PATH);
		fs.writeFileSync(
			CACHE_FILE_PATH,
			JSON.stringify({ scannedAt: 'testDate', results: 'mocked cache' })
		);
		cache({
			scannerArgs: testScannerArgs,
			forceRescan: false
		}).then(results => {
			expect(results).toBe('mocked cache');
			done();
		});
	});

	afterAll(done => {
		rimraf(CACHE_DIRECTORY_PATH, done);
	});
});
