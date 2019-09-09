// Ziyovuddin Shamsiddini's Directed Graph Implementation
// taken from https://medium.com/@ziyoshams/graphs-in-javascript-cc0ed170b156
/* eslint-disable no-restricted-syntax */

class Graph {
	constructor() {
		this.AdjList = new Map();
	}

	addVertex(vertex) {
		if (!this.AdjList.has(vertex)) {
			this.AdjList.set(vertex, []);
		}
	}

	addEdge(vertex, node) {
		if (this.AdjList.has(vertex)) {
			if (this.AdjList.has(node)) {
				const arr = this.AdjList.get(vertex);
				if (!arr.includes(node)) {
					arr.push(node);
				} else {
					throw new Error(`Can't add '${node}', it already exists`);
				}
			} else {
				throw new Error(`Can't add non-existing vertex ->'${node}'`);
			}
		} else {
			throw new Error(`You should add '${vertex}' first`);
		}
	}

	serialize() {
		const result = {
			nodes: [],
			links: []
		};
		for (const [key, value] of this.AdjList) {
			result.nodes.push(key);
			value.forEach(edge => {
				result.links.push({ source: key, target: edge });
			});
		}
		return result;
	}

	deserialize(serializedGraph) {
		serializedGraph.nodes.forEach(n => {
			this.addVertex(n);
		});

		serializedGraph.links.forEach(e => {
			this.addEdge(e.source, e.target);
		});
	}

	createVisitedObject() {
		const arr = {};
		for (const key of this.AdjList.keys()) {
			arr[key] = false;
		}

		return arr;
	}

	doesPathExist(firstNode, secondNode) {
		const path = [];
		const visited = this.createVisitedObject();
		const q = [];
		visited[firstNode] = true;
		q.push(firstNode);
		while (q.length) {
			const node = q.pop();
			path.push(node);
			const elements = this.AdjList.get(node);
			if (elements.includes(secondNode)) {
				return true;
			}
			for (const elem of elements) {
				if (!visited[elem]) {
					visited[elem] = true;
					q.unshift(elem);
				}
			}
		}
		return false;
	}
}

module.exports = Graph;
