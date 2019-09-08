const resolve = require('./');
const path = require('path');
const fs = require('fs');

const pathOfImportingModule = process.cwd();
const projectRootPath = pathOfImportingModule;

describe('Resolves full path to a module', () => {
	beforeAll(done => {
		fs.mkdirSync('/tmp/modules/');
		fs.writeFileSync('/tmp/modules/index.js', '// nothing here');
		done();
	});

	it('should resolve relative path with extension', () => {
		const importedPath = './__fixtures__/nonstandard/module.ts';
		const fullPath = path.resolve(pathOfImportingModule, importedPath);
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['ts']
		});
		expect(resolvedPath).toEqual(fullPath);
	});

	it('should resolve relative path without extension', () => {
		const importedPath = './__fixtures__/nonstandard/module';
		const fullPath = path.resolve(
			pathOfImportingModule,
			`${importedPath}.ts`
		);
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['ts']
		});
		expect(resolvedPath).toEqual(fullPath);
	});

	it('should resolve relative path directory', () => {
		const importedPath = './__fixtures__/es6/';
		const fullPath = path.resolve(
			pathOfImportingModule,
			`${importedPath}index.js`
		);
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});
		expect(resolvedPath).toEqual(fullPath);
	});

	it('should resolve imports from a directory without /', () => {
		const importedPath = './__fixtures__/es6';
		const fullPath = path.resolve(
			pathOfImportingModule,
			`${importedPath}/index.js`
		);
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});
		expect(resolvedPath).toEqual(fullPath);
	});

	it('should handle when directory does not exist', () => {
		const importedPath = './__fixtures__/es7/';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});
		expect(resolvedPath).toEqual('Unable to import: ./__fixtures__/es7/');
	});

	it('should handle when directory exists but there is no index module', () => {
		const importedPath = './__fixtures__/es6/directory';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});
		expect(resolvedPath).toEqual(
			'Unable to import: ./__fixtures__/es6/directory'
		);
	});

	it('should resolve absolute path with extension', () => {
		const importedPath = '/tmp/modules/index.js';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});
		expect(resolvedPath).toEqual(importedPath);
	});

	it('should resolve absolute path without extension', () => {
		const importedPath = '/tmp/modules/index';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});
		expect(resolvedPath).toEqual(`${importedPath}.js`);
	});

	it('should resolve absolute path with directory', () => {
		const importedPath = '/tmp/modules/';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});
		expect(resolvedPath).toEqual(`${importedPath}index.js`);
	});

	it('should resolve node modules import with extension', () => {
		const importedPath = 'moment/index.js';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			'node_modules',
			importedPath
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve node modules import without extension', () => {
		const importedPath = 'caporal/lib/utils';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			'node_modules',
			`${importedPath}.js`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve node modules import from directory', () => {
		const importedPath = 'babel-jest/build/';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			'node_modules',
			`${importedPath}index.js`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve node modules import from directory', () => {
		const importedPath = 'ramda';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			'node_modules',
			`${importedPath}/es/index.js`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve modules which are aliased and have extension', () => {
		const importedPath = 'my-aliased-module/index.js';
		const aliases = {
			'my-aliased-module': `${projectRootPath}/__fixtures__/es6`
		};
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			aliases,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			`./__fixtures__/es6/index.js`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve modules which are aliased and do not have extension', () => {
		const importedPath = 'my-aliased-module/directory/child';
		const aliases = {
			'my-aliased-module': `${projectRootPath}/__fixtures__/es6`
		};
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			aliases,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			`./__fixtures__/es6/directory/child.js`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve modules which are aliased and default imports', () => {
		const importedPath = 'my-aliased-module';
		const aliases = {
			'my-aliased-module': `${projectRootPath}/__fixtures__/es6`
		};
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			aliases,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			`./__fixtures__/es6/index.js`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should throw error if a file without extension can not be resolved', () => {
		const importedPath = 'my-aliased-module/no-such-file';
		const aliases = {
			'my-aliased-module': `${projectRootPath}/__fixtures__/es6`
		};
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			aliases,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = 'Unable to import: ./no-such-file';

		expect(resolvedPath).toEqual(expectedPath);
	});

	afterAll(done => {
		fs.unlinkSync('/tmp/modules/index.js');
		fs.rmdirSync('/tmp/modules/');
		done();
	});
});
