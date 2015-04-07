var table = document.getElementById("TheTable");
var totalRows = 1;
var currentRow = 0;
var currentColumn = 0;
function insertion() {
	var row = table.insertRow(totalRows);
	var cell = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	cell.innerHTML = totalRows;
	cell2.innerHTML = "AABB";
	cell3.innerHTML = "ACCEPT?";
	totalRows++;
	batista();
}

function removal() {
	table.deleteRow(totalRows-1);
	totalRows--;
}

function colortest() {
	table.rows.item(currentRow).cells.item(currentColumn).style.background="#ff0000";
	currentColumn++;
	if(currentColumn > 2) {
		currentColumn = 0;
		currentRow += 1;
	}
}