const scanner = require('../../lib/scanner/cache/graphCache');
const parseAliases = require('../utils/parseAliases/');
const Graph = require('../../utils/Graph');
const path = require('path');

const dependentAction = (args, opts) => {
	const { source, target } = args;
	const aliases = opts.alias
		? parseAliases(opts.alias, opts.projectRoot)
		: {};

	return scanner(
		{
			targetDirectory: opts.targetDir,
			projectRootPath: opts.projectRoot,
			includedPatterns: opts.incl,
			excludedPatterns: opts.excl,
			extensions: opts.ext,
			aliases
		},
		opts.rescan
	).then(scanData => {
		let searchTarget;
		let searchSource;

		// CHECK IF SCAN SOURCE IS AN ALIAS
		const aliasesArr = Object.keys(aliases);
		const sourceAliasKey = aliasesArr.find(a => source.startsWith(a));
		if (sourceAliasKey) {
			searchSource = target.replace(
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

		console.log(graph.shortestPath(searchNode, targetNode));

		// check if node and edge are both found
		// if yes, run the shortest path algorithm

		// return true, false or null
	});
};

module.exports = dependentAction;
