const fs = require('fs');

const dependenciesAction = require('./');
const scanner = require('../../lib/scanner/cache/scanCache');
const openFile = require('../utils/openFile/');

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
						source: 'lodash',
						absolute: `${PROJECT_ROOT}/node_modules/lodash/lodash.js`,
						imports: [
							{
								imported: 'uniq',
								local: 'uniq'
							}
						]
					}
				]
			},
			{
				sourceFile: `${PROJECT_ROOT}/src/loginService.js`,
				importedModules: [
					{
						source: './documentsService',
						absolute: `${PROJECT_ROOT}/src/documentsService.js`,
						imports: [
							{
								imported: 'getDocuments',
								local: 'getLoggedInUsersDocuments'
							}
						]
					},
					{
						source: './utils/cookiesService',
						absolute: `${PROJECT_ROOT}/src/utils/cookiesService.js`,
						imports: [
							{
								imported: 'setCookie',
								local: 'setCookie'
							}
						]
					}
				]
			},
			{
				sourceFile: `${PROJECT_ROOT}/src/utils/cookiesServices.js`,
				importedModules: [
					{
						source: 'cookie-jar',
						absolute: `${PROJECT_ROOT}/node_modules/cookie-jar/index.js`,
						imports: [
							{
								imported: 'setCookie',
								local: 'setCookie'
							},
							{
								imported: 'getCookie',
								local: 'getCookie'
							}
						]
					},
					{
						source: 'lodash',
						absolute: `${PROJECT_ROOT}/node_modules/lodash/get/index.js`,
						imports: [
							{
								imported: 'get',
								local: 'get'
							}
						]
					}
				]
			}
		];
		return Promise.resolve(MOCK_SCAN_DATA);
	})
);

describe('dependencies command', () => {
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

		openFile.mockReset();
		fs.writeFileSync.mockReset();
	});
	it('should call scanner with the right params', done => {
		dependenciesAction({ target: 'src/' }, testOptions).then(() => {
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
		});
	});

	it('should call scanner with the right params when no aliases are defined', done => {
		delete testOptions.alias;
		dependenciesAction({ target: 'src/' }, testOptions).then(() => {
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
		});
	});

	it('should return all imports of a single module (absolute path)', done => {
		dependenciesAction(
			{ target: `${process.cwd()}/src/loginService.js` },
			testOptions
		).then(() => {
			expect(fs.writeFileSync.mock.calls).toHaveLength(1);
			const lastReportWriteCall = fs.writeFileSync.mock.calls[0];
			const [fileName, reportContents] = lastReportWriteCall;
			expect(reportContents).toMatchSnapshot();
			expect(openFile).lastCalledWith(fileName);
			expect(openFile).toHaveBeenCalledTimes(1);
			done();
		});
	});

	it('should return all imports of a single module', done => {
		dependenciesAction({ target: 'src/loginService.js' }, testOptions).then(
			() => {
				expect(fs.writeFileSync.mock.calls).toHaveLength(1);
				const lastReportWriteCall = fs.writeFileSync.mock.calls[0];
				const [fileName, reportContents] = lastReportWriteCall;
				expect(reportContents).toMatchSnapshot();
				expect(openFile).lastCalledWith(fileName);
				expect(openFile).toHaveBeenCalledTimes(1);
				done();
			}
		);
	});

	it('should return all imports of a directory of modules', done => {
		dependenciesAction({ target: 'src/' }, testOptions).then(() => {
			expect(fs.writeFileSync.mock.calls).toHaveLength(1);
			const lastReportWriteCall = fs.writeFileSync.mock.calls[0];
			const [fileName, reportContents] = lastReportWriteCall;
			expect(reportContents).toMatchSnapshot();
			expect(openFile).lastCalledWith(fileName);
			expect(openFile).toHaveBeenCalledTimes(1);
			done();
		});
	});

	it('should return all imports for an aliased search target', done => {
		testOptions.alias = `my-utils:${process.cwd()}/src/utils`;
		dependenciesAction(
			{ target: 'my-utils/cookiesServices.js' },
			testOptions
		).then(() => {
			expect(fs.writeFileSync.mock.calls).toHaveLength(1);
			const lastReportWriteCall = fs.writeFileSync.mock.calls[0];
			const [fileName, reportContents] = lastReportWriteCall;
			expect(reportContents).toMatchSnapshot();
			expect(openFile).lastCalledWith(fileName);
			expect(openFile).toHaveBeenCalledTimes(1);
			done();
		});
	});

	it('should not write a report when no results are found', done => {
		dependenciesAction({ target: 'src/noSuchMode.js' }, testOptions).then(
			() => {
				expect(fs.writeFileSync).not.toHaveBeenCalled();
				expect(openFile).not.toHaveBeenCalled();
				done();
			}
		);
	});
});
