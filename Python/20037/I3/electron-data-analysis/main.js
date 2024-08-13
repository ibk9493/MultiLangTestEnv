const { app, BrowserWindow, ipcMain } = require('electron');
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
