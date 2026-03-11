export class AppError extends Error {
    constructor(message, code, details = null) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }

    static fromError(error, code = 'UNKNOWN_ERROR') {
        return new AppError(error.message, code, {
            originalName: error.name,
            stack: error.stack
        });
    }
}

export class ValidationError extends AppError {
    constructor(message, field = null) {
        super(message, 'VALIDATION_ERROR', { field });
        this.name = 'ValidationError';
    }
}

export class StorageError extends AppError {
    constructor(message, operation = null) {
        super(message, 'STORAGE_ERROR', { operation });
        this.name = 'StorageError';
    }
}

export class NetworkError extends AppError {
    constructor(message, url = null) {
        super(message, 'NETWORK_ERROR', { url });
        this.name = 'NetworkError';
    }
}

export class ErrorHandler {
    static errors = [];
    static maxErrors = 100;

    static log(error) {
        const errorInfo = {
            message: error.message,
            code: error.code || 'UNKNOWN',
            details: error.details || null,
            timestamp: new Date().toISOString(),
            stack: error.stack
        };

        this.errors.unshift(errorInfo);
        
        if (this.errors.length > this.maxErrors) {
            this.errors.pop();
        }

        console.error('[ErrorHandler]', errorInfo);
        
        return errorInfo;
    }

    static handle(error, userMessage = null) {
        this.log(error);

        if (userMessage && typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast(userMessage);
        }

        return {
            handled: true,
            error: error.message,
            code: error.code
        };
    }

    static getRecentErrors(count = 10) {
        return this.errors.slice(0, count);
    }

    static clearErrors() {
        this.errors = [];
    }

    static setupGlobalHandlers() {
        window.addEventListener('error', (event) => {
            this.log(new AppError(
                event.message,
                'GLOBAL_ERROR',
                { filename: event.filename, lineno: event.lineno, colno: event.colno }
            ));
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.log(AppError.fromError(event.reason, 'UNHANDLED_REJECTION'));
        });
    }
}

export default ErrorHandler;
