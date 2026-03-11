import { ValidationError } from './ErrorHandler.js';
import AppConfig from './config.js';

export class SecurityValidator {
    static XSS_PATTERNS = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /data:\s*text\/html/gi,
        /vbscript:/gi,
        /expression\s*\(/gi
    ];

    static SQL_INJECTION_PATTERNS = [
        /('|(\\'))|(;)/g,
        /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE)\b/gi,
        /(--)|(\/\*)|(\*\/)/g,
        /(\bOR\b|\bAND\b)\s*['"]?\d+['"]?\s*=\s*['"]?\d+/gi
    ];

    static sanitizeInput(input, options = {}) {
        if (input === null || input === undefined) {
            return input;
        }

        if (typeof input === 'number') {
            return input;
        }

        if (typeof input !== 'string') {
            return input;
        }

        let sanitized = input;

        if (options.stripTags) {
            sanitized = sanitized.replace(/<[^>]*>/g, '');
        }

        sanitized = sanitized
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');

        if (options.maxLength && sanitized.length > options.maxLength) {
            sanitized = sanitized.substring(0, options.maxLength);
        }

        return sanitized;
    }

    static detectXSS(input) {
        if (typeof input !== 'string') return false;
        
        return this.XSS_PATTERNS.some(pattern => pattern.test(input));
    }

    static detectSQLInjection(input) {
        if (typeof input !== 'string') return false;
        
        return this.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
    }

    static validateInput(input, type, options = {}) {
        const result = {
            valid: true,
            sanitized: input,
            threats: []
        };

        if (this.detectXSS(input)) {
            result.threats.push('XSS_DETECTED');
            result.sanitized = this.sanitizeInput(input, options);
        }

        if (this.detectSQLInjection(input)) {
            result.threats.push('SQL_INJECTION_DETECTED');
            result.valid = false;
        }

        switch (type) {
            case 'number':
                const num = parseFloat(input);
                if (isNaN(num)) {
                    result.valid = false;
                    result.threats.push('INVALID_NUMBER');
                } else if (options.min !== undefined && num < options.min) {
                    result.valid = false;
                    result.threats.push('BELOW_MIN');
                } else if (options.max !== undefined && num > options.max) {
                    result.valid = false;
                    result.threats.push('ABOVE_MAX');
                }
                break;

            case 'integer':
                const intStr = String(input);
                const int = parseInt(input, 10);
                if (isNaN(int) || intStr.includes('.')) {
                    result.valid = false;
                    result.threats.push('INVALID_INTEGER');
                } else if (options.min !== undefined && int < options.min) {
                    result.valid = false;
                    result.threats.push('BELOW_MIN');
                } else if (options.max !== undefined && int > options.max) {
                    result.valid = false;
                    result.threats.push('ABOVE_MAX');
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input)) {
                    result.valid = false;
                    result.threats.push('INVALID_EMAIL');
                }
                break;

            case 'text':
                if (options.minLength && input.length < options.minLength) {
                    result.valid = false;
                    result.threats.push('TOO_SHORT');
                }
                if (options.maxLength && input.length > options.maxLength) {
                    result.valid = false;
                    result.threats.push('TOO_LONG');
                }
                break;
        }

        return result;
    }

    static validateHealthInput(height, weight, age) {
        const errors = [];

        const heightResult = this.validateInput(height, 'number', {
            min: AppConfig.VALIDATION.HEIGHT.MIN,
            max: AppConfig.VALIDATION.HEIGHT.MAX
        });
        if (!heightResult.valid) {
            errors.push({ field: 'height', threats: heightResult.threats });
        }

        const weightResult = this.validateInput(weight, 'number', {
            min: AppConfig.VALIDATION.WEIGHT.MIN,
            max: AppConfig.VALIDATION.WEIGHT.MAX
        });
        if (!weightResult.valid) {
            errors.push({ field: 'weight', threats: weightResult.threats });
        }

        const ageResult = this.validateInput(age, 'integer', {
            min: AppConfig.VALIDATION.AGE.MIN,
            max: AppConfig.VALIDATION.AGE.MAX
        });
        if (!ageResult.valid) {
            errors.push({ field: 'age', threats: ageResult.threats });
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    static generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    static validateCSRFToken(token, storedToken) {
        if (!token || !storedToken) return false;
        return token === storedToken;
    }

    static hashSensitiveData(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    static maskSensitiveData(data, type = 'default') {
        if (!data) return data;

        switch (type) {
            case 'email':
                const [local, domain] = data.split('@');
                if (!domain) return '***';
                return `${local.charAt(0)}***@${domain}`;
            
            case 'phone':
                return data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            
            case 'id':
                return data.replace(/(.{4}).*(.{4})/, '$1****$2');
            
            default:
                if (data.length <= 4) return '****';
                return data.charAt(0) + '****' + data.charAt(data.length - 1);
        }
    }

    static sanitizeHTML(html) {
        const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'span'];
        const tempDiv = document.createElement('div');
        tempDiv.textContent = html;
        return tempDiv.innerHTML;
    }

    static escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

export default SecurityValidator;
