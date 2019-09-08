const UNSUPPORTED_ID = { imported: 'unsupported', local: 'unsupported' };

const parseIdentifiers = node => {
	if (node && node.type === 'Identifier') {
		return [
			{
				imported: '*',
				local: node.name
			}
		];
	}

	if (node && node.type === 'ObjectPattern') {
		return node.properties.map(p => {
			if (p.type === 'Property') {
				return {
					imported: p.key.name,
					local: p.value.name
				};
			}
			if (p.type === 'RestElement') {
				return {
					imported: '...',
					local: p.argument.name
				};
			}
			return UNSUPPORTED_ID;
		});
	}

	return [UNSUPPORTED_ID];
};

module.exports = parseIdentifiers;
