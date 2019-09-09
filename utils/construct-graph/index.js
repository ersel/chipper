const Graph = require('graph-data-structure');

const constuctGraph = scanData => {
	const graph = Graph();
	scanData.forEach(file => {
		const node = file.sourceFile;
		graph.addNode(node);
		file.importedModules.forEach(m => {
			graph.addEdge(node, m.absolute);
		});
	});
	return graph;
};

module.exports = constuctGraph;
