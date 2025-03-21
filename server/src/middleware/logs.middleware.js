import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsMiddleware =async(req,res,next)=>{
    const logFilePath = path.join(__dirname, "../logs/api.log.txt");

    const logEntry = `[${new Date().toISOString()}] ${req.ip} - ${req.method} ${req.url}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error("Error writing log:", err);
    });

    next();
}
export default logsMiddleware