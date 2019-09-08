const resolve = require('./');
const path = require('path');
const fs = require('fs');

jest.mock('fs', () => ({
	existsSync: jest.fn(() => true),
	readFileSync: jest.fn().mockImplementation(() => `{"module": "mock.js"}`)
}));

const pathOfImportingModule = process.cwd();
const projectRootPath = pathOfImportingModule;

describe('calls to fs module are memoized', () => {
	afterEach(done => {
		fs.existsSync.mockClear();
		fs.readFileSync.mockClear();
		done();
	});

	it('should resolve relative path without extension', () => {
		const importedPath = './__fixtures__/nonstandard/module';
		const expectedPath = path.resolve(
			pathOfImportingModule,
			`${importedPath}.js`
		);
		expect(fs.existsSync.mock.calls.length).toBe(0);

		let resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);

		resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);
	});

	it('should resolve relative path directory', () => {
		const importedPath = './__fixtures__/es-next/';
		const expectedPath = path.resolve(
			pathOfImportingModule,
			`${importedPath}index.js`
		);
		expect(fs.existsSync.mock.calls.length).toBe(0);

		let resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['js']
		});
		expect(fs.existsSync.mock.calls.length).toBe(1);
		expect(resolvedPath).toEqual(expectedPath);

		resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['js']
		});
		expect(fs.existsSync.mock.calls.length).toBe(1);
		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve absolute path without extension', () => {
		const importedPath = '/tmp/modules/index';
		const expectedPath = '/tmp/modules/index.js';
		expect(fs.existsSync.mock.calls.length).toBe(0);

		let resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);

		resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);
	});

	it('should resolve absolute path with directory', () => {
		const importedPath = '/tmp/new-modules/';
		const expectedPath = '/tmp/new-modules/index.js';
		expect(fs.existsSync.mock.calls.length).toBe(0);

		let resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);

		resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);
	});

	it('should resolve node modules import without extension', () => {
		const importedPath = 'caporal/lib/utils';
		const expectedPath = path.resolve(
			pathOfImportingModule,
			'node_modules',
			`${importedPath}.js`
		);
		expect(fs.existsSync.mock.calls.length).toBe(0);

		let resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(2);

		resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(3);
	});

	it('should resolve node modules import from directory', () => {
		const importedPath = 'babel-generator/lib/';
		const expectedPath = path.resolve(
			pathOfImportingModule,
			'node_modules',
			`${importedPath}index.js`
		);
		expect(fs.existsSync.mock.calls.length).toBe(0);

		let resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['js']
		});

		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(2);

		resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(3);
	});

	it('should resolve node modules import from directory', () => {
		const importedPath = 'ramda';
		const expectedPath = path.resolve(
			pathOfImportingModule,
			'node_modules',
			`${importedPath}/mock.js`
		);
		expect(fs.readFileSync.mock.calls.length).toBe(0);

		let resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['js']
		});

		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.readFileSync.mock.calls.length).toBe(1);

		resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['js']
		});

		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.readFileSync.mock.calls.length).toBe(1);
	});

	it('should resolve modules which are aliased and do not have extension', () => {
		const importedPath = 'my-aliased-module/directory/child';
		const aliases = {
			'my-aliased-module': `${projectRootPath}/__fixtures__/es6`
		};
		const expectedPath = `${projectRootPath}/__fixtures__/es6/directory/child.js`;
		expect(fs.existsSync.mock.calls.length).toBe(0);

		let resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			aliases,
			extensions: ['js']
		});

		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);

		resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			aliases,
			extensions: ['js']
		});

		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);
	});

	it('should resolve modules which are aliased and default imports', () => {
		const importedPath = 'my-aliased-module';
		const aliases = {
			'my-aliased-module': `${projectRootPath}/__fixtures__/es6`
		};
		const expectedPath = `${projectRootPath}/__fixtures__/es6/index.js`;
		expect(fs.existsSync.mock.calls.length).toBe(0);

		let resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			aliases,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);

		resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			aliases,
			extensions: ['js']
		});
		expect(resolvedPath).toEqual(expectedPath);
		expect(fs.existsSync.mock.calls.length).toBe(1);
	});
});
