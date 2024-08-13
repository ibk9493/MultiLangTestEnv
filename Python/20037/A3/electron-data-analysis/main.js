const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
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

// Handle CSV processing in the main process
ipcMain.on('process-csv', async (event, csvPath) => {
  try {
    const worker = new Worker('./csvProcessingWorker.js');
    worker.postMessage({ csvPath, chunkSize: 1000 });
    worker.on('message', (chunk) => {
      event.reply('csv-chunk-processed', chunk);
    });
    worker.on('error', (error) => {
      event.reply('csv-error', `Error processing CSV file: ${error.message}`);
    });
  } catch (error) {
    event.reply('csv-error', `Error processing CSV file: ${error.message}`);
  }
});
