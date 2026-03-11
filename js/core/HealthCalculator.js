import AppConfig from '../core/config.js';

export class HealthCalculator {
    static calculateBMI(weight, height) {
        if (typeof weight !== 'number' || weight <= 0) {
            throw new Error('体重必须是正数');
        }
        if (typeof height !== 'number' || height <= 0) {
            throw new Error('身高必须是正数');
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        let status, level;
        
        if (bmi < AppConfig.HEALTH.BMI.UNDERWEIGHT) {
            status = '偏瘦';
            level = 'warning';
        } else if (bmi < AppConfig.HEALTH.BMI.NORMAL) {
            status = '正常';
            level = 'normal';
        } else if (bmi < AppConfig.HEALTH.BMI.OVERWEIGHT) {
            status = '超重';
            level = 'warning';
        } else {
            status = '肥胖';
            level = 'danger';
        }
        
        return {
            value: parseFloat(bmi.toFixed(1)),
            status,
            level
        };
    }

    static calculateBMR(weight, height, age, gender) {
        if (gender === 'male') {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    static calculateBFP(bmi, age, gender) {
        let bfp;
        if (gender === 'male') {
            bfp = 1.20 * bmi + 0.23 * age - 16.2;
        } else {
            bfp = 1.20 * bmi + 0.23 * age - 5.4;
        }
        
        let status, level;
        const thresholds = AppConfig.HEALTH.BFP[gender.toUpperCase()];
        
        if (bfp < thresholds.LOW) {
            status = '过低';
            level = 'warning';
        } else if (bfp < thresholds.HEALTHY) {
            status = '健康';
            level = 'normal';
        } else if (bfp < thresholds.HIGH) {
            status = '偏高';
            level = 'warning';
        } else {
            status = '肥胖';
            level = 'danger';
        }
        
        return {
            value: parseFloat(bfp.toFixed(1)),
            status,
            level
        };
    }

    static calculateIdealWeight(height) {
        const heightInMeters = height / 100;
        const min = AppConfig.HEALTH.BMI.UNDERWEIGHT * Math.pow(heightInMeters, 2);
        const max = AppConfig.HEALTH.BMI.NORMAL * Math.pow(heightInMeters, 2);
        
        return {
            min: parseFloat(min.toFixed(1)),
            max: parseFloat(max.toFixed(1))
        };
    }

    static calculateTDEE(bmr, activityLevel = AppConfig.HEALTH.ACTIVITY_LEVEL) {
        return Math.round(bmr * activityLevel);
    }

    static calculateAllMetrics(weight, height, age, gender) {
        const bmiResult = this.calculateBMI(weight, height);
        const bmr = this.calculateBMR(weight, height, age, gender);
        const bfpResult = this.calculateBFP(bmiResult.value, age, gender);
        const idealWeight = this.calculateIdealWeight(height);
        const tdee = this.calculateTDEE(bmr);
        
        return {
            bmi: bmiResult,
            bmr: Math.round(bmr),
            bfp: bfpResult,
            idealWeight,
            tdee,
            activityLevel: AppConfig.HEALTH.ACTIVITY_LEVEL
        };
    }

    static getBMICategory(bmi) {
        if (bmi < 18.5) return 'underweight';
        if (bmi < 24) return 'normal';
        if (bmi < 28) return 'overweight';
        return 'obese';
    }

    static getHealthRisk(bmi) {
        if (bmi < 18.5) return '营养不良风险';
        if (bmi < 24) return '健康';
        if (bmi < 28) return '心血管疾病风险增加';
        return '多种疾病高风险';
    }
}

export default HealthCalculator;
