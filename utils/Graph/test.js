const Graph = require('.');

describe('DirectedGraph', () => {
	const SERIALIZED_GRAPH = {
		nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
		links: [
			{ source: 'A', target: 'B' },
			{ source: 'A', target: 'D' },
			{ source: 'A', target: 'E' },
			{ source: 'B', target: 'C' },
			{ source: 'C', target: 'F' },
			{ source: 'D', target: 'E' },
			{ source: 'E', target: 'F' },
			{ source: 'E', target: 'C' }
		]
	};

	const g = new Graph();
	const arr = ['A', 'B', 'C', 'D', 'E', 'F'];
	for (let i = 0; i < arr.length; i += 1) {
		g.addVertex(arr[i]);
	}

	g.addEdge('A', 'B');
	g.addEdge('A', 'D');
	g.addEdge('A', 'E');
	g.addEdge('B', 'C');
	g.addEdge('D', 'E');
	g.addEdge('E', 'F');
	g.addEdge('E', 'C');
	g.addEdge('C', 'F');

	it('should serialize', () => {
		expect(g.serialize()).toEqual(SERIALIZED_GRAPH);
	});

	it('should deserialize', () => {
		const deserializedGraph = new Graph();
		deserializedGraph.deserialize(SERIALIZED_GRAPH);

		// sanity check deserialized graph
		expect(deserializedGraph.doesPathExist('A', 'A')).toBe(false);
		expect(deserializedGraph.doesPathExist('A', 'D')).toBe(true);
		expect(deserializedGraph.doesPathExist('A', 'E')).toBe(true);
		expect(deserializedGraph.doesPathExist('A', 'F')).toBe(true);
		expect(deserializedGraph.doesPathExist('C', 'A')).toBe(false);
		expect(deserializedGraph.doesPathExist('C', 'E')).toBe(false);
		expect(deserializedGraph.doesPathExist('C', 'F')).toBe(true);
		expect(deserializedGraph.doesPathExist('D', 'C')).toBe(true);
		expect(deserializedGraph.doesPathExist('D', 'D')).toBe(false);
		expect(deserializedGraph.doesPathExist('D', 'E')).toBe(true);
		expect(deserializedGraph.doesPathExist('D', 'F')).toBe(true);
		expect(deserializedGraph.doesPathExist('E', 'A')).toBe(false);
		expect(deserializedGraph.doesPathExist('E', 'D')).toBe(false);
		expect(deserializedGraph.doesPathExist('E', 'E')).toBe(false);
		expect(deserializedGraph.doesPathExist('E', 'F')).toBe(true);
		expect(deserializedGraph.doesPathExist('F', 'A')).toBe(false);
		expect(deserializedGraph.doesPathExist('F', 'B')).toBe(false);
		expect(deserializedGraph.doesPathExist('F', 'F')).toBe(false);
	});

	it('should find paths', () => {
		expect(g.doesPathExist('A', 'A')).toBe(false);
		expect(g.doesPathExist('A', 'B')).toBe(true);
		expect(g.doesPathExist('A', 'C')).toBe(true);
		expect(g.doesPathExist('A', 'D')).toBe(true);
		expect(g.doesPathExist('A', 'E')).toBe(true);
		expect(g.doesPathExist('A', 'F')).toBe(true);

		expect(g.doesPathExist('B', 'A')).toBe(false);
		expect(g.doesPathExist('B', 'B')).toBe(false);
		expect(g.doesPathExist('B', 'C')).toBe(true);
		expect(g.doesPathExist('B', 'D')).toBe(false);
		expect(g.doesPathExist('B', 'E')).toBe(false);
		expect(g.doesPathExist('B', 'F')).toBe(true);

		expect(g.doesPathExist('C', 'A')).toBe(false);
		expect(g.doesPathExist('C', 'B')).toBe(false);
		expect(g.doesPathExist('C', 'C')).toBe(false);
		expect(g.doesPathExist('C', 'D')).toBe(false);
		expect(g.doesPathExist('C', 'E')).toBe(false);
		expect(g.doesPathExist('C', 'F')).toBe(true);

		expect(g.doesPathExist('D', 'A')).toBe(false);
		expect(g.doesPathExist('D', 'B')).toBe(false);
		expect(g.doesPathExist('D', 'C')).toBe(true);
		expect(g.doesPathExist('D', 'D')).toBe(false);
		expect(g.doesPathExist('D', 'E')).toBe(true);
		expect(g.doesPathExist('D', 'F')).toBe(true);

		expect(g.doesPathExist('E', 'A')).toBe(false);
		expect(g.doesPathExist('E', 'B')).toBe(false);
		expect(g.doesPathExist('E', 'C')).toBe(true);
		expect(g.doesPathExist('E', 'D')).toBe(false);
		expect(g.doesPathExist('E', 'E')).toBe(false);
		expect(g.doesPathExist('E', 'F')).toBe(true);

		expect(g.doesPathExist('F', 'A')).toBe(false);
		expect(g.doesPathExist('F', 'B')).toBe(false);
		expect(g.doesPathExist('F', 'C')).toBe(false);
		expect(g.doesPathExist('F', 'D')).toBe(false);
		expect(g.doesPathExist('F', 'E')).toBe(false);
		expect(g.doesPathExist('F', 'F')).toBe(false);
	});
});
