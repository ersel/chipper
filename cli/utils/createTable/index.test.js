const createHTMLTable = require('./');

describe('HTML Table', () => {
	it('should generate HTML table from array of arrays', () => {
		const sampleResult = [
			{
				sourceFile: '/Users/erselaker/chipper/src/loginService.js',
				importedModules: [
					{
						source: './utils/cookiesService',
						absolute:
							'/Users/erselaker/chipper/src/utils/cookiesService.js',
						imports: [{ imported: 'setCookie', local: 'setCookie' }]
					}
				]
			}
		];

		expect(createHTMLTable(sampleResult)).toMatchSnapshot();
	});
});
