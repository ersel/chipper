const resolve = require('./');
const path = require('path');
const fs = require('fs');

const pathOfImportingModule = process.cwd();
const projectRootPath = pathOfImportingModule;

jest.mock('fs');

describe('read package.json', () => {
	it('should resolve node modules import from directory', () => {
		fs.readFileSync = jest.fn(() => `{"module": "module-mock.js"}`);
		const importedPath = 'test1';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			'node_modules',
			`test1/module-mock.js`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve node modules import from directory', () => {
		fs.readFileSync = jest.fn(() => `{"main": "main-mock.js"}`);
		const importedPath = 'test2';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			'node_modules',
			`test2/main-mock.js`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve node modules import from directory', () => {
		fs.readFileSync = jest.fn(() => `{"files": ["files-mock.js"]}`);
		const importedPath = 'test3';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			'node_modules',
			`test3/files-mock.js`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});

	it('should resolve node modules import from directory', () => {
		fs.readFileSync = jest.fn(() => `{}`);
		const importedPath = 'test4';
		const resolvedPath = resolve({
			importedPath,
			pathOfImportingModule,
			projectRootPath,
			extensions: ['ts', 'jsx', 'mjs', 'js']
		});

		const expectedPath = path.resolve(
			projectRootPath,
			'node_modules',
			`test4/Unable-To-Import`
		);

		expect(resolvedPath).toEqual(expectedPath);
	});
});
