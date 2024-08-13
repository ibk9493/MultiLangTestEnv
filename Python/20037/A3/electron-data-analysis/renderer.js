const { ipcRenderer } = require('electron');

let data = [];
let allData = [];
let currentPage = 1;
const rowsPerPage = 100;

document.getElementById('loadButton').addEventListener('click', () => {
  const file = document.getElementById('csvFile').files[0];
  if (file) {
    ipcRenderer.send('process-csv', file.path);
  }
});

ipcRenderer.on('csv-chunk-processed', (event, chunk) => {
  allData = allData.concat(chunk);
  if (currentPage === 1) {
    displayData(allData);
    createChart(sampleData(allData, 100));
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
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = data.slice(start, end);

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
  addPaginationControls(data.length);
  createChart(dataToDisplay)
}

function createChart(data) {
  const ctx = document.getElementById('dataChart').getContext('2d');
  
  // Assuming the first column is a label and the second is a value for simplicity
  const labels = data.map(row => row[Object.keys(row)[0]]);
  const chartData = data.map(row => row[Object.keys(row)[1]]);

  // Destroy previous chart if exists, to avoid memory leaks
  if (window.myChart instanceof Chart) {
      window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
      type: 'bar', // You can change this to 'line', 'pie', etc.
      data: {
          labels: labels,
          datasets: [{
              label: 'Data Analysis',
              data: chartData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
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

function addPaginationControls(totalRows) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  // Add buttons or controls to navigate pages
  // Update currentPage and call displayData when page changes
}
function sampleData(data, sampleSize) {
  const step = Math.floor(data.length / sampleSize);
  return data.filter((_, index) => index % step === 0);
}