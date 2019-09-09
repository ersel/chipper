const cache = require('./');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const calculateHash = require('../hash');

const basePath = process.cwd();

const EXPECTED_GRAPH = {
	links: [
		{
			source: '/es6/directory/child.js',
			target: '/es6/directory/subdirectory/grandchild.js',
			weight: 1
		},
		{
			source: '/es6/directory/child.js',
			target: '/es6/directory/subdirectory/typedgrandchild.ts',
			weight: 1
		},
		{
			source: '/es6/directory/subdirectory/grandchild.js',
			target: '/es6/node_modules/somethingjs/index.js',
			weight: 1
		},
		{
			source: '/es6/directory/subdirectory/typedgrandchild.ts',
			target: '/es6/index.js',
			weight: 1
		},
		{
			source: '/es6/index.js',
			target: '/es6/directory/child.js',
			weight: 1
		}
	],
	nodes: [
		{ id: '/es6/directory/child.js' },
		{ id: '/es6/directory/subdirectory/grandchild.js' },
		{ id: '/es6/directory/subdirectory/typedgrandchild.ts' },
		{ id: '/es6/node_modules/somethingjs/index.js' },
		{ id: '/es6/index.js' }
	]
};

jest.mock('../../', () =>
	jest.fn().mockImplementation(() =>
		Promise.resolve([
			{
				sourceFile: '/es6/directory/child.js',
				importedModules: [
					{
						source: './subdirectory/grandchild',
						absolute: '/es6/directory/subdirectory/grandchild.js',
						imports: [
							{
								imported: 'namedImport1',
								local: 'namedImport1'
							},
							{
								imported: 'namedImport2',
								local: 'localImport'
							}
						],
						type: 'es6'
					},
					{
						source: './subdirectory/typedgrandchild',
						absolute:
							'/es6/directory/subdirectory/typedgrandchild.ts',
						imports: [
							{
								imported: 'default',
								local: 'grandChildImport'
							},
							{
								imported: '*',
								local: 'grandChildNamespaceImport'
							}
						],
						type: 'es6'
					}
				]
			},
			{
				sourceFile: '/es6/directory/subdirectory/grandchild.js',
				importedModules: [
					{
						source: 'somethingjs',
						absolute: '/es6/node_modules/somethingjs/index.js',
						imports: [
							{
								imported: 'default',
								local: 'nodeModuleImport'
							}
						],
						type: 'es6'
					}
				]
			},
			{
				sourceFile: '/es6/index.js',
				importedModules: [
					{
						source: './directory/child',
						absolute: '/es6/directory/child.js',
						imports: [{ imported: 'default', local: 'xyz' }],
						type: 'es6'
					}
				]
			},
			{
				sourceFile: '/es6/directory/subdirectory/typedgrandchild.ts',
				importedModules: [
					{
						source: 'aliased-library',
						absolute: '/es6/index.js',
						imports: [
							{
								imported: 'default',
								local: 'importFromAliasedLibrary'
							}
						],
						type: 'es6'
					}
				]
			}
		])
	)
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
	const CACHE_FILE_HASH = calculateHash(testScannerArgs);
	const CACHE_DIRECTORY = '.chipper';
	const CACHE_DIRECTORY_PATH = path.join(
		testScannerArgs.projectRootPath,
		CACHE_DIRECTORY
	);
	const CACHE_FILE_PATH = `${CACHE_DIRECTORY_PATH}/${CACHE_FILE_HASH}.graph.json`;

	beforeEach(done => {
		rimraf(CACHE_DIRECTORY_PATH, done);
	});

	it('should skip cache layer if rescan is enabled', done => {
		fs.mkdirSync(CACHE_DIRECTORY_PATH);
		fs.writeFileSync(
			CACHE_FILE_PATH,
			JSON.stringify({ scannedAt: 'testDate', results: 'mocked cache' })
		);
		cache(testScannerArgs, true).then(results => {
			expect(results).toEqual(EXPECTED_GRAPH);
			done();
		});
	});

	it('should save results of scan into .chipper directory with hash of arguments', done => {
		cache(testScannerArgs, true).then(results => {
			expect(results).toEqual(EXPECTED_GRAPH);

			const cacheFileExists = fs.existsSync(CACHE_FILE_PATH);
			expect(cacheFileExists).toBe(true);
			done();
		});
	});

	it('should use existing cache if rescan is not enforced', done => {
		fs.mkdirSync(CACHE_DIRECTORY_PATH);
		fs.writeFileSync(
			CACHE_FILE_PATH,
			JSON.stringify({ scannedAt: 'testDate', results: EXPECTED_GRAPH })
		);
		cache(testScannerArgs, false).then(results => {
			expect(results).toEqual(EXPECTED_GRAPH);
			done();
		});
	});

	afterAll(done => {
		rimraf(CACHE_DIRECTORY_PATH, done);
	});
});
