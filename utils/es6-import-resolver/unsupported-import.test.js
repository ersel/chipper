const resolver = require('./');

jest.mock('acorn', () => ({
	parse: () => ({
		body: [
			{
				type: 'ImportDeclaration',
				source: { value: 'something' },
				specifiers: [{}]
			}
		]
	})
}));
jest.mock('acorn-jsx/inject', () => cb => cb);
jest.mock('acorn5-object-spread/inject', () => cb => cb);

describe('Unsupported Import', () => {
	it('should return a string indicating unsupported import type', () => {
		const testModule = `import myDefault, {foo as myFoo, bar as myBar} from '/modules/my-module.js'`;
		const imports = resolver(testModule);
		expect(imports).toEqual([
			{ imports: ['Unsupported Export'], source: 'something' }
		]);
	});
});

describe('Unsupported syntax', () => {});
