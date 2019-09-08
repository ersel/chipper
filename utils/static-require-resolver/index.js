const acorn = require('acorn');
const injectJSX = require('acorn-jsx/inject');
const injectObjectSpread = require('acorn5-object-spread/inject');
const checkStaticRequireWithMemberExpressionsRecursively = require('./checkMemberImports');

injectJSX(acorn);
injectObjectSpread(acorn);

const checkIfDefaultRequire = node =>
	node &&
	node.declarations &&
	node.declarations[0] &&
	node.declarations[0].type === 'VariableDeclarator' &&
	node.declarations[0].init &&
	node.declarations[0].init.type === 'CallExpression' &&
	node.declarations[0].init.callee &&
	node.declarations[0].init.callee.name &&
	node.declarations[0].init.callee.name === 'require' &&
	node.declarations[0].init.arguments &&
	node.declarations[0].init.arguments[0] &&
	node.declarations[0].init.arguments[0].type === 'Literal';

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
		//

		console.log(
			checkStaticRequireWithMemberExpressionsRecursively(
				node.declarations[0].init
			),
			'what'
		);
		if (checkIfDefaultRequire(node)) {
			const source = node.declarations[0].init.arguments[0].value;

			console.log('is default require');
			/*
            dependencies.push({
                source: '',
                imports: []
            });
            */
		}
		/*
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
            */
	}

	return dependencies;
};

module.exports = resolver;
