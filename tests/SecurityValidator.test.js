import SecurityValidator from '../js/core/SecurityValidator.js';

describe('SecurityValidator', () => {
    describe('sanitizeInput', () => {
        test('should escape HTML characters', () => {
            expect(SecurityValidator.sanitizeInput('<script>')).toBe('&lt;script&gt;');
            expect(SecurityValidator.sanitizeInput('test"quote')).toBe('test&quot;quote');
            expect(SecurityValidator.sanitizeInput("test'quote")).toBe('test&#x27;quote');
        });

        test('should return non-string input as is', () => {
            expect(SecurityValidator.sanitizeInput(123)).toBe(123);
            expect(SecurityValidator.sanitizeInput(null)).toBe(null);
            expect(SecurityValidator.sanitizeInput(undefined)).toBe(undefined);
        });

        test('should strip tags when option is set', () => {
            const result = SecurityValidator.sanitizeInput('<p>Hello</p>', { stripTags: true });
            expect(result).toBe('Hello');
        });

        test('should truncate to maxLength when option is set', () => {
            const result = SecurityValidator.sanitizeInput('Hello World', { maxLength: 5 });
            expect(result).toBe('Hello');
        });
    });

    describe('detectXSS', () => {
        test('should detect script tags', () => {
            expect(SecurityValidator.detectXSS('<script>alert("xss")</script>')).toBe(true);
        });

        test('should detect javascript: protocol', () => {
            expect(SecurityValidator.detectXSS('javascript:alert("xss")')).toBe(true);
        });

        test('should detect event handlers', () => {
            expect(SecurityValidator.detectXSS('onclick=alert("xss")')).toBe(true);
        });

        test('should return false for safe input', () => {
            expect(SecurityValidator.detectXSS('Hello World')).toBe(false);
            expect(SecurityValidator.detectXSS('123')).toBe(false);
        });

        test('should return false for non-string input', () => {
            expect(SecurityValidator.detectXSS(123)).toBe(false);
            expect(SecurityValidator.detectXSS(null)).toBe(false);
        });
    });

    describe('detectSQLInjection', () => {
        test('should detect SQL keywords', () => {
            expect(SecurityValidator.detectSQLInjection("SELECT * FROM users")).toBe(true);
            expect(SecurityValidator.detectSQLInjection("DROP TABLE users")).toBe(true);
        });

        test('should detect SQL comments', () => {
            expect(SecurityValidator.detectSQLInjection("admin'--")).toBe(true);
        });

        test('should return false for safe input', () => {
            expect(SecurityValidator.detectSQLInjection('Hello World')).toBe(false);
        });
    });

    describe('validateInput', () => {
        test('should validate numbers', () => {
            const result = SecurityValidator.validateInput('100', 'number', { min: 50, max: 200 });
            expect(result.valid).toBe(true);
        });

        test('should reject numbers below minimum', () => {
            const result = SecurityValidator.validateInput('10', 'number', { min: 50, max: 200 });
            expect(result.valid).toBe(false);
            expect(result.threats).toContain('BELOW_MIN');
        });

        test('should reject numbers above maximum', () => {
            const result = SecurityValidator.validateInput('300', 'number', { min: 50, max: 200 });
            expect(result.valid).toBe(false);
            expect(result.threats).toContain('ABOVE_MAX');
        });

        test('should validate integers', () => {
            const result = SecurityValidator.validateInput('100', 'integer', { min: 50, max: 200 });
            expect(result.valid).toBe(true);
        });

        test('should reject non-integers', () => {
            const result = SecurityValidator.validateInput('100.5', 'integer');
            expect(result.valid).toBe(false);
        });

        test('should validate emails', () => {
            expect(SecurityValidator.validateInput('test@example.com', 'email').valid).toBe(true);
            expect(SecurityValidator.validateInput('invalid-email', 'email').valid).toBe(false);
        });

        test('should validate text length', () => {
            const result = SecurityValidator.validateInput('Hi', 'text', { minLength: 3 });
            expect(result.valid).toBe(false);
            expect(result.threats).toContain('TOO_SHORT');
        });

        test('should detect and sanitize XSS', () => {
            const result = SecurityValidator.validateInput('<script>alert(1)</script>', 'text');
            expect(result.threats).toContain('XSS_DETECTED');
            expect(result.sanitized).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
        });
    });

    describe('validateHealthInput', () => {
        test('should validate correct health input', () => {
            const result = SecurityValidator.validateHealthInput(175, 70, 30);
            expect(result.valid).toBe(true);
            expect(result.errors.length).toBe(0);
        });

        test('should reject invalid height', () => {
            const result = SecurityValidator.validateHealthInput(500, 70, 30);
            expect(result.valid).toBe(false);
        });

        test('should reject invalid weight', () => {
            const result = SecurityValidator.validateHealthInput(175, 500, 30);
            expect(result.valid).toBe(false);
        });

        test('should reject invalid age', () => {
            const result = SecurityValidator.validateHealthInput(175, 70, 200);
            expect(result.valid).toBe(false);
        });
    });

    describe('generateCSRFToken', () => {
        test('should generate a 64-character hex string', () => {
            const token = SecurityValidator.generateCSRFToken();
            expect(token.length).toBe(64);
            expect(/^[a-f0-9]+$/.test(token)).toBe(true);
        });

        test('should generate unique tokens', () => {
            const token1 = SecurityValidator.generateCSRFToken();
            const token2 = SecurityValidator.generateCSRFToken();
            expect(token1).not.toBe(token2);
        });
    });

    describe('validateCSRFToken', () => {
        test('should validate matching tokens', () => {
            const token = 'test-token';
            expect(SecurityValidator.validateCSRFToken(token, token)).toBe(true);
        });

        test('should reject non-matching tokens', () => {
            expect(SecurityValidator.validateCSRFToken('token1', 'token2')).toBe(false);
        });

        test('should reject null tokens', () => {
            expect(SecurityValidator.validateCSRFToken(null, 'token')).toBe(false);
            expect(SecurityValidator.validateCSRFToken('token', null)).toBe(false);
        });
    });

    describe('hashSensitiveData', () => {
        test('should generate consistent hash for same input', () => {
            const hash1 = SecurityValidator.hashSensitiveData('password');
            const hash2 = SecurityValidator.hashSensitiveData('password');
            expect(hash1).toBe(hash2);
        });

        test('should generate different hash for different input', () => {
            const hash1 = SecurityValidator.hashSensitiveData('password1');
            const hash2 = SecurityValidator.hashSensitiveData('password2');
            expect(hash1).not.toBe(hash2);
        });
    });

    describe('maskSensitiveData', () => {
        test('should mask email', () => {
            const result = SecurityValidator.maskSensitiveData('test@example.com', 'email');
            expect(result).toBe('t***@example.com');
        });

        test('should mask phone', () => {
            const result = SecurityValidator.maskSensitiveData('13812345678', 'phone');
            expect(result).toBe('138****5678');
        });

        test('should mask ID', () => {
            const result = SecurityValidator.maskSensitiveData('1234567890123456', 'id');
            expect(result).toContain('****');
        });

        test('should mask default type', () => {
            const result = SecurityValidator.maskSensitiveData('sensitive', 'default');
            expect(result).toBe('s****e');
        });

        test('should handle short strings', () => {
            const result = SecurityValidator.maskSensitiveData('abc', 'default');
            expect(result).toBe('****');
        });
    });

    describe('sanitizeHTML', () => {
        test('should escape HTML content', () => {
            const result = SecurityValidator.sanitizeHTML('<script>alert(1)</script>');
            expect(result).not.toContain('<script>');
        });
    });

    describe('escapeRegExp', () => {
        test('should escape special regex characters', () => {
            const result = SecurityValidator.escapeRegExp('test.*+?^${}()|[]\\');
            expect(result).toBe('test\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
        });
    });
});
