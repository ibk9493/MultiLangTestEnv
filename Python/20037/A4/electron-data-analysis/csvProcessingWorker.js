const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const { parse } = require('csv-parse');

const { csvPath, chunkSize } = workerData;

const results = [];
fs.createReadStream(csvPath)
  .pipe(parse({ columns: true, skip_empty_lines: true, relax_column_count: true }))
  .on('data', (row) => {
    results.push(row);
    if (results.length >= chunkSize) {
      parentPort.postMessage(results.splice(0, results.length));
    }
  })
  .on('end', () => {
    if (results.length > 0) {
      parentPort.postMessage(results);
    }
  })
  .on('error', (error) => {
    parentPort.postMessage({ error: `Error processing CSV file: ${error.message}` });
  });
