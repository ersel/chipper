const utils = require('./');
const childProcess = require('child_process');

jest.mock('child_process', () => ({ exec: jest.fn() }));

describe('Open Report File', () => {
	it('should exec correct open file command depending on OS', () => {
		const originalPlatform = Object.getOwnPropertyDescriptor(
			process,
			'platform'
		);

		// DARWIN
		Object.defineProperty(global.process, 'platform', {
			value: 'darwin'
		});
		utils.openFile('./someReport.html');
		expect(childProcess.exec).lastCalledWith('open ./someReport.html');

		// WIN32
		Object.defineProperty(global.process, 'platform', {
			value: 'win32'
		});
		utils.openFile('./someReport.html');
		expect(childProcess.exec).lastCalledWith('start ./someReport.html');

		// WIN64
		Object.defineProperty(global.process, 'platform', {
			value: 'win64'
		});
		utils.openFile('./someReport.html');
		expect(childProcess.exec).lastCalledWith('start ./someReport.html');

		// UBUNTU
		Object.defineProperty(global.process, 'platform', {
			value: 'ubuntu'
		});
		utils.openFile('./someReport.html');
		expect(childProcess.exec).lastCalledWith('xdg-open ./someReport.html');

		// restore to original platform
		Object.defineProperty(global.process, 'platform', {
			value: originalPlatform
		});
	});
});
