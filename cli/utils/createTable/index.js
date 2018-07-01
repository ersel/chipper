const tableStyle = `
	table.blueTable {
		border: 1px solid #1C6EA4;
		background-color: #EEEEEE;
		width: 100%;
		text-align: left;
		border-collapse: collapse;
	  }
	  table.blueTable td, table.blueTable th {
		border: 1px solid #AAAAAA;
		padding: 3px 2px;
	  }
	  table.blueTable tbody td {
		font-size: 18px;
	  }
	  table.blueTable tr:nth-child(even) {
		background: #D0E4F5;
	  }
	  table.blueTable thead {
		background: #1C6EA4;
		background: -moz-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
		background: -webkit-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
		background: linear-gradient(to bottom, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
		border-bottom: 2px solid #444444;
	  }
	  table.blueTable thead th {
		font-size: 15px;
		font-weight: bold;
		color: #FFFFFF;
		border-left: 2px solid #D0E4F5;
	  }
	  table.blueTable thead th:first-child {
		border-left: none;
	  }
	`;

const createHTMLTable = (results, projectRoot) => {
	const table = [['Source Module', 'Imported Module', 'Imported Symbols']];
	results.forEach(({ importedModules, sourceFile }) => {
		importedModules.forEach(({ imports, absolute }) => {
			const symbols = imports
				.map(({ imported, local }) => {
					if (imported !== local) {
						return `${imported} as ${local}`;
					}
					return imported;
				})
				.join(', ');
			const row = [
				sourceFile.replace(projectRoot, ''),
				absolute.replace(projectRoot, ''),
				symbols
			];
			table.push(row);
		});
	});

	let result = `
	<html>
	<head>
	<title>Chipper Scan Results</title>
	<style>
	${tableStyle}
	</style>
	</head>
	<table class="blueTable">
	<thead>
	<tr>
	`;
	table.shift().forEach(column => {
		result += `<th>${column}</th>`;
	});
	result += `</tr></thead>`;
	table.forEach(row => {
		result += '<tr>';
		row.forEach(column => {
			result += `<td>${column}</td>`;
		});
		result += '</tr>';
	});
	result += '</table></html>';
	return result;
};

module.exports = createHTMLTable;
