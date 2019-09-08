const acorn = require('acorn');
const injectJSX = require('acorn-jsx/inject');
const injectObjectSpread = require('acorn5-object-spread/inject');
const checkStaticRequireWithMemberExpressionsRecursively = require('./checkMemberImports');
const parseIdentifiers = require('./parseIdentifiers');

injectJSX(acorn);
injectObjectSpread(acorn);

const checkifVariableDeclaratorWithFunctionCall = node =>
	node &&
	node.declarations &&
	node.declarations[0] &&
	node.declarations[0].type === 'VariableDeclarator' &&
	node.declarations[0].init &&
	node.declarations[0].init.type === 'CallExpression';

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
		let memberImport;
		let source;

		if (checkifVariableDeclaratorWithFunctionCall(node)) {
			if (checkIfDefaultRequire(node)) {
				source = {
					source: node.declarations[0].init.arguments[0].value,
					path: ''
				};
			} else {
				memberImport = checkStaticRequireWithMemberExpressionsRecursively(
					node.declarations[0].init
				);
				if (memberImport !== 'n/a') {
					// todo: prepend . to path if it doesnt start with(
					source = memberImport;
				}
			}
		}

		if (source) {
			const imports = parseIdentifiers(node.declarations[0].id);
			dependencies.push({ ...source, imports, type: 'commonjs' });
		}
	}

	return dependencies;
};

module.exports = resolver;
