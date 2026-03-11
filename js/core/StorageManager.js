import { StorageError } from './ErrorHandler.js';
import AppConfig from './config.js';

export class StorageManager {
    static prefix = AppConfig.STORAGE.PREFIX;

    static isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    static getKey(key) {
        return `${this.prefix}${key}`;
    }

    static set(key, value) {
        if (!this.isAvailable()) {
            throw new StorageError('本地存储不可用', 'set');
        }

        try {
            const serialized = JSON.stringify(value);
            const storageKey = this.getKey(key);
            localStorage.setItem(storageKey, serialized);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                throw new StorageError('存储空间已满', 'set');
            }
            throw new StorageError(`存储失败: ${error.message}`, 'set');
        }
    }

    static get(key, defaultValue = null) {
        if (!this.isAvailable()) {
            return defaultValue;
        }

        try {
            const storageKey = this.getKey(key);
            const item = localStorage.getItem(storageKey);
            
            if (item === null) {
                return defaultValue;
            }
            
            return JSON.parse(item);
        } catch (error) {
            console.warn(`StorageManager.get error for key "${key}":`, error);
            return defaultValue;
        }
    }

    static remove(key) {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            const storageKey = this.getKey(key);
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            throw new StorageError(`删除失败: ${error.message}`, 'remove');
        }
    }

    static clear() {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            throw new StorageError(`清空失败: ${error.message}`, 'clear');
        }
    }

    static getUsedSpace() {
        if (!this.isAvailable()) {
            return 0;
        }

        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                const value = localStorage.getItem(key);
                total += key.length + (value ? value.length : 0);
            }
        }
        return total * 2;
    }

    static saveUserData(data) {
        return this.set(AppConfig.STORAGE.KEYS.USER_DATA, {
            ...data,
            updatedAt: new Date().toISOString()
        });
    }

    static getUserData() {
        return this.get(AppConfig.STORAGE.KEYS.USER_DATA, null);
    }

    static saveSettings(settings) {
        return this.set(AppConfig.STORAGE.KEYS.SETTINGS, settings);
    }

    static getSettings() {
        return this.get(AppConfig.STORAGE.KEYS.SETTINGS, {
            theme: 'light',
            language: 'zh-CN',
            notifications: true
        });
    }

    static saveReminders(reminders) {
        return this.set(AppConfig.STORAGE.KEYS.REMINDERS, reminders);
    }

    static getReminders() {
        return this.get(AppConfig.STORAGE.KEYS.REMINDERS, {
            water: null,
            meal: null,
            weight: null
        });
    }
}

export default StorageManager;
