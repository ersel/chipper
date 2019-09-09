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
		expect(deserializedGraph.doesPathExist('A', 'A').pathExists).toBe(
			false
		);
		expect(deserializedGraph.doesPathExist('A', 'D').pathExists).toBe(true);
		expect(deserializedGraph.doesPathExist('A', 'E').pathExists).toBe(true);
		expect(deserializedGraph.doesPathExist('A', 'F').pathExists).toBe(true);
		expect(deserializedGraph.doesPathExist('C', 'A').pathExists).toBe(
			false
		);
		expect(deserializedGraph.doesPathExist('C', 'E').pathExists).toBe(
			false
		);
		expect(deserializedGraph.doesPathExist('C', 'F').pathExists).toBe(true);
		expect(deserializedGraph.doesPathExist('D', 'C').pathExists).toBe(true);
		expect(deserializedGraph.doesPathExist('D', 'D').pathExists).toBe(
			false
		);
		expect(deserializedGraph.doesPathExist('D', 'E').pathExists).toBe(true);
		expect(deserializedGraph.doesPathExist('D', 'F').pathExists).toBe(true);
		expect(deserializedGraph.doesPathExist('E', 'A').pathExists).toBe(
			false
		);
		expect(deserializedGraph.doesPathExist('E', 'D').pathExists).toBe(
			false
		);
		expect(deserializedGraph.doesPathExist('E', 'E').pathExists).toBe(
			false
		);
		expect(deserializedGraph.doesPathExist('E', 'F').pathExists).toBe(true);
		expect(deserializedGraph.doesPathExist('F', 'A').pathExists).toBe(
			false
		);
		expect(deserializedGraph.doesPathExist('F', 'B').pathExists).toBe(
			false
		);
		expect(deserializedGraph.doesPathExist('F', 'F').pathExists).toBe(
			false
		);
	});

	it('should find paths', () => {
		expect(g.doesPathExist('A', 'A').pathExists).toBe(false);
		expect(g.doesPathExist('A', 'B').pathExists).toBe(true);
		expect(g.doesPathExist('A', 'C').pathExists).toBe(true);
		expect(g.doesPathExist('A', 'D').pathExists).toBe(true);
		expect(g.doesPathExist('A', 'E').pathExists).toBe(true);
		expect(g.doesPathExist('A', 'F').pathExists).toBe(true);

		expect(g.doesPathExist('B', 'A').pathExists).toBe(false);
		expect(g.doesPathExist('B', 'B').pathExists).toBe(false);
		expect(g.doesPathExist('B', 'C').pathExists).toBe(true);
		expect(g.doesPathExist('B', 'D').pathExists).toBe(false);
		expect(g.doesPathExist('B', 'E').pathExists).toBe(false);
		expect(g.doesPathExist('B', 'F').pathExists).toBe(true);

		expect(g.doesPathExist('C', 'A').pathExists).toBe(false);
		expect(g.doesPathExist('C', 'B').pathExists).toBe(false);
		expect(g.doesPathExist('C', 'C').pathExists).toBe(false);
		expect(g.doesPathExist('C', 'D').pathExists).toBe(false);
		expect(g.doesPathExist('C', 'E').pathExists).toBe(false);
		expect(g.doesPathExist('C', 'F').pathExists).toBe(true);

		expect(g.doesPathExist('D', 'A').pathExists).toBe(false);
		expect(g.doesPathExist('D', 'B').pathExists).toBe(false);
		expect(g.doesPathExist('D', 'C').pathExists).toBe(true);
		expect(g.doesPathExist('D', 'D').pathExists).toBe(false);
		expect(g.doesPathExist('D', 'E').pathExists).toBe(true);
		expect(g.doesPathExist('D', 'F').pathExists).toBe(true);

		expect(g.doesPathExist('E', 'A').pathExists).toBe(false);
		expect(g.doesPathExist('E', 'B').pathExists).toBe(false);
		expect(g.doesPathExist('E', 'C').pathExists).toBe(true);
		expect(g.doesPathExist('E', 'D').pathExists).toBe(false);
		expect(g.doesPathExist('E', 'E').pathExists).toBe(false);
		expect(g.doesPathExist('E', 'F').pathExists).toBe(true);

		expect(g.doesPathExist('F', 'A').pathExists).toBe(false);
		expect(g.doesPathExist('F', 'B').pathExists).toBe(false);
		expect(g.doesPathExist('F', 'C').pathExists).toBe(false);
		expect(g.doesPathExist('F', 'D').pathExists).toBe(false);
		expect(g.doesPathExist('F', 'E').pathExists).toBe(false);
		expect(g.doesPathExist('F', 'F').pathExists).toBe(false);
	});
});
