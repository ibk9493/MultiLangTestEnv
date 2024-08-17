const fs = require('fs');
const path = require('path');

function extractTODOs(directory, filePattern = /\.js$/) {
    const todos = [];

    // Function to read files recursively
    function readFiles(dir) {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
            let fullPath = path.join(dir, dirent.name);
            if (dirent.isDirectory()) {
                readFiles(fullPath); // Recursively read sub-directories
            } else if (filePattern.test(dirent.name)) {
                const fileContent = fs.readFileSync(fullPath, 'utf8');
                const lines = fileContent.split('\n');
                lines.forEach((line, lineNumber) => {
                    if (line.includes('// TODO:')) {
                        const todoMatch = line.match(/\/\/ TODO: (.+?) - (.+?) - (Low|Medium|High)/);
                        if (todoMatch) {
                            todos.push({
                                file: fullPath,
                                line: lineNumber + 1,
                                description: todoMatch[1].trim(),
                                assignedTo: todoMatch[2].trim(),
                                priority: todoMatch[3]
                            });
                        }
                    }
                });
            }
        });
    }

    readFiles(directory);
    return todos;
}

function generateReport(todos) {
    let report = 'TODO Report:\n\n';
    todos.forEach(todo => {
        report += `File: ${todo.file}\n`;
        report += `Line: ${todo.line}\n`;
        report += `Description: ${todo.description}\n`;
        report += `Assigned To: ${todo.assignedTo}\n`;
        report += `Priority: ${todo.priority}\n\n`;
    });
    return report;
}

// Usage
const directoryToScan = './testDir'; // Change this to your codebase directory
const results = extractTODOs(directoryToScan);

// Generate and save the report
const report = generateReport(results);
fs.writeFileSync('todo_report.txt', report);

console.log('TODO report has been generated as todo_report.txt');