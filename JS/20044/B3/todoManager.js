const fs = require('fs');
const path = require('path');

const nodemailer = require('nodemailer');

// Setup Nodemailer transporter (use Gmail for this example, but you should use your SMTP settings)
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ibk9493@gmail.com',
        pass: 'hnwuzbnpapdphgcj'
    }
});


function sendEmailNotification(assignedTo, subject, message) {
    const mailOptions = {
        from: 'ibk9493@gmail.com',
        to: `${assignedTo}@gmail.com`, // This should be dynamically set or fetched from somewhere
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Email could not be sent:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


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
        notifyNewTODO(todo)
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
}

// Function to update the status of a TODO item and regenerate the report
function updateStatusAndRegenerateReport(todoIndex, newStatus, directoryToScan) {
    if (todoIndex >= 0 && todoIndex < results.length) {
        const todo = results[todoIndex];
        const oldStatus = todo.status;
        updateTODOStatus(todo.file, todo.line, newStatus);

        // Notify on status change
        if (oldStatus !== newStatus) {
            sendEmailNotification(
                todo.assignedTo,
                `TODO Status Update: ${todo.description}`,
                `The status of your assigned TODO has been updated to ${newStatus}.`
            );
        }

        // Re-extract TODOs and regenerate the report
        results = extractTODOs(directoryToScan);
        const updatedReport = generateReport(results);
        fs.writeFileSync('todo_report.md', updatedReport);

        console.log(`Updated TODO #${todoIndex + 1} status to ${newStatus}`);
        console.log('Updated TODO report has been regenerated as todo_report.md');
    } else {
        console.log('Invalid TODO index');
    }
}
// Function to notify when a new TODO is added - this would typically be called after adding a new TODO
function notifyNewTODO(todo) {
    sendEmailNotification(
        todo.assignedTo,
        'New TODO Assigned',
        `A new TODO has been assigned to you: ${todo.description}`
    );
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
