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
				imported: 'myExport',
				local: 'myExport',
				source: '/modules/my-module.js'
			}
		]);
	});

	it('should resolve multiple named exports', () => {
		const testModule = `import { myExport, myOtherExport } from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imported: 'myExport',
				local: 'myExport',
				source: '/modules/my-module.js'
			},
			{
				imported: 'myOtherExport',
				local: 'myOtherExport',
				source: '/modules/my-module.js'
			}
		]);
	});

	it('should resolve named exports with aliases', () => {
		const testModule = `import { myExport as ex1, myOtherExport as ex2 } from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imported: 'myExport',
				local: 'ex1',
				source: '/modules/my-module.js'
			},
			{
				imported: 'myOtherExport',
				local: 'ex2',
				source: '/modules/my-module.js'
			}
		]);
	});

	it('should resolve entire module exports', () => {
		const testModule = `import * as myModule from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imported: '*',
				local: 'myModule',
				source: '/modules/my-module.js'
			}
		]);
	});

	it('should resolve default exports', () => {
		const testModule = `import myDefault from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imported: 'default',
				local: 'myDefault',
				source: '/modules/my-module.js'
			}
		]);
	});

	it('should resolve default exports and namespace imports', () => {
		const testModule = `import myDefault, * as myModule from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imported: 'default',
				local: 'myDefault',
				source: '/modules/my-module.js'
			},
			{
				imported: '*',
				local: 'myModule',
				source: '/modules/my-module.js'
			}
		]);
	});

	it('should resolve default exports and named imports', () => {
		const testModule = `import myDefault, {foo, bar} from '/modules/my-module.js'`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imported: 'default',
				local: 'myDefault',
				source: '/modules/my-module.js'
			},
			{
				imported: 'foo',
				local: 'foo',
				source: '/modules/my-module.js'
			},
			{
				imported: 'bar',
				local: 'bar',
				source: '/modules/my-module.js'
			}
		]);
	});

	it('should resolve default exports and named imports with aliases', () => {
		const testModule = `import myDefault, {foo as myFoo, bar as myBar} from '/modules/my-module.js'`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imported: 'default',
				local: 'myDefault',
				source: '/modules/my-module.js'
			},
			{
				imported: 'foo',
				local: 'myFoo',
				source: '/modules/my-module.js'
			},
			{
				imported: 'bar',
				local: 'myBar',
				source: '/modules/my-module.js'
			}
		]);
	});
});
