const resolver = require('./');

describe('Static Require Resolvers (CJS)', () => {
	it('should return empty array when there are no imports', () => {
		const testModule = 'let a = 6;';
		const imports = resolver(testModule);
		expect(imports).toEqual([]);
	});

	it('should resolve a require without declaration', () => {
		const testModule = `require('some-module.js')`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [],
				source: 'some-module.js'
			}
		]);
	});

	it('should resolve a default cjs require', () => {
		const testModule = `const xyz = require('some-module.js')`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: 'default', local: 'xyz' }],
				source: 'some-module.js'
			}
		]);
	});

	it.only('should resolve a named cjs require', () => {
		const testModule = `const xyz = require('some-module.js').h().t.zzz.lll().wtf`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: 'default', local: 'xyz' }],
				source: 'some-module.js'
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
				source: '/modules/my-module.js'
			},
			{
				imports: [
					{ imported: 'exp1', local: 'exp1' },
					{ imported: 'exp2', local: 'exp2' }
				],
				source: '/modules/my-another-module.js'
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
				source: '/modules/my-module.js'
			}
		]);
	});

	it('should resolve entire module exports', () => {
		const testModule = `import * as myModule from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: '*', local: 'myModule' }],
				source: '/modules/my-module.js'
			}
		]);
	});

	it('should resolve default exports', () => {
		const testModule = `import myDefault from '/modules/my-module.js';`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: 'default', local: 'myDefault' }],
				source: '/modules/my-module.js'
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
				source: '/modules/my-module.js'
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
				source: '/modules/my-module.js'
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
				source: '/modules/my-module.js'
			}
		]);
	});
});
