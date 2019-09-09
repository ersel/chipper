const Graph = require('../../utils/Graph');

const constructGraph = scanData => {
	const graph = new Graph();
	scanData.forEach(file => {
		const node = file.sourceFile;
		graph.addVertex(node);
		file.importedModules.forEach(m => {
			graph.addVertex(m.absolute);
			graph.addEdge(node, m.absolute);
		});
	});
	return graph;
};

module.exports = constructGraph;
