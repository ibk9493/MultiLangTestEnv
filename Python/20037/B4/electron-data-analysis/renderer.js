const { ipcRenderer } = require('electron');
const path = require('path'); // Node.js path module

let allData = [];
let currentPage = 1;
const rowsPerPage = 100;
const maxPageButtons = 10;
let  pageData=[]

let currentDisplayedData = [];

// Add event listener for the export button
document.getElementById('exportButton').addEventListener('click', () => {
  if (currentDisplayedData.length > 0) {
      ipcRenderer.send('export-csv', currentDisplayedData);
  } else {
      alert('No data to export');
  }
});

// Listen for the response from the main process
ipcRenderer.on('export-csv-response', (event, response) => {
  if (response.success) {
      alert(`Data exported successfully to ${response.filePath}`);
  } else {
      alert(`Error exporting data: ${response.error}`);
  }
});


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
  }
});

ipcRenderer.on('csv-processed', (event, records) => {
  let data = records;
  displayData(data);
});

ipcRenderer.on('csv-error', (event, errorMessage) => {
  displayError(errorMessage);
});

document.getElementById('filterButton').addEventListener('click', () => {
  const filterValue = document.getElementById('filterInput').value.toLowerCase();
  const filteredData = pageData.filter(row => 
    Object.values(row).some(value => 
      value.toLowerCase().includes(filterValue)
    )
  );
  displayData(filteredData);
});

document.getElementById('sortButton').addEventListener('click', () => {
  const sortedData = [...pageData].sort((a, b) => 
    a[Object.keys(a)[0]].localeCompare(b[Object.keys(b)[0]])
  );
  displayData(sortedData);
});

document.getElementById('summarizeButton').addEventListener('click', () => {
  const summary = {
    rowCount: data.length,
    columnCount: Object.keys(pageData[0]).length,
    columns: Object.keys(pageData[0]),
  };
  displaySummary(summary);
});

function displayData(data) {
  currentDisplayedData  = data;
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  pageData = data.slice(start, end);
  
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  
  const table = document.createElement('table');
  const headers = Object.keys(pageData[0]);
  
  const headerRow = table.insertRow();
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  
  pageData.forEach(row => {
    const tr = table.insertRow();
    headers.forEach(header => {
      const td = tr.insertCell();
      td.textContent = row[header];
    });
  });
  
  resultsDiv.appendChild(table);
  addPaginationControls(data.length);
  createChart(pageData);
}

function createChart(data) {
  const ctx = document.getElementById('dataChart').getContext('2d');
  
  const labels = data.map(row => row[Object.keys(row)[0]]);
  const chartData = data.map(row => row[Object.keys(row)[1]]);

  if (window.myChart instanceof Chart) {
      window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
      type: 'bar',
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
  let paginationDiv = document.getElementById('pagination');

  if (paginationDiv) {
    paginationDiv.innerHTML = '';
  } else {
    paginationDiv = document.createElement('div');
    paginationDiv.id = 'pagination';
    document.body.appendChild(paginationDiv);
  }

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayData(allData);
    }
  });
  paginationDiv.appendChild(prevButton);

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.className = i === currentPage ? 'active' : '';
    button.addEventListener('click', () => {
      currentPage = i;
      displayData(allData);
    });
    paginationDiv.appendChild(button);
  }

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayData(allData);
    }
  });
  paginationDiv.appendChild(nextButton);
}
