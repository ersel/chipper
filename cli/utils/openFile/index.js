const { exec } = require('child_process');

const openFile = filePath => {
	function getCommandLine() {
		switch (process.platform) {
			case 'darwin':
				return 'open';
			case 'win32':
				return 'start';
			case 'win64':
				return 'start';
			default:
				return 'xdg-open';
		}
	}
	exec(`${getCommandLine()} ${filePath}`);
};

module.exports = openFile;
