const scanner = require('../../lib/scanner/index');
const constructGraph = require('.');

const basePath = process.cwd();

describe('Construct graph data structure from scan data', () => {
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
			const graph = constructGraph(results).serialize();
			expect(graph).toEqual({
				nodes: [
					`${testRootPath}/directory/child.js`,
					`${testRootPath}/directory/subdirectory/grandchild.js`,
					`${testRootPath}/directory/subdirectory/typedgrandchild.ts`,
					`${testRootPath}/node_modules/somethingjs/index.js`,
					`${testRootPath}/index.js`
				],
				links: [
					{
						source: `${testRootPath}/directory/child.js`,
						target: `${testRootPath}/directory/subdirectory/grandchild.js`
					},
					{
						source: `${testRootPath}/directory/child.js`,
						target: `${testRootPath}/directory/subdirectory/typedgrandchild.ts`
					},
					{
						source: `${testRootPath}/directory/subdirectory/grandchild.js`,
						target: `${testRootPath}/node_modules/somethingjs/index.js`
					},
					{
						source: `${testRootPath}/directory/subdirectory/typedgrandchild.ts`,
						target: `${testRootPath}/index.js`
					},
					{
						source: `${testRootPath}/index.js`,
						target: `${testRootPath}/directory/child.js`
					}
				]
			});
			done();
		});
	});
});
