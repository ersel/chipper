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
					{
						id: `${testRootPath}/directory/child.js`
					},
					{
						id: `${testRootPath}/directory/subdirectory/grandchild.js`
					},
					{
						id: `${testRootPath}/directory/subdirectory/typedgrandchild.ts`
					},
					{
						id: `${testRootPath}/node_modules/somethingjs/index.js`
					},
					{
						id: `${testRootPath}/index.js`
					}
				],
				links: [
					{
						source: `${testRootPath}/directory/child.js`,
						target: `${testRootPath}/directory/subdirectory/grandchild.js`,
						weight: 1
					},
					{
						source: `${testRootPath}/directory/child.js`,
						target: `${testRootPath}/directory/subdirectory/typedgrandchild.ts`,
						weight: 1
					},
					{
						source: `${testRootPath}/directory/subdirectory/grandchild.js`,
						target: `${testRootPath}/node_modules/somethingjs/index.js`,
						weight: 1
					},
					{
						source: `${testRootPath}/directory/subdirectory/typedgrandchild.ts`,
						target: `${testRootPath}/index.js`,
						weight: 1
					},
					{
						source: `${testRootPath}/index.js`,
						target: `${testRootPath}/directory/child.js`,
						weight: 1
					}
				]
			});
			done();
		});
	});
});
