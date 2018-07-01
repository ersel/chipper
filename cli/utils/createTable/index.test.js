const createHTMLTable = require('./');

describe('HTML Table', () => {
	it('should generate HTML table from array of arrays', () => {
		const myTable = [
			['A', 'B', 'C'],
			['data1', 'data2', 'data3'],
			['data4', 'data5', 'data6']
		];

		expect(createHTMLTable(myTable)).toMatchSnapshot();
	});
});
