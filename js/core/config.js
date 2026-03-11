const AppConfig = {
    APP: {
        NAME: 'Healthy-test 健康实验室',
        VERSION: '3.1.0',
        BUILD_DATE: '2026-03-11'
    },

    UI: {
        PARTICLE_COUNT: 50,
        TOAST_DURATION: 3000,
        DEBOUNCE_DELAY: 200,
        CONFETTI_COUNT: 50,
        SIDEBAR_BREAKPOINT: 768
    },

    VALIDATION: {
        HEIGHT: { MIN: 50, MAX: 250 },
        WEIGHT: { MIN: 10, MAX: 300 },
        AGE: { MIN: 1, MAX: 150 },
        TARGET_WEIGHT: { MIN: 30, MAX: 200 },
        WATER_INTERVAL: { MIN: 15, MAX: 180 }
    },

    HEALTH: {
        BMI: {
            UNDERWEIGHT: 18.5,
            NORMAL: 24,
            OVERWEIGHT: 28
        },
        BFP: {
            MALE: {
                LOW: 10,
                HEALTHY: 20,
                HIGH: 25
            },
            FEMALE: {
                LOW: 18,
                HEALTHY: 28,
                HIGH: 33
            }
        },
        ACTIVITY_LEVEL: 1.55
    },

    STORAGE: {
        PREFIX: 'healthy_test_',
        KEYS: {
            USER_DATA: 'user_data',
            SETTINGS: 'settings',
            REMINDERS: 'reminders'
        }
    },

    MESSAGES: {
        INVALID_HEIGHT: '身高请在 50-250cm 之间',
        INVALID_WEIGHT: '体重请在 10-300kg 之间',
        INVALID_AGE: '年龄请在 1-150 岁之间',
        INVALID_TARGET_WEIGHT: '请设置合理的目标体重（30-200kg）',
        INVALID_WATER_INTERVAL: '请设置合理的提醒间隔（15-180分钟）',
        INCOMPLETE_DATA: '请填写完整的身体数据',
        CALCULATION_COMPLETE: '分析完成！',
        PRIVACY_ON: '隐私模式已开启',
        PRIVACY_OFF: '隐私模式已关闭'
    }
};

Object.freeze(AppConfig);
Object.freeze(AppConfig.APP);
Object.freeze(AppConfig.UI);
Object.freeze(AppConfig.VALIDATION);
Object.freeze(AppConfig.HEALTH);
Object.freeze(AppConfig.STORAGE);
Object.freeze(AppConfig.MESSAGES);

export default AppConfig;
