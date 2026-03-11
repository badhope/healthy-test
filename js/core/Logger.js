import AppConfig from './config.js';

export class LogLevel {
    static DEBUG = 0;
    static INFO = 1;
    static WARN = 2;
    static ERROR = 3;
    static NONE = 4;
}

export class Logger {
    static level = LogLevel.INFO;
    static logs = [];
    static maxLogs = 1000;
    static listeners = [];

    static setLevel(level) {
        this.level = level;
    }

    static formatTimestamp() {
        return new Date().toISOString();
    }

    static formatMessage(level, message, data = null) {
        return {
            timestamp: this.formatTimestamp(),
            level,
            levelName: this.getLevelName(level),
            message,
            data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    }

    static getLevelName(level) {
        const names = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'];
        return names[level] || 'UNKNOWN';
    }

    static log(level, message, data = null) {
        if (level < this.level) return;

        const logEntry = this.formatMessage(level, message, data);
        
        this.logs.unshift(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }

        const consoleMethod = level === LogLevel.ERROR ? 'error' 
            : level === LogLevel.WARN ? 'warn' 
            : level === LogLevel.INFO ? 'info' 
            : 'log';
        
        console[consoleMethod](`[${logEntry.timestamp}] [${logEntry.levelName}]`, message, data || '');

        this.notifyListeners(logEntry);

        return logEntry;
    }

    static debug(message, data = null) {
        return this.log(LogLevel.DEBUG, message, data);
    }

    static info(message, data = null) {
        return this.log(LogLevel.INFO, message, data);
    }

    static warn(message, data = null) {
        return this.log(LogLevel.WARN, message, data);
    }

    static error(message, data = null) {
        return this.log(LogLevel.ERROR, message, data);
    }

    static addListener(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    static notifyListeners(logEntry) {
        this.listeners.forEach(callback => {
            try {
                callback(logEntry);
            } catch (e) {
                console.error('Logger listener error:', e);
            }
        });
    }

    static getLogs(level = null, count = 100) {
        if (level === null) {
            return this.logs.slice(0, count);
        }
        return this.logs.filter(log => log.level >= level).slice(0, count);
    }

    static clearLogs() {
        this.logs = [];
    }

    static exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    static getErrorCount() {
        return this.logs.filter(log => log.level === LogLevel.ERROR).length;
    }

    static getWarnCount() {
        return this.logs.filter(log => log.level === LogLevel.WARN).length;
    }

    static group(groupName) {
        console.group(groupName);
        return {
            end: () => console.groupEnd()
        };
    }

    static time(label) {
        console.time(label);
        return {
            end: () => console.timeEnd(label)
        };
    }

    static table(data) {
        console.table(data);
    }

    static profile(name, fn) {
        const startTime = performance.now();
        const result = fn();
        const endTime = performance.now();
        
        this.debug(`Profile [${name}]: ${(endTime - startTime).toFixed(2)}ms`);
        
        return result;
    }

    static async profileAsync(name, fn) {
        const startTime = performance.now();
        const result = await fn();
        const endTime = performance.now();
        
        this.debug(`Profile [${name}]: ${(endTime - startTime).toFixed(2)}ms`);
        
        return result;
    }
}

export default Logger;
