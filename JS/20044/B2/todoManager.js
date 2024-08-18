const fs = require('fs');
const path = require('path');

function extractTODOs(directory, filePattern = /\.js$/) {
    const todos = [];

    function readFiles(dir) {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
            const fullPath = path.join(dir, dirent.name);
            if (dirent.isDirectory()) {
                readFiles(fullPath);
            } else if (filePattern.test(dirent.name)) {
                const fileContent = fs.readFileSync(fullPath, 'utf8');
                const lines = fileContent.split('\n');
                lines.forEach((line, lineNumber) => {
                    const todoMatch = line.match(/\/\/ TODO: (.+?) - (.+?) - (Low|Medium|High) - (Open|Resolved)/);
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
                });
            }
        });
    }

    readFiles(directory);
    return todos;
}

function updateTODOStatus(filePath, line, newStatus) {
    let fileContent = fs.readFileSync(filePath, 'utf8').split('\n');
    if (fileContent[line - 1]) {
        const updatedLine = fileContent[line - 1].replace(/( - (Open|Resolved))$/, ` - ${newStatus}`);
        fileContent[line - 1] = updatedLine;
        fs.writeFileSync(filePath, fileContent.join('\n'), 'utf8');
        return true;
    }
    return false;
}

function generateBeautifiedReport(todos) {
    let report = '```\n';
    report += '=============== TODO Report ===============\n\n';
    
    ['High', 'Medium', 'Low'].forEach(priority => {
        const priorityTodos = todos.filter(todo => todo.priority === priority);
        if (priorityTodos.length) {
            report += `### ${priority} Priority\n\n`;
            priorityTodos.forEach(todo => {
                report += `- **File:** ${todo.file}\n`;
                report += `  - **Line:** ${todo.line}\n`;
                report += `  - **Description:** ${todo.description}\n`;
                report += `  - **Assigned To:** ${todo.assignedTo}\n`;
                report += `  - **Status:** ${todo.status}\n\n`;
            });
        }
    });
    
    report += '===========================================\n';
    report += '```';
    return report;
}

// Usage
const directoryToScan = './testDir';
const todos = extractTODOs(directoryToScan);

// Generate report
const report = generateBeautifiedReport(todos);
fs.writeFileSync('todo_report.md', report); // Saving as Markdown for better formatting

// Example of updating TODO status
updateTODOStatus('./testDir/test.js', 1, 'Resolved');


console.log('Beautified TODO report has been generated as todo_report.md');