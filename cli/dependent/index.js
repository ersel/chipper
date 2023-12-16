const scanner = require('../../lib/scanner/cache/graphCache');
const parseAliases = require('../utils/parseAliases/');
const Graph = require('../../utils/Graph');
const path = require('path');
const printTree = require('../../utils/print-tree');
const disableConsole = require('../../utils/disableConsole');

const makeTree = pathsArray => {
	const tree = { name: pathsArray[0], children: [] };
	let ptr = tree;
	pathsArray.splice(1).forEach(el => {
		const child = { name: el, children: [] };
		ptr.children.push(child);
		ptr = child;
	});

	return tree;
};

const dependentAction = (args, opts) => {
	const { source, target } = args;
	const aliases = opts.alias
		? parseAliases(opts.alias, opts.projectRoot)
		: {};
	disableConsole(opts.silenceConsole);

	return scanner(
		{
			targetDirectory: opts.targetDir,
			projectRootPath: opts.projectRoot,
			includedPatterns: opts.incl,
			excludedPatterns: opts.excl,
			extensions: opts.ext,
			fileScanParallelism: opts.fileScanParallelism,
			aliases
		},
		opts.rescan
	).then(scanData => {
		let searchTarget = target;
		let searchSource = source;

		// CHECK IF SCAN SOURCE IS AN ALIAS
		const aliasesArr = Object.keys(aliases);
		const sourceAliasKey = aliasesArr.find(a => source.startsWith(a));
		if (sourceAliasKey) {
			searchSource = source.replace(
				sourceAliasKey,
				aliases[sourceAliasKey]
			);
			console.log(
				`Detected ${source} as an alias. Scanning for all imports from ${searchSource}`
			);
		}

		// CHECK IF SCAN TARGET IS AN ALIAS
		const targetAliasKey = aliasesArr.find(a => target.startsWith(a));
		if (targetAliasKey) {
			searchTarget = target.replace(
				targetAliasKey,
				aliases[targetAliasKey]
			);
			console.log(
				`Detected ${target} as an alias. Scanning for all imports from ${searchTarget}`
			);
		}

		const graph = new Graph();
		graph.deserialize(scanData);
		const allNodes = graph.nodes();

		let searchNode = allNodes.find(n => n === searchSource);
		if (!searchNode) {
			if (!path.isAbsolute(source)) {
				searchSource = path.resolve(opts.projectRoot, source);
			}
		}

		searchNode = allNodes.find(n => n === searchSource);
		if (!searchNode) {
			console.log(
				`Could not resolve the source module. Review your source argument: ${source}`
			);
			return null;
		}

		let targetNode = allNodes.find(n => n === searchTarget);
		if (!targetNode) {
			if (!path.isAbsolute(target)) {
				searchTarget = path.resolve(opts.projectRoot, target);
			}
		}

		targetNode = allNodes.find(n => n === searchTarget);
		if (!targetNode) {
			console.log(
				`Could not resolve the target module. Review your target argument: ${target}`
			);
			return null;
		}

		const results = graph.doesPathExist(searchNode, targetNode);

		if (opts.outputFormat === 'json') {
			// output JSON to stdout
			console.log(JSON.stringify(results, null, 2));

			return results;
		}

		if (results && results.pathExists) {
			const tree = makeTree([...results.path]);
			printTree(
				tree,
				(node, branch) => {
					console.log(branch, node.name);
				},
				node => node.children
			);
		}

		return results;
	});
};

module.exports = dependentAction;
