const resolver = require('./');

jest.mock('acorn', () => ({
	parse: () => {
		throw new Error('Unsupported Syntax');
	}
}));
jest.mock('acorn-jsx/inject', () => cb => cb);
jest.mock('acorn5-object-spread/inject', () => cb => cb);

describe('Unsupported Syntax', () => {
	it('should warn user about unsupported source file', () => {
		jest.spyOn(global.console, 'error').mockImplementation(msg => msg);
		expect(global.console.error).not.toHaveBeenCalled();
		const testModule = `import myDefault, {foo as myFoo, bar as myBar} from '/modules/my-module.js'`;
		const imports = resolver(testModule);
		expect(global.console.error).toHaveBeenCalledTimes(2);
		expect(imports).toEqual([]);
		global.console.error.mockRestore();
	});
});
