const surfaceAction = require('./');
const scanner = require('../../lib/scanner/cache/');

jest.mock('../../lib/scanner/cache/', () => jest.fn(() => Promise.resolve({})));

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
	it('should call scanner with the right params', () => {
		surfaceAction([''], testOptions);
		expect(scanner).lastCalledWith(
			{
				aliases: { 'some-alias': '/path/to/some-alias' },
				excludedPatterns: ['node_modules/**'],
				extensions: ['js'],
				includedPatterns: ['**/*.js'],
				projectRootPath: '/Users/erselaker/chipper',
				targetDirectory: '.'
			},
			testOptions.rescan
		);

		delete testOptions.alias;
		surfaceAction([''], testOptions);
		expect(scanner).lastCalledWith(
			{
				aliases: {},
				excludedPatterns: ['node_modules/**'],
				extensions: ['js'],
				includedPatterns: ['**/*.js'],
				projectRootPath: '/Users/erselaker/chipper',
				targetDirectory: '.'
			},
			testOptions.rescan
		);
	});
});
