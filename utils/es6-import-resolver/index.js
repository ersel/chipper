const acorn = require('acorn');
const injectJSX = require('acorn-jsx/inject');
const injectObjectSpread = require('acorn5-object-spread/inject');

injectJSX(acorn);
injectObjectSpread(acorn);

const config = {
	ranges: true,
	sourceType: 'module',
	plugins: {
		jsx: true,
		objectSpread: true
	}
};

const resolver = moduleContents => {
	const dependencies = [];
	const ast = acorn.parse(moduleContents, config);
	const nodes = ast.body;
	for (let j = 0; j < nodes.length; j += 1) {
		const node = nodes[j];
		if (node.type === 'ImportDeclaration') {
			const source = node.source.value;
			const imports = node.specifiers.map(n => {
				if (n.type === 'ImportSpecifier') {
					return {
						imported: n.imported.name,
						local: n.local.name
					};
				} else if (n.type === 'ImportNamespaceSpecifier') {
					return {
						imported: '*',
						local: n.local.name
					};
				} else if (n.type === 'ImportDefaultSpecifier') {
					return {
						imported: 'default',
						local: n.local.name
					};
				}
				return 'Unsupported Export';
			});
			dependencies.push({
				source,
				imports
			});
		}
	}

	return dependencies;
};

module.exports = resolver;
