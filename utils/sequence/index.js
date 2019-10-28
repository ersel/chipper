const sequence = (tasks, fn) =>
	tasks.reduce(
		(promise, task) => promise.then(() => fn(task)),
		Promise.resolve()
	);

module.exports = sequence;
