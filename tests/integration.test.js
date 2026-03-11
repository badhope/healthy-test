import HealthCalculator from '../js/core/HealthCalculator.js';
import SecurityValidator from '../js/core/SecurityValidator.js';
import StorageManager from '../js/core/StorageManager.js';

const mockConfig = {
    STORAGE: {
        PREFIX: 'healthy_test_',
        KEYS: {
            USER_DATA: 'user_data',
            SETTINGS: 'settings',
            REMINDERS: 'reminders'
        }
    },
    VALIDATION: {
        HEIGHT: { MIN: 50, MAX: 250 },
        WEIGHT: { MIN: 10, MAX: 300 },
        AGE: { MIN: 1, MAX: 150 }
    },
    HEALTH: {
        BMI: { UNDERWEIGHT: 18.5, NORMAL: 24, OVERWEIGHT: 28 },
        BFP: {
            MALE: { LOW: 10, HEALTHY: 20, HIGH: 25 },
            FEMALE: { LOW: 18, HEALTHY: 28, HIGH: 33 }
        },
        ACTIVITY_LEVEL: 1.55
    }
};

jest.mock('../js/core/config.js', () => ({
    default: mockConfig
}));

describe('Integration Tests: Health Workflow', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('Complete Health Analysis Workflow', () => {
        test('should perform complete health analysis with valid input', () => {
            const height = 175;
            const weight = 70;
            const age = 30;
            const gender = 'male';

            const securityResult = SecurityValidator.validateHealthInput(height, weight, age);
            expect(securityResult.valid).toBe(true);

            const metrics = HealthCalculator.calculateAllMetrics(weight, height, age, gender);

            expect(metrics.bmi.value).toBeCloseTo(22.9, 1);
            expect(metrics.bmi.status).toBe('正常');
            expect(metrics.bmr).toBeGreaterThan(0);
            expect(metrics.tdee).toBeGreaterThan(metrics.bmr);

            StorageManager.saveUserData({
                height,
                weight,
                age,
                gender,
                metrics
            });

            const savedData = StorageManager.getUserData();
            expect(savedData.height).toBe(height);
            expect(savedData.weight).toBe(weight);
            expect(savedData.metrics.bmi.value).toBeCloseTo(22.9, 1);
        });

        test('should reject malicious input and sanitize', () => {
            const maliciousInput = '<script>alert("xss")</script>';
            
            const result = SecurityValidator.validateInput(maliciousInput, 'text');
            
            expect(result.threats).toContain('XSS_DETECTED');
            expect(result.sanitized).not.toContain('<script>');
        });

        test('should handle edge cases in health calculations', () => {
            const edgeCases = [
                { height: 50, weight: 10, age: 1, gender: 'female' },
                { height: 250, weight: 300, age: 150, gender: 'male' }
            ];

            edgeCases.forEach(({ height, weight, age, gender }) => {
                const securityResult = SecurityValidator.validateHealthInput(height, weight, age);
                expect(securityResult.valid).toBe(true);

                const metrics = HealthCalculator.calculateAllMetrics(weight, height, age, gender);
                expect(metrics.bmi.value).toBeGreaterThan(0);
                expect(metrics.bmr).toBeGreaterThan(0);
            });
        });
    });

    describe('Settings and Reminders Workflow', () => {
        test('should save and retrieve user settings', () => {
            const settings = {
                theme: 'dark',
                language: 'en-US',
                notifications: true,
                privacyMode: true
            };

            StorageManager.saveSettings(settings);
            const retrieved = StorageManager.getSettings();

            expect(retrieved.theme).toBe('dark');
            expect(retrieved.language).toBe('en-US');
            expect(retrieved.notifications).toBe(true);
            expect(retrieved.privacyMode).toBe(true);
        });

        test('should save and retrieve reminders', () => {
            const reminders = {
                water: { interval: 30, enabled: true },
                meal: { breakfast: '08:00', lunch: '12:00', dinner: '18:00' },
                weight: { target: 65, frequency: 'daily' }
            };

            StorageManager.saveReminders(reminders);
            const retrieved = StorageManager.getReminders();

            expect(retrieved.water.interval).toBe(30);
            expect(retrieved.meal.breakfast).toBe('08:00');
            expect(retrieved.weight.target).toBe(65);
        });
    });

    describe('Data Persistence Workflow', () => {
        test('should persist and restore complete user session', () => {
            const sessionData = {
                user: {
                    height: 175,
                    weight: 70,
                    age: 30,
                    gender: 'male'
                },
                settings: {
                    theme: 'light',
                    language: 'zh-CN'
                },
                reminders: {
                    water: { interval: 60 }
                }
            };

            StorageManager.saveUserData(sessionData.user);
            StorageManager.saveSettings(sessionData.settings);
            StorageManager.saveReminders(sessionData.reminders);

            const restoredUser = StorageManager.getUserData();
            const restoredSettings = StorageManager.getSettings();
            const restoredReminders = StorageManager.getReminders();

            expect(restoredUser.height).toBe(sessionData.user.height);
            expect(restoredSettings.theme).toBe(sessionData.settings.theme);
            expect(restoredReminders.water.interval).toBe(sessionData.reminders.water.interval);
        });

        test('should handle storage quota and cleanup', () => {
            for (let i = 0; i < 100; i++) {
                StorageManager.set(`test_${i}`, { data: 'x'.repeat(100) });
            }

            const usedSpace = StorageManager.getUsedSpace();
            expect(usedSpace).toBeGreaterThan(0);

            StorageManager.clear();
            
            const clearedSpace = StorageManager.getUsedSpace();
            expect(clearedSpace).toBe(0);
        });
    });

    describe('Error Recovery Workflow', () => {
        test('should handle invalid data gracefully', () => {
            const invalidInputs = [
                { height: -100, weight: 70, age: 30 },
                { height: 175, weight: -50, age: 30 },
                { height: 175, weight: 70, age: -10 }
            ];

            invalidInputs.forEach(({ height, weight, age }) => {
                const result = SecurityValidator.validateHealthInput(height, weight, age);
                expect(result.valid).toBe(false);
                expect(result.errors.length).toBeGreaterThan(0);
            });
        });

        test('should handle corrupted storage data', () => {
            localStorage.setItem('healthy_test_user_data', 'invalid-json{');
            
            const result = StorageManager.getUserData();
            expect(result).toBe(null);
        });
    });

    describe('BMI Category Transitions', () => {
        test('should correctly categorize BMI across ranges', () => {
            const testCases = [
                { bmi: 16, expectedStatus: '偏瘦', expectedLevel: 'warning' },
                { bmi: 20, expectedStatus: '正常', expectedLevel: 'normal' },
                { bmi: 26, expectedStatus: '超重', expectedLevel: 'warning' },
                { bmi: 32, expectedStatus: '肥胖', expectedLevel: 'danger' }
            ];

            testCases.forEach(({ bmi, expectedStatus, expectedLevel }) => {
                const weight = bmi * 1.75 * 1.75;
                const result = HealthCalculator.calculateBMI(weight, 175);
                
                expect(result.status).toBe(expectedStatus);
                expect(result.level).toBe(expectedLevel);
            });
        });
    });

    describe('Gender-Specific Calculations', () => {
        test('should calculate different BMR for male and female', () => {
            const maleBMR = HealthCalculator.calculateBMR(70, 175, 30, 'male');
            const femaleBMR = HealthCalculator.calculateBMR(70, 175, 30, 'female');

            expect(maleBMR).toBeGreaterThan(femaleBMR);
        });

        test('should calculate different body fat percentage thresholds', () => {
            const maleResult = HealthCalculator.calculateBFP(22, 30, 'male');
            const femaleResult = HealthCalculator.calculateBFP(22, 30, 'female');

            expect(femaleResult.value).toBeGreaterThan(maleResult.value);
        });
    });
});
