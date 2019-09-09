const dependentAction = require('./');
const scanner = require('../../lib/scanner/cache/graphCache');

jest.mock('fs');
jest.mock('../../lib/scanner/cache/graphCache', () =>
	jest.fn(() => {
		const PROJECT_ROOT = process.cwd();
		const MOCK_SCAN_DATA = [];
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
		dependentAction({ target: 'src/' }, testOptions).then(() => {
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

	it.skip('should return all imports of a single module (absolute path)', done => {
		dependentAction(
			{ target: `${process.cwd()}/src/loginService.js` },
			testOptions
		).then(() => {
			done();
		});
	});

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
