import { ErrorHandler, AppError, ValidationError, StorageError, NetworkError } from '../js/core/ErrorHandler.js';

describe('ErrorHandler', () => {
    beforeEach(() => {
        ErrorHandler.clearErrors();
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('AppError', () => {
        test('should create error with message and code', () => {
            const error = new AppError('Test error', 'TEST_CODE');
            
            expect(error.message).toBe('Test error');
            expect(error.code).toBe('TEST_CODE');
            expect(error.name).toBe('AppError');
            expect(error.timestamp).toBeDefined();
        });

        test('should create error with details', () => {
            const error = new AppError('Test error', 'TEST_CODE', { key: 'value' });
            
            expect(error.details).toEqual({ key: 'value' });
        });

        test('should create from native error', () => {
            const nativeError = new Error('Native error');
            const appError = AppError.fromError(nativeError, 'CONVERTED');
            
            expect(appError.message).toBe('Native error');
            expect(appError.code).toBe('CONVERTED');
            expect(appError.details.originalName).toBe('Error');
        });
    });

    describe('ValidationError', () => {
        test('should create validation error', () => {
            const error = new ValidationError('Invalid input', 'email');
            
            expect(error.message).toBe('Invalid input');
            expect(error.code).toBe('VALIDATION_ERROR');
            expect(error.name).toBe('ValidationError');
            expect(error.details.field).toBe('email');
        });
    });

    describe('StorageError', () => {
        test('should create storage error', () => {
            const error = new StorageError('Storage failed', 'set');
            
            expect(error.message).toBe('Storage failed');
            expect(error.code).toBe('STORAGE_ERROR');
            expect(error.name).toBe('StorageError');
            expect(error.details.operation).toBe('set');
        });
    });

    describe('NetworkError', () => {
        test('should create network error', () => {
            const error = new NetworkError('Request failed', 'https://api.example.com');
            
            expect(error.message).toBe('Request failed');
            expect(error.code).toBe('NETWORK_ERROR');
            expect(error.name).toBe('NetworkError');
            expect(error.details.url).toBe('https://api.example.com');
        });
    });

    describe('ErrorHandler.log', () => {
        test('should log error to errors array', () => {
            const error = new AppError('Test error', 'TEST');
            const logged = ErrorHandler.log(error);
            
            expect(ErrorHandler.errors.length).toBe(1);
            expect(logged.message).toBe('Test error');
            expect(logged.code).toBe('TEST');
        });

        test('should limit errors to maxErrors', () => {
            ErrorHandler.maxErrors = 5;
            
            for (let i = 0; i < 10; i++) {
                ErrorHandler.log(new AppError(`Error ${i}`, 'TEST'));
            }
            
            expect(ErrorHandler.errors.length).toBe(5);
            expect(ErrorHandler.errors[0].message).toBe('Error 9');
        });
    });

    describe('ErrorHandler.handle', () => {
        test('should log and return handled status', () => {
            const error = new AppError('Test error', 'TEST');
            const result = ErrorHandler.handle(error);
            
            expect(result.handled).toBe(true);
            expect(result.error).toBe('Test error');
            expect(result.code).toBe('TEST');
        });
    });

    describe('ErrorHandler.getRecentErrors', () => {
        test('should return recent errors', () => {
            for (let i = 0; i < 15; i++) {
                ErrorHandler.log(new AppError(`Error ${i}`, 'TEST'));
            }
            
            const recent = ErrorHandler.getRecentErrors(5);
            expect(recent.length).toBe(5);
        });
    });

    describe('ErrorHandler.clearErrors', () => {
        test('should clear all errors', () => {
            ErrorHandler.log(new AppError('Test', 'TEST'));
            ErrorHandler.log(new AppError('Test2', 'TEST'));
            
            ErrorHandler.clearErrors();
            
            expect(ErrorHandler.errors.length).toBe(0);
        });
    });
});
