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
            expect(bmr).toBeCloseTo(1648.75, 0);
        });

        test('should calculate BMR correctly for female', () => {
            const bmr = HealthCalculator.calculateBMR(60, 165, 30, 'female');
            expect(bmr).toBeCloseTo(1320.25, 0);
        });

        test('should calculate BMR for different ages', () => {
            const bmrYoung = HealthCalculator.calculateBMR(70, 175, 20, 'male');
            const bmrOld = HealthCalculator.calculateBMR(70, 175, 50, 'male');
            expect(bmrYoung).toBeGreaterThan(bmrOld);
        });
    });

    describe('calculateBFP', () => {
        test('should calculate body fat percentage for male', () => {
            const result = HealthCalculator.calculateBFP(22.9, 30, 'male');
            expect(result.value).toBeCloseTo(18.2, 1);
        });

        test('should calculate body fat percentage for female', () => {
            const result = HealthCalculator.calculateBFP(22.9, 30, 'female');
            expect(result.value).toBeCloseTo(29.0, 1);
        });

        test('should identify healthy body fat for male', () => {
            const result = HealthCalculator.calculateBFP(22.9, 30, 'male');
            expect(result.status).toBe('健康');
        });

        test('should identify healthy body fat for female', () => {
            const result = HealthCalculator.calculateBFP(22, 30, 'female');
            expect(result.status).toBe('健康');
        });

        test('should identify high body fat', () => {
            const result = HealthCalculator.calculateBFP(30, 40, 'male');
            expect(result.status).toBe('肥胖');
            expect(result.level).toBe('danger');
        });
    });

    describe('calculateIdealWeight', () => {
        test('should calculate ideal weight range correctly', () => {
            const result = HealthCalculator.calculateIdealWeight(175);
            expect(result.min).toBeCloseTo(56.7, 1);
            expect(result.max).toBeCloseTo(73.5, 1);
        });

        test('should calculate ideal weight for different heights', () => {
            const resultShort = HealthCalculator.calculateIdealWeight(160);
            const resultTall = HealthCalculator.calculateIdealWeight(180);
            expect(resultShort.max).toBeLessThan(resultTall.min);
        });
    });

    describe('calculateTDEE', () => {
        test('should calculate TDEE with default activity level', () => {
            const tdee = HealthCalculator.calculateTDEE(1648.75);
            expect(tdee).toBeCloseTo(2556, 0);
        });

        test('should calculate TDEE with custom activity level', () => {
            const tdee = HealthCalculator.calculateTDEE(1648.75, 1.2);
            expect(tdee).toBeCloseTo(1979, 0);
        });

        test('should calculate TDEE for high activity', () => {
            const tdee = HealthCalculator.calculateTDEE(1648.75, 2.0);
            expect(tdee).toBeCloseTo(3298, 0);
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

        test('should calculate metrics for female', () => {
            const metrics = HealthCalculator.calculateAllMetrics(60, 165, 30, 'female');
            
            expect(metrics.bmi.value).toBeCloseTo(22.0, 1);
            expect(metrics.bfp.value).toBeGreaterThan(20);
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
