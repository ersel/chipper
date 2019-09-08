const resolver = require('./');

describe('ES6 Import Resolvers', () => {
	it('should return empty array when there are no imports', () => {
		const testModule = 'let a = 6;';
		const imports = resolver(testModule);
		expect(imports).toEqual([]);
	});

	it('should resolve a single named export', () => {
		const testModule = `import { myExport } from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: 'myExport', local: 'myExport' }],
				source: '/modules/my-module.js',
				"type": "es6",
			}
		]);
	});

	it('should resolve multiple named exports', () => {
		const testModules = `
		import { myExport, myOtherExport } from '/modules/my-module.js';
		import { exp1, exp2 } from '/modules/my-another-module.js';
		`;
		const imports = resolver(testModules);
		expect(imports).toEqual([
			{
				imports: [
					{ imported: 'myExport', local: 'myExport' },
					{ imported: 'myOtherExport', local: 'myOtherExport' }
				],
				source: '/modules/my-module.js',
				"type": "es6",
			},
			{
				imports: [
					{ imported: 'exp1', local: 'exp1' },
					{ imported: 'exp2', local: 'exp2' }
				],
				source: '/modules/my-another-module.js',
				"type": "es6",
			}
		]);
	});

	it('should resolve named exports with aliases', () => {
		const testModule = `import { myExport as ex1, myOtherExport as ex2 } from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [
					{ imported: 'myExport', local: 'ex1' },
					{ imported: 'myOtherExport', local: 'ex2' }
				],
				source: '/modules/my-module.js',
				"type": "es6",
			}
		]);
	});

	it('should resolve entire module exports', () => {
		const testModule = `import * as myModule from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: '*', local: 'myModule' }],
				source: '/modules/my-module.js',
				"type": "es6",
			}
		]);
	});

	it('should resolve default exports', () => {
		const testModule = `import myDefault from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: 'default', local: 'myDefault' }],
				source: '/modules/my-module.js',
				"type": "es6",
			}
		]);
	});

	it('should resolve default exports and namespace imports', () => {
		const testModule = `import myDefault, * as myModule from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [
					{ imported: 'default', local: 'myDefault' },
					{ imported: '*', local: 'myModule' }
				],
				source: '/modules/my-module.js',
				"type": "es6",
			}
		]);
	});

	it('should resolve default exports and named imports', () => {
		const testModule = `import myDefault, {foo, bar} from '/modules/my-module.js'`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [
					{ imported: 'default', local: 'myDefault' },
					{ imported: 'foo', local: 'foo' },
					{ imported: 'bar', local: 'bar' }
				],
				source: '/modules/my-module.js',
				"type": "es6",
			}
		]);
	});

	it('should resolve default exports and named imports with aliases', () => {
		const testModule = `import myDefault, {foo as myFoo, bar as myBar} from '/modules/my-module.js'`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [
					{ imported: 'default', local: 'myDefault' },
					{ imported: 'foo', local: 'myFoo' },
					{ imported: 'bar', local: 'myBar' }
				],
				source: '/modules/my-module.js',
				"type": "es6",
			}
		]);
	});
});
