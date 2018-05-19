const resolve = require('./');
const path = require('path');
const fs = require('fs');

const pathOfImportingModule = process.cwd();

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

	afterAll(done => {
		fs.unlinkSync('/tmp/modules/index.js');
		fs.rmdirSync('/tmp/modules/');
		done();
	});

	// node modules with extension
	// node modules without extension
	// node modules directory
	// node modules alias
	//
});
