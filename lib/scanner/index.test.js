const scanner = require('./');

const basePath = process.cwd();

describe('Import Scanner ES6', () => {
	const testDirectory = '__fixtures__/es6';
	const testAliases = {
		'aliased-library': `${basePath}/__fixtures__/es6`
	};
	const testExtensions = ['js', 'ts'];
	const testIncludePatterns = ['**/*.js', '**/*.ts'];
	const testRootPath = `${basePath}/${testDirectory}`;

	it('should compile a list of all imports for a given directory', done => {
		scanner({
			targetDirectory: '.',
			includedPatterns: testIncludePatterns,
			extensions: testExtensions,
			aliases: testAliases,
			projectRootPath: testRootPath
		}).then(results => {
			expect(results.length).toEqual(4);
			expect(results).toEqual([
				{
					importedModules: [
						{
							absolute: `${testRootPath}/directory/subdirectory/grandchild.js`,
							imports: [
								{
									imported: 'namedImport1',
									local: 'namedImport1'
								},
								{
									imported: 'namedImport2',
									local: 'localImport'
								}
							],
							source: './subdirectory/grandchild'
						},
						{
							absolute: `${testRootPath}/directory/subdirectory/typedgrandchild.ts`,
							imports: [
								{
									imported: 'default',
									local: 'grandChildImport'
								},
								{
									imported: '*',
									local: 'grandChildNamespaceImport'
								}
							],
							source: './subdirectory/typedgrandchild'
						}
					],
					sourceFile: `${testRootPath}/directory/child.js`
				},
				{
					importedModules: [
						{
							absolute: `${testRootPath}/node_modules/somethingjs/index.js`,
							imports: [
								{
									imported: 'default',
									local: 'nodeModuleImport'
								}
							],
							source: 'somethingjs'
						}
					],
					sourceFile: `${testRootPath}/directory/subdirectory/grandchild.js`
				},
				{
					importedModules: [
						{
							absolute: `${testRootPath}/directory/child.js`,
							imports: [{ imported: 'default', local: 'xyz' }],
							source: './directory/child'
						}
					],
					sourceFile: `${testRootPath}/index.js`
				},
				{
					importedModules: [
						{
							absolute: `${testRootPath}/index.js`,
							imports: [
								{
									imported: 'default',
									local: 'importFromAliasedLibrary'
								}
							],
							source: 'aliased-library'
						}
					],
					sourceFile: `${testRootPath}/directory/subdirectory/typedgrandchild.ts`
				}
			]);
			done();
		});
	});
});

describe('Import Scanner CJS', () => {
	const testDirectory = '__fixtures__/static-require';
	const testAliases = {
		'aliased-library': `${basePath}/__fixtures__/static-require`
	};
	const testExtensions = ['js', 'ts'];
	const testIncludePatterns = ['**/*.js', '**/*.ts'];
	const testRootPath = `${basePath}/${testDirectory}`;

	it('should compile a list of all imports for a given directory', done => {
		scanner({
			targetDirectory: '.',
			includedPatterns: testIncludePatterns,
			extensions: testExtensions,
			aliases: testAliases,
			projectRootPath: testRootPath
		}).then(results => {
			expect(results.length).toEqual(4);
			expect(results).toEqual([
				{
					importedModules: [
						{
							absolute:
								'/Users/erselaker/justfulfil/chipper/__fixtures__/static-require/directory/subdirectory/grandchild.js',
							imports: [
								{
									imported: 'namedImport1',
									local: 'namedImport1'
								},
								{
									imported: 'namedImport2',
									local: 'localImport'
								},
								{ imported: '...', local: 'rest' }
							],
							source: './subdirectory/grandchild'
						},
						{
							absolute:
								'/Users/erselaker/justfulfil/chipper/__fixtures__/static-require/directory/subdirectory/typedgrandchild.ts',
							imports: [
								{
									imported: '*',
									local: 'grandChildNamespaceImport'
								}
							],
							source: './subdirectory/typedgrandchild'
						}
					],
					sourceFile:
						'/Users/erselaker/justfulfil/chipper/__fixtures__/static-require/directory/child.js'
				},
				{
					importedModules: [
						{
							absolute:
								'/Users/erselaker/justfulfil/chipper/__fixtures__/static-require/node_modules/somethingjs/index.js',
							imports: [
								{ imported: '*', local: 'nodeModuleImport' }
							],
							source: 'somethingjs'
						}
					],
					sourceFile:
						'/Users/erselaker/justfulfil/chipper/__fixtures__/static-require/directory/subdirectory/grandchild.js'
				},
				{
					importedModules: [
						{
							absolute:
								'/Users/erselaker/justfulfil/chipper/__fixtures__/static-require/directory/child.js',
							imports: [{ imported: '*', local: 'xyz' }],
							source: './directory/child'
						}
					],
					sourceFile:
						'/Users/erselaker/justfulfil/chipper/__fixtures__/static-require/index.js'
				},
				{
					importedModules: [
						{
							absolute:
								'/Users/erselaker/justfulfil/chipper/__fixtures__/static-require/index.js',
							imports: [
								{
									imported: '*',
									local: 'importFromAliasedLibrary'
								}
							],
							source: 'aliased-library'
						}
					],
					sourceFile:
						'/Users/erselaker/justfulfil/chipper/__fixtures__/static-require/directory/subdirectory/typedgrandchild.ts'
				}
			]);
			done();
		});
	});
});
