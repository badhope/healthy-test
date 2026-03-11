import { jest } from '@jest/globals';
import Utils from '../js/core/utils.js';

const mockConfig = {
    UI: {
        TOAST_DURATION: 3000,
        DEBOUNCE_DELAY: 200,
        CONFETTI_COUNT: 50,
        SIDEBAR_BREAKPOINT: 768
    },
    VALIDATION: {
        HEIGHT: { MIN: 50, MAX: 250 },
        WEIGHT: { MIN: 10, MAX: 300 },
        AGE: { MIN: 1, MAX: 150 }
    }
};

jest.mock('../js/core/config.js', () => ({
    default: mockConfig
}));

describe('Utils', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('debounce', () => {
        test('should delay function execution', () => {
            const mockFn = jest.fn();
            const debouncedFn = Utils.debounce(mockFn, 100);

            debouncedFn();
            debouncedFn();
            debouncedFn();

            expect(mockFn).not.toHaveBeenCalled();

            jest.advanceTimersByTime(100);

            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should pass arguments correctly', () => {
            const mockFn = jest.fn();
            const debouncedFn = Utils.debounce(mockFn, 100);

            debouncedFn('arg1', 'arg2');
            jest.advanceTimersByTime(100);

            expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
        });
    });

    describe('throttle', () => {
        test('should limit function calls', () => {
            const mockFn = jest.fn();
            const throttledFn = Utils.throttle(mockFn, 100);

            throttledFn();
            throttledFn();
            throttledFn();

            expect(mockFn).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(100);
            throttledFn();

            expect(mockFn).toHaveBeenCalledTimes(2);
        });
    });

    describe('showToast', () => {
        test('should create toast element', () => {
            Utils.showToast('Test message');

            const toast = document.querySelector('.toast-notification');
            expect(toast).not.toBeNull();
            expect(toast.textContent).toBe('Test message');
        });

        test('should remove toast after duration', () => {
            Utils.showToast('Test message', 1000);

            let toast = document.querySelector('.toast-notification');
            expect(toast).not.toBeNull();

            jest.advanceTimersByTime(1000);
            jest.advanceTimersByTime(300);

            toast = document.querySelector('.toast-notification');
            expect(toast).toBeNull();
        });

        test('should remove existing toast before creating new one', () => {
            Utils.showToast('First message');
            Utils.showToast('Second message');

            const toasts = document.querySelectorAll('.toast-notification');
            expect(toasts.length).toBe(1);
            expect(toasts[0].textContent).toBe('Second message');
        });
    });

    describe('validateNumber', () => {
        test('should validate number within range', () => {
            const result = Utils.validateNumber(100, 50, 200, 'test');
            expect(result.valid).toBe(true);
            expect(result.value).toBe(100);
        });

        test('should reject number below minimum', () => {
            const result = Utils.validateNumber(10, 50, 200, 'test');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('test');
        });

        test('should reject number above maximum', () => {
            const result = Utils.validateNumber(300, 50, 200, 'test');
            expect(result.valid).toBe(false);
        });

        test('should reject non-numeric value', () => {
            const result = Utils.validateNumber('abc', 50, 200, 'test');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('有效的');
        });
    });

    describe('validateInteger', () => {
        test('should validate integer within range', () => {
            const result = Utils.validateInteger(100, 50, 200, 'test');
            expect(result.valid).toBe(true);
            expect(result.value).toBe(100);
        });

        test('should parse string to integer', () => {
            const result = Utils.validateInteger('100', 50, 200, 'test');
            expect(result.valid).toBe(true);
            expect(result.value).toBe(100);
        });
    });

    describe('safeGetElement', () => {
        test('should return element if exists', () => {
            document.body.innerHTML = '<div id="test"></div>';
            const element = Utils.safeGetElement('test');
            expect(element).not.toBeNull();
        });

        test('should return null and warn if element does not exist', () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
            const element = Utils.safeGetElement('nonexistent');
            expect(element).toBeNull();
            expect(warnSpy).toHaveBeenCalled();
            warnSpy.mockRestore();
        });
    });

    describe('formatNumber', () => {
        test('should format number with default decimals', () => {
            expect(Utils.formatNumber(3.14159)).toBe('3.1');
        });

        test('should format number with custom decimals', () => {
            expect(Utils.formatNumber(3.14159, 3)).toBe('3.142');
        });
    });

    describe('sanitizeInput', () => {
        test('should escape HTML characters', () => {
            expect(Utils.sanitizeInput('<script>')).toBe('&lt;script&gt;');
            expect(Utils.sanitizeInput('test"quote')).toBe('test&quot;quote');
            expect(Utils.sanitizeInput("test'quote")).toBe('test&#x27;quote');
        });

        test('should return non-string input as is', () => {
            expect(Utils.sanitizeInput(123)).toBe(123);
            expect(Utils.sanitizeInput(null)).toBe(null);
        });
    });

    describe('deepClone', () => {
        test('should clone primitive values', () => {
            expect(Utils.deepClone(42)).toBe(42);
            expect(Utils.deepClone('test')).toBe('test');
            expect(Utils.deepClone(null)).toBe(null);
        });

        test('should clone arrays', () => {
            const arr = [1, 2, { a: 3 }];
            const cloned = Utils.deepClone(arr);
            
            expect(cloned).toEqual(arr);
            expect(cloned).not.toBe(arr);
            expect(cloned[2]).not.toBe(arr[2]);
        });

        test('should clone objects', () => {
            const obj = { a: 1, b: { c: 2 } };
            const cloned = Utils.deepClone(obj);
            
            expect(cloned).toEqual(obj);
            expect(cloned).not.toBe(obj);
            expect(cloned.b).not.toBe(obj.b);
        });

        test('should clone dates', () => {
            const date = new Date('2024-01-01');
            const cloned = Utils.deepClone(date);
            
            expect(cloned.getTime()).toBe(date.getTime());
            expect(cloned).not.toBe(date);
        });
    });

    describe('generateId', () => {
        test('should generate unique IDs', () => {
            const id1 = Utils.generateId();
            const id2 = Utils.generateId();
            
            expect(id1).not.toBe(id2);
            expect(id1).toMatch(/^id_\d+_[a-z0-9]+$/);
        });
    });

    describe('isMobile', () => {
        test('should return true for small screens', () => {
            window.innerWidth = 500;
            expect(Utils.isMobile()).toBe(true);
        });

        test('should return false for large screens', () => {
            window.innerWidth = 1024;
            expect(Utils.isMobile()).toBe(false);
        });
    });
});
