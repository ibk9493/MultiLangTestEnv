const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads');
const { stringify } = require('csv-stringify/sync');

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
// Add this new IPC handler
ipcMain.on('export-csv', async (event, data) => {
  try {
      const { filePath } = await dialog.showSaveDialog({
          buttonLabel: 'Save CSV',
          defaultPath: path.join(app.getPath('documents'), 'exported_data.csv'),
          filters: [
              { name: 'CSV Files', extensions: ['csv'] }
          ]
      });

      if (filePath) {
          const csvContent = stringify(data, { header: true });
          fs.writeFileSync(filePath, csvContent, 'utf-8');
          event.reply('export-csv-response', { success: true, filePath });
      } else {
          event.reply('export-csv-response', { success: false, error: 'Export cancelled' });
      }
  } catch (error) {
      event.reply('export-csv-response', { success: false, error: error.message });
  }
});