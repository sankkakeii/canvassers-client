// utils/logger.js
import fs from 'fs';
import path from 'path';

export const logActivity = (logType, message, additionalInfo = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        logType,
        message,
        ...additionalInfo,
    };

    const logFilePath = path.join(process.cwd(), 'logs', 'activityLogs.json');

    // Ensure the logs directory exists
    if (!fs.existsSync(path.dirname(logFilePath))) {
        fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }

    // Read existing logs
    const existingLogs = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath)) : [];

    // Append the new log entry
    existingLogs.push(logEntry);

    // Write the updated logs back to the file
    fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2));
};
