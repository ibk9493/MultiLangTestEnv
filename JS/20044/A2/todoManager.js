const fs = require('fs');
const path = require('path');

function extractTODOs(directory, filePattern = /\.js$/) {
    const todos = [];

    function readFiles(dir) {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
            let fullPath = path.join(dir, dirent.name);
            if (dirent.isDirectory()) {
                readFiles(fullPath);
            } else if (filePattern.test(dirent.name)) {
                const fileContent = fs.readFileSync(fullPath, 'utf8');
                const lines = fileContent.split('\n');
                lines.forEach((line, lineNumber) => {
                    if (line.includes('// TODO:')) {
                        const todoMatch = line.match(/\/\/ TODO: (.+?) - (.+?) - (Low|Medium|High) - (Open|In Progress|Resolved)/);
                        if (todoMatch) {
                            todos.push({
                                file: fullPath,
                                line: lineNumber + 1,
                                description: todoMatch[1].trim(),
                                assignedTo: todoMatch[2].trim(),
                                priority: todoMatch[3],
                                status: todoMatch[4]
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
    let report = '# TODO Report\n\n';
    todos.forEach((todo, index) => {
        report += `## TODO #${index + 1}\n\n`;
        report += `| Field | Value |\n`;
        report += `|-------|-------|\n`;
        report += `| File | ${todo.file} |\n`;
        report += `| Line | ${todo.line} |\n`;
        report += `| Description | ${todo.description} |\n`;
        report += `| Assigned To | ${todo.assignedTo} |\n`;
        report += `| Priority | ${todo.priority} |\n`;
        report += `| Status | ${todo.status} |\n\n`;
    });
    return report;
}

function updateTODOStatus(filePath, lineNumber, newStatus) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    const todoLine = lines[lineNumber - 1];
    const updatedLine = todoLine.replace(/(Open|In Progress|Resolved)$/, newStatus);
    lines[lineNumber - 1] = updatedLine;
    fs.writeFileSync(filePath, lines.join('\n'));
}

// Usage for extracting TODOs and generating report
const directoryToScan = './testDir'; // Change this to your codebase directory
const results = extractTODOs(directoryToScan);

// Generate and save the report
const report = generateReport(results);
fs.writeFileSync('todo_report.md', report);

console.log('TODO report has been generated as todo_report.md');

// Function to update TODO status
function updateStatus(todoIndex, newStatus) {
    if (todoIndex >= 0 && todoIndex < results.length) {
        const todo = results[todoIndex];
        updateTODOStatus(todo.file, todo.line, newStatus);
        console.log(`Updated TODO #${todoIndex + 1} status to ${newStatus}`);
    } else {
        console.log('Invalid TODO index');
    }
}

// Example usage of updateStatus
updateStatus(1, 'In Progress');