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
			projectRoot: process.cwd(),
			ext: ['js'],
			incl: ['**/*.js'],
			excl: ['node_modules/**'],
			alias: 'some-alias:/path/to/some-alias',
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
						includedPatterns: ['**/*.js'],
						projectRootPath: process.cwd(),
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
		dependentAction({ source: '', target: 'src/' }, testOptions).then(
			() => {
				expect(scanner).lastCalledWith(
					{
						aliases: {},
						excludedPatterns: ['node_modules/**'],
						extensions: ['js'],
						includedPatterns: ['**/*.js'],
						projectRootPath: process.cwd(),
						targetDirectory: '.'
					},
					testOptions.rescan
				);
				done();
			}
		);
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

	// check alias resolutions for source and path
	// check absolute path resolution for source and path
	it.skip('should return all imports for an aliased search target', done => {
		testOptions.alias = `my-utils:${process.cwd()}/src/utils`;
		dependentAction(
			{ target: 'my-utils/cookiesServices.js' },
			testOptions
		).then(() => {
			done();
		});
	});
});
