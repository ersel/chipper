const ramda = require('ramda');
const path = require('path');
const { exec } = require('child_process');

const parseAliases = (aliases, rootPath) =>
	ramda.flatten([aliases]).reduce((acc, alias) => {
		const [k, v] = alias.split(':');
		if (k && v) {
			const absolutePath = path.resolve(rootPath, v);
			acc[k] = absolutePath;
		} else {
			throw new Error(
				`Could not parse ${alias}. Aliases should be key-value pairs in the form my-alias:/path/to/my-alias/`
			);
		}
		return acc;
	}, {});

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

const createHTMLTable = results => {
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
	results.shift().forEach(column => {
		result += `<th>${column}</th>`;
	});
	result += `</tr></thead>`;
	results.forEach(row => {
		result += '<tr>';
		row.forEach(column => {
			result += `<td>${column}</td>`;
		});
		result += '</tr>';
	});
	result += '</table></html>';
	return result;
};

module.exports = {
	parseAliases,
	createHTMLTable,
	openFile
};
