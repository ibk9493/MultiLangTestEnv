const fs = require('fs');
const path = require('path');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file))
        }
    })

    return arrayOfFiles
}

// Function to parse TODO comments
function parseTODO(line, filePath) {
    const match = line.match(/\/\/\s*TODO:\s*(.*?)\s*-\s*(.*?)\s*-\s*(.*)/);
    if (match) {
        return {
            description: match[1].trim(),
            assignedTo: match[2].trim(),
            priority: match[3].trim(),
            file: filePath,
            line: line.trim()
        };
    }
    return null;
}

// Main function to scan files and generate report
function scanAndReport(directory) {
    const files = getAllFiles(directory);
    const todos = [];

    files.forEach(file => {
        if (path.extname(file) === '.js') {  // Only scan JavaScript files
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                const todo = parseTODO(line, file);
                if (todo) {
                    todo.lineNumber = index + 1;
                    todos.push(todo);
                }
            });
        }
    });

    // Generate report
    let report = "# TODO Report\n\n";
    todos.forEach(todo => {
        report += `## ${todo.description}\n`;
        report += `- **Assigned to:** ${todo.assignedTo}\n`;
        report += `- **Priority:** ${todo.priority}\n`;
        report += `- **File:** ${todo.file}\n`;
        report += `- **Line:** ${todo.lineNumber}\n`;
        report += `- **Full TODO:** ${todo.line}\n\n`;
    });

    // Write report to file
    fs.writeFileSync('TODO_report.md', report);
    console.log('TODO report generated: TODO_report.md');
}

// Usage
scanAndReport('./testDir');