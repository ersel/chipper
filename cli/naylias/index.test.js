const nayliasAction = require('./');
const scanner = require('../../lib/scanner/cache/scanCache');

jest.mock('../utils/openFile/');
jest.mock('fs');
jest.mock('../../lib/scanner/cache/scanCache', () =>
	jest.fn(() => {
		const PROJECT_ROOT = process.cwd();
		const MOCK_SCAN_DATA = [
			{
				sourceFile: `${PROJECT_ROOT}/src/documentsService.js`,
				importedModules: [
					{
						source: './utils/getAuthor',
						absolute: `${PROJECT_ROOT}/src/utils/getAuthor/index.js`,
						imports: [
							{
								imported: 'getAuthor',
								local: 'getAuthor'
							}
						]
					},
					{
						source: './utils/getFileCreationTime',
						absolute: `${PROJECT_ROOT}/src/utils/getFileCreationTime/index.js`,
						imports: [
							{
								imported: 'getFileCreationTime',
								local: 'getFileCreationTime'
							}
						]
					},
					{
						source: 'my-utils/rabbitmq/rabbitmq/connect/index.js',
						absolute: `${PROJECT_ROOT}/src/utils/rabbitmq/connect/index.js`,
						imports: [
							{
								imported: 'connect',
								local: 'connect'
							}
						]
					}
				]
			},
			{
				sourceFile: `${PROJECT_ROOT}/src/loginService.js`,
				importedModules: [
					{
						source: 'my-utils/getCookies',
						absolute: `${PROJECT_ROOT}/src/utils/getCookies/index.js`,
						imports: [
							{
								imported: 'getFileNames',
								local: 'getFileNames'
							}
						]
					}
				]
			},
			{
				sourceFile: `${PROJECT_ROOT}/src/queueService.js`,
				importedModules: [
					{
						source: './utils/rabbitmq/connect/index.js',
						absolute: `${PROJECT_ROOT}/src/utils/rabbitmq/connect/index.js`,
						imports: [
							{
								imported: 'connect',
								local: 'connect'
							}
						]
					}
				]
			}
		];
		return Promise.resolve(MOCK_SCAN_DATA);
	})
);

describe('naylias command', () => {
	let testOptions = {};
	const PROJECT_ROOT = process.cwd();
	beforeEach(() => {
		testOptions = {
			targetDir: '.',
			projectRoot: PROJECT_ROOT,
			ext: ['js'],
			incl: ['**/*.js'],
			excl: ['node_modules/**'],
			alias: `my-utils:${PROJECT_ROOT}/src/utils`,
			fileScanParallelism: 50,
			rescan: true
		};
	});

	it('should call scanner with the right params', done => {
		nayliasAction({ alias: 'my-utils' }, testOptions).then(() => {
			expect(scanner).lastCalledWith(
				{
					aliases: { 'my-utils': `${PROJECT_ROOT}/src/utils` },
					excludedPatterns: ['node_modules/**'],
					extensions: ['js'],
					fileScanParallelism: 50,
					includedPatterns: ['**/*.js'],
					projectRootPath: PROJECT_ROOT,
					targetDirectory: '.'
				},
				testOptions.rescan
			);
			done();
		});
	});

	it('should throw an error when alias argument is not defined', () => {
		expect(() =>
			nayliasAction({ alias: 'my-non-existent-alias' }, testOptions)
		).toThrow();
	});

	it('should throw an error when aliases are not passed as options', () => {
		delete testOptions.alias;
		expect(() =>
			nayliasAction({ alias: 'my-non-existent-alias' }, testOptions)
		).toThrow();
	});

	it('should return list of imports that could utilize an alias', done => {
		nayliasAction({ alias: `my-utils` }, testOptions).then(results => {
			expect(results).toEqual([
				{
					sourceFile: `${PROJECT_ROOT}/src/documentsService.js`,
					numberOfImportsCanBeAliased: 2
				},
				{
					sourceFile: `${PROJECT_ROOT}/src/queueService.js`,
					numberOfImportsCanBeAliased: 1
				}
			]);
			done();
		});
	});
});
