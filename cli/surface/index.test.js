const fs = require('fs');
const utils = require('../utils/index');
const surfaceAction = require('./');
const scanner = require('../../lib/scanner/cache/');

jest.mock('fs', () => ({ writeFileSync: jest.fn() }));

jest.mock('../../lib/scanner/cache/', () =>
	jest.fn(() => {
		const PROJECT_ROOT = process.cwd();
		const MOCK_SCAN_DATA = [
			{
				sourceFile: `${PROJECT_ROOT}/test/unit/documents/documentsService.spec.js`,
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
			}
		];
		return Promise.resolve(MOCK_SCAN_DATA);
	})
);

const testOptions = {
	targetDir: '.',
	projectRoot: process.cwd(),
	ext: ['js'],
	incl: ['**/*.js'],
	excl: ['node_modules/**'],
	alias: 'some-alias:/path/to/some-alias',
	rescan: true
};

describe('surface command', () => {
	beforeEach(() => {
		utils.openFile = jest.fn();
	});
	it('should call scanner with the right params', () => {
		surfaceAction({ target: 'lodash' }, testOptions);
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

		delete testOptions.alias;
		surfaceAction({ target: 'lodash' }, testOptions);
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

		// expect(utils.openFile).toHaveBeenCalledTimes(2);
		// expect(fs.writeFileSync).lastCalledWith({});
		// TODO: MOCK fs.statSync for node_modules test
	});
});
