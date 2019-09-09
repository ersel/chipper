const printTree = require('./');

function validateTree(expect, tree, output) {
	const consoleLog = jest.fn();

	printTree(
		tree,
		(node, branch) => {
			consoleLog(node.name, branch);
		},
		node => node.children
	);

	output.forEach((branch, index) => {
		if (branch.length === 1) {
			expect(consoleLog.mock.calls[index][0]).toBe(branch[0]);
		} else {
			expect(consoleLog.mock.calls[index][0]).toBe(branch[1]);
			expect(consoleLog.mock.calls[index][1]).toBe(branch[0]);
		}
	});
}

it('should print a simple tree', () => {
	const mockTree = {
		name: 'head',
		children: [
			{
				name: 'branchA',
				children: [{ name: 'branchC' }]
			},
			{ name: 'branchB' }
		]
	};
	const output = [
		['head'],
		['├─┬ ', 'branchA'],
		['│ └── ', 'branchC'],
		['└── ', 'branchB']
	];
	validateTree(expect, mockTree, output);
});

it('prints the children of last branches correctly', () => {
	const mockTree = {
		name: 'head',
		children: [
			{ name: 'branchA' },
			{
				name: 'branchB',
				children: [{ name: 'branchC' }]
			}
		]
	};
	const output = [
		['head'],
		['├── ', 'branchA'],
		['└─┬ ', 'branchB'],
		['  └── ', 'branchC']
	];
	validateTree(expect, mockTree, output);
});
