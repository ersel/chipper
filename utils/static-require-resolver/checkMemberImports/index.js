const checkStaticRequireWithMemberExpressionsRecursively = node => {
	if (
		node &&
		node.type === 'MemberExpression' &&
		node.property &&
		node.property.type === 'Identifier' &&
		node.object &&
		node.object.type !== 'CallExpression'
	) {
		// keep diving until you can find a call expression
		const required = {
			path: node.property.name
		};
		const results = checkStaticRequireWithMemberExpressionsRecursively(
			node.object
		);

		if (results !== 'n/a') {
			return {
				path: `${results.path}.${required.path}`,
				source: results.source
			};
		}
		return results;
	}

	if (
		node &&
		node.type === 'MemberExpression' &&
		node.property &&
		node.property.type === 'Identifier' &&
		node.object &&
		node.object.type === 'CallExpression' &&
		node.object.callee &&
		node.object.callee.name &&
		node.object.callee.name === 'require' &&
		node.object.arguments &&
		node.object.arguments[0] &&
		node.object.arguments[0].type === 'Literal'
	) {
		return {
			path: node.property.name,
			source: node.object.arguments[0].value
		};
	}

	if (
		node &&
		node.type === 'MemberExpression' &&
		node.property &&
		node.property.type === 'Identifier' &&
		node.object &&
		node.object.type === 'CallExpression' &&
		node.object.callee &&
		node.object.callee.type &&
		node.object.callee.type === 'MemberExpression'
	) {
		// keep diving until you can find a call expression
		const required = {
			path: node.property.name
		};
		const results = checkStaticRequireWithMemberExpressionsRecursively(
			node.object
		);

		if (results !== 'n/a') {
			return {
				path: `${results.path}.${required.path}`,
				source: results.source
			};
		}
		return results;
	}

	if (
		node &&
		node.type === 'CallExpression' &&
		node.callee &&
		node.callee.type &&
		node.callee.type === 'MemberExpression'
	) {
		// keep diving until you can find a call expression
		const required = {
			path: '()'
		};
		const results = checkStaticRequireWithMemberExpressionsRecursively(
			node.callee
		);

		if (results !== 'n/a') {
			return {
				path: `${results.path}${required.path}`,
				source: results.source
			};
		}
		return results;
	}

	if (
		node &&
		node.type === 'MemberExpression' &&
		node.object &&
		node.object.type &&
		node.object.type === 'CallExpression' &&
		node.property &&
		node.property.type &&
		node.property.type === 'Identifier'
	) {
		// keep diving until you can find a call expression
		const required = {
			path: node.property.name
		};
		const results = checkStaticRequireWithMemberExpressionsRecursively(
			node.object
		);

		if (results !== 'n/a') {
			return {
				path: `${results.path}.${required.path}`,
				source: results.source
			};
		}

		return results;
	}

	if (
		node &&
		node.type === 'CallExpression' &&
		node.callee &&
		node.callee.type &&
		node.callee.type === 'CallExpression'
	) {
		// keep diving until you can find a call expression
		const required = {
			path: `()`
		};
		const results = checkStaticRequireWithMemberExpressionsRecursively(
			node.callee
		);

		if (results !== 'n/a') {
			return {
				path: `${results.path}${required.path}`,
				source: results.source
			};
		}

		return results;
	}

	if (
		node &&
		node.type === 'CallExpression' &&
		node.callee &&
		node.callee.type &&
		node.callee.type === 'Identifier' &&
		node.callee.name === 'require'
	) {
		return {
			path: '',
			source: node.arguments[0].value || '***dynamic***'
		};
	}

	return 'n/a';
};

/*
    when I wrote this only God and I understood how it worked,
    now only God knows...
*/
module.exports = checkStaticRequireWithMemberExpressionsRecursively;
