const {
	namedImport1,
	namedImport2: localImport,
	...rest
} = require('./subdirectory/grandchild');
const grandChildNamespaceImport = require('./subdirectory/typedgrandchild');
