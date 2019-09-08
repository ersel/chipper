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
	},
	ecmaVersion: 8
};

const resolver = (moduleContents, fileName) => {
	const dependencies = [];
	let ast = {};
	try {
		ast = acorn.parse(moduleContents, config);
	} catch (e) {
		console.error(
			`Could not parse ${fileName} \nYou might need to use a custom acorn configuration.`
		);
		console.error(e);
		ast.body = [];
	}
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
				imports,
				type: 'es6'
			});
		}
	}

	return dependencies;
};

module.exports = resolver;
