const getModules = require('./');

const basePath = process.cwd();

describe('Filesystem Utilities', () => {
	const testDirectory = `${basePath}/__fixtures__/es6`;

	it('should get a list of JavaScript modules located within the target directory', () => {
		const foundModules = getModules(testDirectory);
		expect(foundModules.length).toBe(3);
		expect(foundModules).toEqual(
			expect.arrayContaining([
				`${testDirectory}/directory/child.js`,
				`${testDirectory}/directory/subdirectory/grandchild.js`,
				`${testDirectory}/index.js`
			])
		);
	});

	it('should match multiple patterns to find modules', () => {
		const foundModules = getModules(testDirectory, ['**/*.js', '**/*.ts']);
		expect(foundModules.length).toBe(4);
		expect(foundModules).toEqual(
			expect.arrayContaining([
				`${testDirectory}/directory/child.js`,
				`${testDirectory}/directory/subdirectory/grandchild.js`,
				`${testDirectory}/directory/subdirectory/typedgrandchild.ts`,
				`${testDirectory}/index.js`
			])
		);
	});

	it('should ignore multiple patterns whilst finding modules', () => {
		const foundModules = getModules(testDirectory, undefined, [
			`node_modules/**`,
			`directory/subdirectory/**`
		]);
		expect(foundModules.length).toBe(2);
		expect(foundModules).toEqual(
			expect.arrayContaining([
				`${testDirectory}/index.js`,
				`${testDirectory}/directory/child.js`
			])
		);
	});
});
