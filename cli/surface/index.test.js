const fs = require('fs');

const surfaceAction = require('./');
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
			}
		];
		return Promise.resolve(MOCK_SCAN_DATA);
	})
);

describe('surface command', () => {
	let testOptions = {};
	beforeEach(() => {
		testOptions = {
			targetDir: '.',
			projectRoot: process.cwd(),
			ext: ['js'],
			incl: ['**/*.js'],
			excl: ['node_modules/**'],
			alias: 'some-alias:/path/to/some-alias',
			fileScanParallelism: 50,
			rescan: true
		};

		openFile.mockReset();
		fs.writeFileSync.mockReset();
	});
	it('should call scanner with the right params', done => {
		surfaceAction({ target: 'lodash' }, testOptions).then(() => {
			expect(scanner).lastCalledWith(
				{
					aliases: { 'some-alias': '/path/to/some-alias' },
					excludedPatterns: ['node_modules/**'],
					extensions: ['js'],
					fileScanParallelism: 50,
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
		surfaceAction({ target: 'lodash' }, testOptions).then(() => {
			expect(scanner).lastCalledWith(
				{
					aliases: {},
					excludedPatterns: ['node_modules/**'],
					extensions: ['js'],
					fileScanParallelism: 50,
					includedPatterns: ['**/*.js'],
					projectRootPath: process.cwd(),
					targetDirectory: '.'
				},
				testOptions.rescan
			);
			done();
		});
	});
	it('should find node_module imports', done => {
		fs.statSync = () => true; // when set to true gets treated as node_modules import
		surfaceAction({ target: 'lodash' }, testOptions).then(() => {
			expect(fs.writeFileSync.mock.calls).toHaveLength(1);
			const lastReportWriteCall = fs.writeFileSync.mock.calls[0];
			const [fileName, reportContents] = lastReportWriteCall;
			expect(reportContents).toMatchSnapshot();
			expect(openFile).lastCalledWith(fileName);
			expect(openFile).toHaveBeenCalledTimes(1);
			done();
		});
	});

	it('should find local imports (relative path)', done => {
		fs.statSync = () => false;
		surfaceAction({ target: 'src/documentsService.js' }, testOptions).then(
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

	it('should find local imports (absolute path)', done => {
		fs.statSync = () => false;
		surfaceAction(
			{ target: `${process.cwd()}/src/documentsService.js` },
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

	it('should find aliased imports', done => {
		fs.statSync = () => false;
		testOptions.alias = `utils:${process.cwd()}/src/utils`;
		surfaceAction({ target: 'utils' }, testOptions).then(() => {
			expect(fs.writeFileSync.mock.calls).toHaveLength(1);
			const lastReportWriteCall = fs.writeFileSync.mock.calls[0];
			const [fileName, reportContents] = lastReportWriteCall;
			expect(reportContents).toMatchSnapshot();
			expect(openFile).lastCalledWith(fileName);
			expect(openFile).toHaveBeenCalledTimes(1);
			done();
		});
	});
});
