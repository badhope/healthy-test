import { jest } from '@jest/globals';
import StorageManager from '../js/core/StorageManager.js';

const mockConfig = {
    STORAGE: {
        PREFIX: 'healthy_test_',
        KEYS: {
            USER_DATA: 'user_data',
            SETTINGS: 'settings',
            REMINDERS: 'reminders'
        }
    }
};

jest.mock('../js/core/config.js', () => ({
    default: mockConfig
}));

describe('StorageManager', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('isAvailable', () => {
        test('should return true when localStorage is available', () => {
            expect(StorageManager.isAvailable()).toBe(true);
        });
    });

    describe('getKey', () => {
        test('should add prefix to key', () => {
            expect(StorageManager.getKey('test')).toBe('healthy_test_test');
        });
    });

    describe('set and get', () => {
        test('should store and retrieve a value', () => {
            StorageManager.set('test', { name: 'value' });
            const result = StorageManager.get('test');
            expect(result).toEqual({ name: 'value' });
        });

        test('should return default value for non-existent key', () => {
            const result = StorageManager.get('nonexistent', 'default');
            expect(result).toBe('default');
        });

        test('should store arrays', () => {
            StorageManager.set('array', [1, 2, 3]);
            const result = StorageManager.get('array');
            expect(result).toEqual([1, 2, 3]);
        });

        test('should store primitive values', () => {
            StorageManager.set('string', 'hello');
            StorageManager.set('number', 42);
            StorageManager.set('boolean', true);

            expect(StorageManager.get('string')).toBe('hello');
            expect(StorageManager.get('number')).toBe(42);
            expect(StorageManager.get('boolean')).toBe(true);
        });

        test('should handle null values', () => {
            StorageManager.set('null', null);
            expect(StorageManager.get('null')).toBe(null);
        });
    });

    describe('remove', () => {
        test('should remove a stored value', () => {
            StorageManager.set('test', 'value');
            StorageManager.remove('test');
            expect(StorageManager.get('test')).toBe(null);
        });

        test('should return true after successful removal', () => {
            StorageManager.set('test', 'value');
            const result = StorageManager.remove('test');
            expect(result).toBe(true);
        });
    });

    describe('clear', () => {
        test('should clear all app storage', () => {
            StorageManager.set('test1', 'value1');
            StorageManager.set('test2', 'value2');
            
            StorageManager.clear();
            
            expect(StorageManager.get('test1')).toBe(null);
            expect(StorageManager.get('test2')).toBe(null);
        });

        test('should not affect other localStorage items', () => {
            localStorage.setItem('other_key', 'other_value');
            StorageManager.set('test', 'value');
            
            StorageManager.clear();
            
            expect(localStorage.getItem('other_key')).toBe('other_value');
        });
    });

    describe('getUsedSpace', () => {
        test('should calculate used space', () => {
            StorageManager.set('test', 'a'.repeat(100));
            const space = StorageManager.getUsedSpace();
            expect(space).toBeGreaterThan(0);
        });
    });

    describe('saveUserData and getUserData', () => {
        test('should save and retrieve user data', () => {
            const userData = {
                name: 'Test User',
                age: 30
            };
            
            StorageManager.saveUserData(userData);
            const result = StorageManager.getUserData();
            
            expect(result.name).toBe('Test User');
            expect(result.age).toBe(30);
            expect(result.updatedAt).toBeDefined();
        });
    });

    describe('saveSettings and getSettings', () => {
        test('should save and retrieve settings', () => {
            const settings = {
                theme: 'dark',
                language: 'en-US'
            };
            
            StorageManager.saveSettings(settings);
            const result = StorageManager.getSettings();
            
            expect(result.theme).toBe('dark');
            expect(result.language).toBe('en-US');
        });

        test('should return default settings when none saved', () => {
            const result = StorageManager.getSettings();
            
            expect(result.theme).toBe('light');
            expect(result.language).toBe('zh-CN');
            expect(result.notifications).toBe(true);
        });
    });

    describe('saveReminders and getReminders', () => {
        test('should save and retrieve reminders', () => {
            const reminders = {
                water: 'set',
                meal: 'set',
                weight: null
            };
            
            StorageManager.saveReminders(reminders);
            const result = StorageManager.getReminders();
            
            expect(result.water).toBe('set');
            expect(result.meal).toBe('set');
            expect(result.weight).toBe(null);
        });

        test('should return default reminders when none saved', () => {
            const result = StorageManager.getReminders();
            
            expect(result.water).toBe(null);
            expect(result.meal).toBe(null);
            expect(result.weight).toBe(null);
        });
    });
});
