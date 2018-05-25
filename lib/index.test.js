const chipper = require('./');

describe('Chipper', () => {
	const testDirectory = '__fixtures__/es6';

	it('should compile a list of all imports for a given directory', done => {
		chipper(testDirectory, ['**/*.js', '**/*.ts']).then(results => {
			expect(results).not.toBe(null);
			done();
		});
	});
});
