const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { Worker } = require('worker_threads');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('process-csv', (event, csvPath) => {
  const worker = new Worker(path.join(__dirname, 'csvProcessingWorker.js'), {
    workerData: { csvPath, chunkSize: 1000 }
  });
  worker.on('message', (chunk) => {
    event.reply('csv-chunk-processed', chunk);
  });
  worker.on('error', (error) => {
    event.reply('csv-error', `Error processing CSV file: ${error.message}`);
  });
});

ipcMain.on('export-csv', (event, data) => {
  dialog.showSaveDialog({
    title: 'Save CSV',
    defaultPath: path.join(app.getPath('documents'), 'exported_data.csv'),
    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
  }).then(result => {
    if (!result.canceled) {
      event.reply('save-dialog', result.filePath);
    }
  }).catch(err => {
    console.log(err);
  });
});
ipcMain.on('save-csv', (event, filePath) => {
  const data = event.sender.sendSync('get-data-for-export'); // Sync call to get data from renderer
  if (!data) return;

  const csvContent = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  ).join('\n');

  fs.writeFile(filePath, csvContent, (err) => {
    if (err) {
      event.reply('csv-exported', err.message);
    } else {
      event.reply('csv-exported', null);
    }
  });
});