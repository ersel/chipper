const ramda = require('ramda');
const path = require('path');

const parseAliases = (aliases, rootPath) =>
	ramda.flatten([aliases]).reduce((acc, alias) => {
		const [k, v] = alias.split(':');
		if (k && v) {
			const absolutePath = path.resolve(rootPath, v);
			acc[k] = absolutePath;
		} else {
			throw new Error(
				`Could not parse ${alias}. Aliases should be key-value pairs in the form my-alias:/path/to/my-alias/`
			);
		}
		return acc;
	}, {});

module.exports = parseAliases;
