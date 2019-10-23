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
				path: '',
				source: 'some-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve a membered cjs require without declaration', () => {
		const testModule = `require('some-module.js')('')({}).xyz.lol().test()({}).joking`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [],
				path: '()().xyz.lol().test()().joking',
				source: 'some-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve a membered cjs require without declaration (2)', () => {
		const testModule = `require('some-module.js').ABC`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [],
				path: 'ABC',
				source: 'some-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve a default cjs require', () => {
		const testModule = `const xyz = require('some-module.js')`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: '*', local: 'xyz' }],
				path: '',
				source: 'some-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve a membered cjs require', () => {
		const testModule = `const xyz = require('some-module.js')('')({}).xyz.lol().test()({}).joking`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: '*', local: 'xyz' }],
				path: '()().xyz.lol().test()().joking',
				source: 'some-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve multiple destructuring requires', () => {
		const testModules = `
		const { myExport, myOtherExport } = require('/modules/my-module.js');;
		const { exp1, exp2 } = require('/modules/my-another-module.js');
		`;
		const imports = resolver(testModules);
		expect(imports).toEqual([
			{
				imports: [
					{ imported: 'myExport', local: 'myExport' },
					{ imported: 'myOtherExport', local: 'myOtherExport' }
				],
				path: '',
				source: '/modules/my-module.js',
				type: 'commonjs'
			},
			{
				imports: [
					{ imported: 'exp1', local: 'exp1' },
					{ imported: 'exp2', local: 'exp2' }
				],
				path: '',
				source: '/modules/my-another-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve requires with destructuring and renaming', () => {
		const testModule = `const { myExport: ex1, myOtherExport: ex2 } = require('/modules/my-module.js');`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [
					{ imported: 'myExport', local: 'ex1' },
					{ imported: 'myOtherExport', local: 'ex2' }
				],
				path: '',
				source: '/modules/my-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve rest parameter require', () => {
		const testModule = `const { test, test1: xyz, ...rest } = require('some-module.js');`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [
					{ imported: 'test', local: 'test' },
					{ imported: 'test1', local: 'xyz' },
					{ imported: '...', local: 'rest' }
				],
				path: '',
				source: 'some-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve membered require with destructuring', () => {
		const testModule = `const { test, test1: xyz, ...rest } = require('some-module.js')('')({}).xyz.lol().test()({}).joking;`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [
					{ imported: 'test', local: 'test' },
					{ imported: 'test1', local: 'xyz' },
					{ imported: '...', local: 'rest' }
				],
				path: '()().xyz.lol().test()().joking',
				source: 'some-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve membered require', () => {
		const testModule = `const x = require('some-module.js').ABC`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: '*', local: 'x' }],
				path: 'ABC',
				source: 'some-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve membered require', () => {
		const testModule = `
		  
		  const createDelivery = async ({
			clientId,
			supplierId,
			deliveryRef,
			estimatedDeliveryDate,
			deliveryLines
		  }) => {};
		  
		  module.exports = createDelivery;
		  `;
		const imports = resolver(testModule);
		expect(imports).toEqual([]);
	});

	it('should resolve non-global require', () => {
		const testModule = `
		  
		  const xyz = () => {
			  const x = require('some-module.js').ABC
		  }
		  
		  module.exports = createDelivery;
		  `;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: '*', local: 'x' }],
				path: 'ABC',
				source: 'some-module.js',
				type: 'commonjs'
			}
		]);
	});

	it('should resolve dynamic require', () => {
		const testModule = `
		 const y = () => { 
		  const xyz = () => {
			  const somePath = Math.random() > 0.5 ? './this.js' : './that.js';
			  const x = require(somePath)({test: 1}).yoo.lol(1).ABC
		  }
		}
		  
		  module.exports = createDelivery;
		  `;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{
				imports: [{ imported: '*', local: 'x' }],
				path: '().yoo.lol().ABC',
				source: '***dynamic***',
				type: 'commonjs'
			}
		]);
	});
});
