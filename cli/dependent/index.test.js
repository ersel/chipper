const dependentAction = require('./');
const scanner = require('../../lib/scanner/cache/graphCache');

const testDirectory = '__fixtures__/dependency-graph';
const PROJECT_ROOT = process.cwd();
const testRootPath = `${PROJECT_ROOT}/${testDirectory}`;

jest.mock('fs');
jest.mock('../../lib/scanner/cache/graphCache', () =>
	jest.fn(() => {
		const testDirectoryMock = '__fixtures__/dependency-graph';
		const PROJECT_ROOT_MOCK = process.cwd();
		const testRootPathMock = `${PROJECT_ROOT_MOCK}/${testDirectoryMock}`;
		const MOCK_SCAN_DATA = {
			nodes: [
				`${testRootPathMock}/database.js`,
				`${testRootPathMock}/settings.js`,
				`${testRootPathMock}/serverless/function1/index.js`,
				`${testRootPathMock}/utils/round/index.js`,
				`${testRootPathMock}/serverless/function2/index.js`,
				`${testRootPathMock}/serverless/function3/index.js`,
				`path`
			],
			links: [
				{
					source: `${testRootPathMock}/database.js`,
					target: `${testRootPathMock}/settings.js`
				},
				{
					source: `${testRootPathMock}/serverless/function1/index.js`,
					target: `${testRootPathMock}/utils/round/index.js`
				},
				{
					source: `${testRootPathMock}/serverless/function1/index.js`,
					target: `${testRootPathMock}/database.js`
				},
				{
					source: `${testRootPathMock}/utils/round/index.js`,
					target: `${testRootPathMock}/settings.js`
				},
				{
					source: `${testRootPathMock}/serverless/function2/index.js`,
					target: `${testRootPathMock}/utils/round/index.js`
				},
				{
					source: `${testRootPathMock}/serverless/function3/index.js`,
					target: 'path'
				}
			]
		};
		return Promise.resolve(MOCK_SCAN_DATA);
	})
);

describe('dependent command', () => {
	let testOptions = {};
	beforeEach(() => {
		testOptions = {
			targetDir: '.',
			projectRoot: testRootPath,
			ext: ['js'],
			incl: ['**/*.js'],
			excl: ['node_modules/**'],
			alias: 'some-alias:/path/to/some-alias',
			fileScanParallelism: 50,
			rescan: true
		};
	});
	it('should call scanner with the right params', done => {
		dependentAction({ source: '', target: 'src/' }, testOptions).then(
			() => {
				expect(scanner).lastCalledWith(
					{
						aliases: { 'some-alias': '/path/to/some-alias' },
						excludedPatterns: ['node_modules/**'],
						extensions: ['js'],
						fileScanParallelism: 50,
						includedPatterns: ['**/*.js'],
						projectRootPath: testRootPath,
						targetDirectory: '.'
					},
					testOptions.rescan
				);
				done();
			}
		);
	});

	it('should call scanner with the right params when no aliases are defined', done => {
		delete testOptions.alias;
		dependentAction(
			{
				source: `${testRootPath}/serverless/function1/index.js`,
				target: ''
			},
			testOptions
		).then(() => {
			expect(scanner).lastCalledWith(
				{
					aliases: {},
					excludedPatterns: ['node_modules/**'],
					extensions: ['js'],
					fileScanParallelism: 50,
					includedPatterns: ['**/*.js'],
					projectRootPath: testRootPath,
					targetDirectory: '.'
				},
				testOptions.rescan
			);
			done();
		});
	});

	it('should resolve direct dependents', done => {
		dependentAction(
			{
				source: `${testRootPath}/serverless/function1/index.js`,
				target: `${testRootPath}/database.js`
			},
			testOptions
		).then(result => {
			expect(result).toEqual({
				path: [
					`${testRootPath}/serverless/function1/index.js`,
					`${testRootPath}/database.js`
				],
				pathExists: true
			});
			done();
		});
	});

	it('should detect indirect/nested/n-degree dependents', done => {
		dependentAction(
			{
				source: `${testRootPath}/serverless/function1/index.js`,
				target: `${testRootPath}/settings.js`
			},
			testOptions
		).then(result => {
			expect(result).toEqual({
				path: [
					`${testRootPath}/serverless/function1/index.js`,
					`${testRootPath}/utils/round/index.js`,
					`${testRootPath}/settings.js`
				],
				pathExists: true
			});
			done();
		});
	});

	it('should detect non-dependents (1)', done => {
		dependentAction(
			{
				source: `${testRootPath}/serverless/function2/index.js`,
				target: `${testRootPath}/database.js`
			},
			testOptions
		).then(result => {
			expect(result).toEqual({ path: [], pathExists: false });
			done();
		});
	});

	it('should detect non-dependents (2)', done => {
		dependentAction(
			{
				source: `${testRootPath}/serverless/function3/index.js`,
				target: `${testRootPath}/database.js`
			},
			testOptions
		).then(result => {
			expect(result).toEqual({ path: [], pathExists: false });
			done();
		});
	});

	it('should return all imports of a single module', done => {
		dependentAction(
			{
				source: `${testRootPath}/serverless/function2/index.js`,
				target: `${testRootPath}/settings.js`
			},
			testOptions
		).then(result => {
			expect(result).toEqual({
				path: [
					`${testRootPath}/serverless/function2/index.js`,
					`${testRootPath}/utils/round/index.js`,
					`${testRootPath}/settings.js`
				],
				pathExists: true
			});
			done();
		});
	});

	it('should work with aliased source and path arguments (1)', done => {
		testOptions.alias = `~serverless:${testRootPath}/serverless`;
		dependentAction(
			{
				source: '~serverless/function1/index.js',
				target: '~serverless/function2/index.js'
			},
			testOptions
		).then(results => {
			expect(results).toEqual({ path: [], pathExists: false });
			done();
		});
	});

	it('should work with aliased source and path arguments (2)', done => {
		testOptions.alias = `~serverless:${testRootPath}/serverless`;
		dependentAction(
			{
				source: '~serverless/function1/index.js',
				target: `${testRootPath}/settings.js`
			},
			testOptions
		).then(results => {
			expect(results).toEqual({
				path: [
					`${testRootPath}/serverless/function1/index.js`,
					`${testRootPath}/utils/round/index.js`,
					`${testRootPath}/settings.js`
				],
				pathExists: true
			});
			done();
		});
	});

	it('should work with relative source and target arguments (1)', done => {
		dependentAction(
			{
				source: `serverless/function2/index.js`,
				target: `settings.js`
			},
			testOptions
		).then(result => {
			expect(result).toEqual({
				path: [
					`${testRootPath}/serverless/function2/index.js`,
					`${testRootPath}/utils/round/index.js`,
					`${testRootPath}/settings.js`
				],
				pathExists: true
			});
			done();
		});
	});

	it('should work with relative source and target arguments (20', done => {
		dependentAction(
			{
				source: `serverless/function3/index.js`,
				target: `settings.js`
			},
			testOptions
		).then(result => {
			expect(result).toEqual({
				path: [],
				pathExists: false
			});
			done();
		});
	});
});
