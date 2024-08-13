const { ipcRenderer } = require('electron');
const Chart = require('chart.js/auto');

let data = [];
let chart;

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
  if (chart) {
    chart.destroy();
  }
  document.getElementById('chart').getContext('2d').clearRect(0, 0, chart.width, chart.height);
  
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
document.getElementById('visualizeButton').addEventListener('click', () => {
  if (data.length > 0) {
    createChart();
  } else {
    displayError('No data to visualize. Please load a CSV file first.');
  }
});

function createChart() {
  const ctx = document.getElementById('chart').getContext('2d');
  
  if (chart) {
    chart.destroy();
  }
  
  const columns = Object.keys(data[0]);
  
  // Create column selection dropdowns
  const xAxisSelect = createColumnSelect('x-axis', columns);
  const yAxisSelect = createColumnSelect('y-axis', columns);
  
  document.getElementById('controls').appendChild(xAxisSelect);
  document.getElementById('controls').appendChild(yAxisSelect);
  
  // Update chart when selections change
  xAxisSelect.addEventListener('change', updateChart);
  yAxisSelect.addEventListener('change', updateChart);
  
  updateChart();
}

function createColumnSelect(id, options) {
  const select = document.createElement('select');
  select.id = id;
  options.forEach((option, index) => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    if (id === 'x-axis' && index === 0) optionElement.selected = true;
    if (id === 'y-axis' && index === 1) optionElement.selected = true;
    select.appendChild(optionElement);
  });
  return select;
}

function updateChart() {
  const xAxis = document.getElementById('x-axis').value;
  const yAxis = document.getElementById('y-axis').value;
  
  const labels = data.map(row => row[xAxis]);
  const values = data.map(row => parseFloat(row[yAxis]));
  
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: yAxis,
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
