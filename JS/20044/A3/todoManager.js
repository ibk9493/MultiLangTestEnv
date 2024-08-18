const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: 'ibk9493@gmail.com',
        pass: 'hnwuzbnpapdphgcj'
    }
});

function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'ibk9493@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

function extractTODOs(directory, filePattern = /\.js$/) {
    const todos = [];
    const existingTodos = new Set();

    // Load existing TODOs from the last report if it exists
    if (fs.existsSync('todo_report.md')) {
        const lastReport = fs.readFileSync('todo_report.md', 'utf8');
        const todoMatches = lastReport.matchAll(/\| File \| (.+) \|\n\| Line \| (\d+) \|/g);
        for (const match of todoMatches) {
            existingTodos.add(`${match[1]}:${match[2]}`);
        }
    }

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
                            const todo = {
                                file: fullPath,
                                line: lineNumber + 1,
                                description: todoMatch[1].trim(),
                                assignedTo: todoMatch[2].trim(),
                                priority: todoMatch[3],
                                status: todoMatch[4]
                            };
                            todos.push(todo);

                            // Check if this is a new TODO
                            const todoKey = `${fullPath}:${lineNumber + 1}`;
                            if (!existingTodos.has(todoKey)) {
                                sendEmail(
                                    todo.assignedTo,
                                    'New TODO Assigned',
                                    `A new TODO has been assigned to you:\n\nDescription: ${todo.description}\nFile: ${todo.file}\nLine: ${todo.line}\nPriority: ${todo.priority}\nStatus: ${todo.status}`
                                );
                            }
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

    // Update the status in the TODO comment
    const updatedLine = todoLine.replace(/(Open|In Progress|Resolved)\s*$/, newStatus);

    // Write the updated line back to the file
    lines[lineNumber - 1] = updatedLine;
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

    // Extract the assigned person's email from the TODO comment
    const assignedToMatch = todoLine.match(/- (.+?) -/);
    if (assignedToMatch) {
        const assignedTo = assignedToMatch[1].trim();
        sendEmail(
            assignedTo,
            'TODO Status Updated',
            `The status of a TODO assigned to you has been updated:\n\nFile: ${filePath}\nLine: ${lineNumber}\nNew Status: ${newStatus}\n\nPlease check the TODO report for more details.`
        );
    }
}
// Function to update the status of a TODO item and regenerate the report
function updateStatusAndRegenerateReport(todoIndex, newStatus, directoryToScan) {
    if (todoIndex >= 0 && todoIndex < results.length) {
        const todo = results[todoIndex];
        updateTODOStatus(todo.file, todo.line, newStatus);
        console.log(`Updated TODO #${todoIndex + 1} status to ${newStatus}`);
        
        // Re-extract TODOs and regenerate the report
        const updatedResults = extractTODOs(directoryToScan);
        const updatedReport = generateReport(updatedResults);
        fs.writeFileSync('todo_report.md', updatedReport);
        console.log('Updated TODO report has been regenerated as todo_report.md');
    } else {
        console.log('Invalid TODO index');
    }
}
// Usage for extracting TODOs and generating report
const directoryToScan = './testDir'; // Change this to your codebase directory
let results = extractTODOs(directoryToScan);

// Generate and save the initial report
let report = generateReport(results);
fs.writeFileSync('todo_report.md', report);
console.log('TODO report has been generated as todo_report.md');

// Example usage: Update the status of the first TODO item and regenerate the report
updateStatusAndRegenerateReport(0, 'In Progress', directoryToScan);