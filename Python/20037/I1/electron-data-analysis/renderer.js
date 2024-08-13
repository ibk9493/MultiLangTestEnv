const { ipcRenderer } = require('electron');

let data = [];

document.getElementById('loadButton').addEventListener('click', () => {
  const file = document.getElementById('csvFile').files[0];
  if (file) {
    ipcRenderer.send('process-csv', file.path);
  }
});

ipcRenderer.on('csv-processed', (event, records) => {
  data = records;
  displayData(data);
});

ipcRenderer.on('csv-error', (event, errorMessage) => {
  displayError(errorMessage);
});

document.getElementById('filterButton').addEventListener('click', () => {
  const filterValue = document.getElementById('filterInput').value.toLowerCase();
  const filteredData = data.filter(row => 
    Object.values(row).some(value => 
      value.toLowerCase().includes(filterValue)
    )
  );
  displayData(filteredData);
});

document.getElementById('sortButton').addEventListener('click', () => {
  const sortedData = [...data].sort((a, b) => 
    a[Object.keys(a)[0]].localeCompare(b[Object.keys(b)[0]])
  );
  displayData(sortedData);
});

document.getElementById('summarizeButton').addEventListener('click', () => {
  const summary = {
    rowCount: data.length,
    columnCount: Object.keys(data[0]).length,
    columns: Object.keys(data[0]),
  };
  displaySummary(summary);
});

function displayData(dataToDisplay) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  
  const table = document.createElement('table');
  const headers = Object.keys(dataToDisplay[0]);
  
  const headerRow = table.insertRow();
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  
  dataToDisplay.forEach(row => {
    const tr = table.insertRow();
    headers.forEach(header => {
      const td = tr.insertCell();
      td.textContent = row[header];
    });
  });
  
  resultsDiv.appendChild(table);
}

function displaySummary(summary) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
    <h2>Data Summary</h2>
    <p>Number of rows: ${summary.rowCount}</p>
    <p>Number of columns: ${summary.columnCount}</p>
    <p>Columns: ${summary.columns.join(', ')}</p>
  `;
}

function displayError(errorMessage) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
}
