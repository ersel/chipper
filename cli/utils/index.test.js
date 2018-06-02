const utils = require('.');

describe('alias resolution', () => {
	const testRootPath = process.cwd();
	it('should parse CLI alias args into key-value pairs', () => {
		const testAliases = ['my-alias:/somePath/to/somewhere'];
		const parsedAliases = utils(testAliases);
		expect(parsedAliases).toEqual({
			'my-alias': '/somePath/to/somewhere'
		});
	});

	it('should throw if encountered invalid alias declaration', () => {
		const testAliases = ['my-alias-/somePath/to/somewhere'];
		expect(() => utils(testAliases, testRootPath)).toThrow();
	});

	it('should parse multiple aliases', () => {
		const testAliases = ['x:/path/to/x', 'y:/path/to/y'];
		const parsedAliases = utils(testAliases, testRootPath);
		expect(parsedAliases).toEqual({
			x: '/path/to/x',
			y: '/path/to/y'
		});
	});

	it('should parse relative paths', () => {
		const testAliases = ['x:relative/module'];
		const parsedAliases = utils(testAliases, testRootPath);
		expect(parsedAliases).toEqual({
			x: `${testRootPath}/relative/module`
		});
	});
});
