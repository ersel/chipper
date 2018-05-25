const getModules = require('./');

describe('Filesystem Utilities', () => {
	const testDirectory = '__fixtures__/es6';

	it('should get a list of JavaScript modules located within the target directory', () => {
		const foundModules = getModules(testDirectory);
		expect(foundModules).toEqual(
			expect.arrayContaining([
				'directory/child.js',
				'directory/subdirectory/grandchild.js',
				'index.js'
			])
		);
	});

	it('should match multiple patterns to find modules', () => {
		const foundModules = getModules(testDirectory, ['**/*.js', '**/*.ts']);
		expect(foundModules).toEqual(
			expect.arrayContaining([
				'directory/child.js',
				'directory/subdirectory/grandchild.js',
				'directory/subdirectory/typedgrandchild.ts',
				'index.js'
			])
		);
	});

	it('should ignore multiple patterns whilst finding modules', () => {
		const foundModules = getModules(testDirectory, undefined, [
			'node_modules/**',
			'directory/subdirectory/**'
		]);
		expect(foundModules).toEqual(
			expect.arrayContaining(['index.js', 'directory/child.js'])
		);
	});
});
