import HealthCalculator from '../js/core/HealthCalculator.js';

describe('HealthCalculator', () => {
    describe('calculateBMI', () => {
        test('should calculate BMI correctly for normal weight', () => {
            const result = HealthCalculator.calculateBMI(70, 175);
            expect(result.value).toBeCloseTo(22.9, 1);
            expect(result.status).toBe('正常');
            expect(result.level).toBe('normal');
        });

        test('should identify underweight', () => {
            const result = HealthCalculator.calculateBMI(50, 175);
            expect(result.status).toBe('偏瘦');
            expect(result.level).toBe('warning');
        });

        test('should identify overweight', () => {
            const result = HealthCalculator.calculateBMI(80, 175);
            expect(result.status).toBe('超重');
            expect(result.level).toBe('warning');
        });

        test('should identify obesity', () => {
            const result = HealthCalculator.calculateBMI(100, 175);
            expect(result.status).toBe('肥胖');
            expect(result.level).toBe('danger');
        });

        test('should throw error for invalid weight', () => {
            expect(() => HealthCalculator.calculateBMI(-70, 175)).toThrow('体重必须是正数');
            expect(() => HealthCalculator.calculateBMI(0, 175)).toThrow('体重必须是正数');
        });

        test('should throw error for invalid height', () => {
            expect(() => HealthCalculator.calculateBMI(70, -175)).toThrow('身高必须是正数');
            expect(() => HealthCalculator.calculateBMI(70, 0)).toThrow('身高必须是正数');
        });
    });

    describe('calculateBMR', () => {
        test('should calculate BMR correctly for male', () => {
            const bmr = HealthCalculator.calculateBMR(70, 175, 30, 'male');
            expect(bmr).toBeCloseTo(1673.75, 0);
        });

        test('should calculate BMR correctly for female', () => {
            const bmr = HealthCalculator.calculateBMR(60, 165, 30, 'female');
            expect(bmr).toBeCloseTo(1366.25, 0);
        });
    });

    describe('calculateBFP', () => {
        test('should calculate body fat percentage for male', () => {
            const result = HealthCalculator.calculateBFP(22.9, 30, 'male');
            expect(result.value).toBeCloseTo(15.7, 1);
        });

        test('should calculate body fat percentage for female', () => {
            const result = HealthCalculator.calculateBFP(22.9, 30, 'female');
            expect(result.value).toBeCloseTo(26.5, 1);
        });

        test('should identify low body fat for male', () => {
            const result = HealthCalculator.calculateBFP(18, 25, 'male');
            expect(result.status).toBe('过低');
        });

        test('should identify healthy body fat for female', () => {
            const result = HealthCalculator.calculateBFP(22, 30, 'female');
            expect(result.status).toBe('健康');
        });
    });

    describe('calculateIdealWeight', () => {
        test('should calculate ideal weight range correctly', () => {
            const result = HealthCalculator.calculateIdealWeight(175);
            expect(result.min).toBeCloseTo(56.7, 1);
            expect(result.max).toBeCloseTo(73.5, 1);
        });
    });

    describe('calculateTDEE', () => {
        test('should calculate TDEE with default activity level', () => {
            const tdee = HealthCalculator.calculateTDEE(1674);
            expect(tdee).toBeCloseTo(2595, 0);
        });

        test('should calculate TDEE with custom activity level', () => {
            const tdee = HealthCalculator.calculateTDEE(1674, 1.2);
            expect(tdee).toBeCloseTo(2009, 0);
        });
    });

    describe('calculateAllMetrics', () => {
        test('should return all health metrics', () => {
            const metrics = HealthCalculator.calculateAllMetrics(70, 175, 30, 'male');
            
            expect(metrics).toHaveProperty('bmi');
            expect(metrics).toHaveProperty('bmr');
            expect(metrics).toHaveProperty('bfp');
            expect(metrics).toHaveProperty('idealWeight');
            expect(metrics).toHaveProperty('tdee');
            
            expect(metrics.bmi.value).toBeCloseTo(22.9, 1);
            expect(metrics.bmr).toBeGreaterThan(0);
        });
    });

    describe('getBMICategory', () => {
        test('should return correct category for underweight', () => {
            expect(HealthCalculator.getBMICategory(17)).toBe('underweight');
        });

        test('should return correct category for normal', () => {
            expect(HealthCalculator.getBMICategory(22)).toBe('normal');
        });

        test('should return correct category for overweight', () => {
            expect(HealthCalculator.getBMICategory(26)).toBe('overweight');
        });

        test('should return correct category for obese', () => {
            expect(HealthCalculator.getBMICategory(32)).toBe('obese');
        });
    });

    describe('getHealthRisk', () => {
        test('should return correct risk for underweight', () => {
            expect(HealthCalculator.getHealthRisk(17)).toBe('营养不良风险');
        });

        test('should return correct risk for normal', () => {
            expect(HealthCalculator.getHealthRisk(22)).toBe('健康');
        });

        test('should return correct risk for overweight', () => {
            expect(HealthCalculator.getHealthRisk(26)).toBe('心血管疾病风险增加');
        });

        test('should return correct risk for obese', () => {
            expect(HealthCalculator.getHealthRisk(32)).toBe('多种疾病高风险');
        });
    });
});
