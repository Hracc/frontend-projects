import fs from 'fs';


export function logReq(req, res, next) {
    const clientIP = req.ip || req.connection.remoteAddress;
    const logEntry = `time: [${new Date().toISOString()}] ip: [${clientIP}] method: [${req.method}] url: [${req.url}]\n`;

    fs.appendFile('access.log', logEntry, (err) => {
        if (err) {
            console.error('Ошибка при записи лога:', err);
        }
    });

    next();
}


