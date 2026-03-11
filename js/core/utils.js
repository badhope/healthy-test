import AppConfig from './config.js';

export class Utils {
    static debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static showToast(message, duration = AppConfig.UI.TOAST_DURATION) {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--gray-800, #1f2937);
            color: white;
            padding: 1rem 2rem;
            border-radius: 1rem;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: slide-up 0.3s ease-out;
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slide-down 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static createConfetti(count = AppConfig.UI.CONFETTI_COUNT) {
        const colors = ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6'];
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            return;
        }

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: 50%;
                top: 50%;
                border-radius: 50%;
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(confetti);
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 200 + Math.random() * 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            confetti.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }).onfinish = () => confetti.remove();
        }
    }

    static validateNumber(value, min, max, fieldName) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return { valid: false, error: `请输入有效的${fieldName}` };
        }
        if (num < min || num > max) {
            return { valid: false, error: `${fieldName}请在 ${min}-${max} 之间` };
        }
        return { valid: true, value: num };
    }

    static validateInteger(value, min, max, fieldName) {
        const num = parseInt(value, 10);
        if (isNaN(num)) {
            return { valid: false, error: `请输入有效的${fieldName}` };
        }
        if (num < min || num > max) {
            return { valid: false, error: `${fieldName}请在 ${min}-${max} 之间` };
        }
        return { valid: true, value: num };
    }

    static safeGetElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id "${id}" not found`);
        }
        return element;
    }

    static safeQuerySelector(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element with selector "${selector}" not found`);
        }
        return element;
    }

    static formatNumber(num, decimals = 1) {
        return Number(num).toFixed(decimals);
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    clonedObj[key] = Utils.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    static generateId() {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    static isMobile() {
        return window.innerWidth <= AppConfig.UI.SIDEBAR_BREAKPOINT;
    }

    static prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}

export default Utils;
