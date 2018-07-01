const calculateHash = require('./');

it('should calculate hash', () => {
	const testScannerArgs = {
		targetDirectory: '.',
		includedPatterns: ['**/*.js', '**/*.ts'],
		excludedPatterns: ['.cache', 'node_modules/**'],
		extensions: ['ts', 'js', 'mjs'],
		aliases: {
			'aliased-library': `/__fixtures__/es6`
		},
		projectRootPath: `/some/path`,
		customAcornObj: null
	};
	const hash = calculateHash(testScannerArgs);
	expect(hash).toBeDefined();
});
