/* eslint-disable no-global-assign */
const disableConsole = shouldDisable => {
	if (shouldDisable) {
		console = {
			log: () => null,
			error: () => null,
			warn: () => null,
			info: () => null
		};
	}
};

module.exports = disableConsole;
