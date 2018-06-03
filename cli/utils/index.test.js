const utils = require('.');

const testRootPath = process.cwd();
describe('alias resolution', () => {
	it('should parse CLI alias args into key-value pairs', () => {
		const testAliases = ['my-alias:/somePath/to/somewhere'];
		const parsedAliases = utils.parseAliases(testAliases);
		expect(parsedAliases).toEqual({
			'my-alias': '/somePath/to/somewhere'
		});
	});

	it('should throw if encountered invalid alias declaration', () => {
		const testAliases = ['my-alias-/somePath/to/somewhere'];
		expect(() => utils.parseAliases(testAliases, testRootPath)).toThrow();
	});

	it('should parse multiple aliases', () => {
		const testAliases = ['x:/path/to/x', 'y:/path/to/y'];
		const parsedAliases = utils.parseAliases(testAliases, testRootPath);
		expect(parsedAliases).toEqual({
			x: '/path/to/x',
			y: '/path/to/y'
		});
	});

	it('should parse relative paths', () => {
		const testAliases = ['x:relative/module'];
		const parsedAliases = utils.parseAliases(testAliases, testRootPath);
		expect(parsedAliases).toEqual({
			x: `${testRootPath}/relative/module`
		});
	});
});

describe('parse target path', () => {
	it('should leave absolute path as it is', () => {
		const testPath = '/my/test/path';
		const parsedPath = utils.parseTargetPath(testPath, testRootPath);
		expect(parsedPath).toBe(testPath);
	});

	it('should resolve relative imported directories', () => {
		const testPath = 'directory';
		const basePath = `${testRootPath}/__fixtures__/es6`;
		const parsedPath = utils.parseTargetPath(testPath, basePath);
		expect(parsedPath).toBe(`${basePath}/directory`);
	});

	it('should resolve relative imported directories', () => {
		const testPath = 'directory/subdirectory';
		const basePath = `${testRootPath}/__fixtures__/es6`;
		const parsedPath = utils.parseTargetPath(testPath, basePath);
		expect(parsedPath).toBe(`${basePath}/directory/subdirectory`);
	});

	it('should resolve relative imported modules', () => {
		const testPath = 'directory/subdirectory/grandchild.js';
		const basePath = `${testRootPath}/__fixtures__/es6`;
		const parsedPath = utils.parseTargetPath(testPath, basePath);
		expect(parsedPath).toBe(
			`${basePath}/directory/subdirectory/grandchild.js`
		);
	});

	it('should throw if relative imported module does not have extension', () => {
		const testPath = 'directory/subdirectory/grandchild';
		const basePath = `${testRootPath}/__fixtures__/es6`;
		expect(() => utils.parseTargetPath(testPath, basePath, {})).toThrow();
	});

	it('should resolve node modules', () => {
		const testPath = 'somethingjs';
		const basePath = `${testRootPath}/__fixtures__/es6`;
		const parsedPath = utils.parseTargetPath(testPath, basePath);
		expect(parsedPath).toBe(`${basePath}/node_modules/somethingjs`);
	});

	it('should resolve node modules', () => {
		const testPath = 'somethingjs/index.js';
		const basePath = `${testRootPath}/__fixtures__/es6`;
		const parsedPath = utils.parseTargetPath(testPath, basePath);
		expect(parsedPath).toBe(
			`${basePath}/node_modules/somethingjs/index.js`
		);
	});

	it('should throw if import node modules does not have an extension', () => {
		const testPath = 'somethingjs/index';
		const basePath = `${testRootPath}/__fixtures__/es6`;
		expect(() => utils.parseTargetPath(testPath, basePath, {})).toThrow();
	});

	it('should resolve node modules subfolder', () => {
		const testPath = 'somethingjs/subdir';
		const basePath = `${testRootPath}/__fixtures__/es6`;
		const parsedPath = utils.parseTargetPath(testPath, basePath);
		expect(parsedPath).toBe(`${basePath}/node_modules/somethingjs/subdir`);
	});

	it('should resolve aliased import', () => {
		const testPath = 'my-alias';
		const basePath = `${testRootPath}/__fixtures__/es6`;
		const parsedPath = utils.parseTargetPath(testPath, basePath, {
			'my-alias': '/somePath/to/somewhere'
		});
		expect(parsedPath).toBe(`/somePath/to/somewhere`);
	});

	it('should throw if target path is not a string', () => {
		const testPath = null;
		const basePath = `${testRootPath}/__fixtures__/es6`;
		expect(() =>
			utils.parseTargetPath(testPath, basePath, {
				'my-alias': '/somePath/to/somewhere'
			})
		).toThrow();
	});
});
