/**
 * 应用配置管理
 * 集中管理所有应用配置项
 * @module config/app.config
 */

export const AppConfig = {
    // 应用信息
    APP: {
        NAME: 'Healthy-test 健康实验室',
        VERSION: '3.0.0',
        BUILD_DATE: '2026-03-06'
    },
    
    // API 配置
    API: {
        BASE_URL: 'https://api.healthy-test.com',
        TIMEOUT: 10000,
        RETRY_COUNT: 3
    },
    
    // 性能配置
    PERFORMANCE: {
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 100,
        CACHE_TTL: 3600000, // 1 小时
        PARTICLE_COUNT: 50,
        MAX_LISTENERS: 10
    },
    
    // UI 配置
    UI: {
        TOAST_DURATION: 3000,
        MODAL_ANIMATION_DURATION: 300,
        SIDEBAR_TRANSITION_DURATION: 300,
        NOTIFICATION_POSITION: 'top-center',
        LOADING_SPINNER_SIZE: 40
    },
    
    // 存储配置
    STORAGE: {
        PREFIX: 'healthy_test_',
        MAX_AGE: 2592000000, // 30 天
        MAX_ITEMS: 100
    },
    
    // 游戏配置 - 宠物系统
    GAME: {
        PET: {
            MAX_HEALTH: 100,
            MAX_ENERGY: 100,
            MAX_HAPPINESS: 100,
            BASE_EXPERIENCE: 0,
            DECAY_RATE: {
                HEALTH: 0.1,
                ENERGY: 0.2,
                HAPPINESS: 0.15
            }
        },
        CHALLENGE: {
            MAX_ACTIVE: 5,
            MIN_DURATION: 1,
            MAX_DURATION: 90,
            MIN_PARTICIPANTS: 1
        },
        LEVEL: {
            BASE_EXP: 100,
            GROWTH_RATE: 1.2
        }
    },
    
    // 健康指标配置
    HEALTH: {
        BMI: {
            UNDERWEIGHT: 18.5,
            NORMAL: 24,
            OVERWEIGHT: 28,
            OBESE: 32
        },
        BFP: {
            MALE: {
                ESSENTIAL: [2, 5],
                ATHLETIC: [6, 13],
                FITNESS: [14, 17],
                AVERAGE: [18, 24],
                OBESE: [25, Infinity]
            },
            FEMALE: {
                ESSENTIAL: [10, 13],
                ATHLETIC: [14, 20],
                FITNESS: [21, 24],
                AVERAGE: [25, 31],
                OBESE: [32, Infinity]
            }
        },
        WATER_INTAKE: {
            DAILY_GOAL: 2000,
            MIN_INTERVAL: 30,
            MAX_SINGLE_INTAKE: 500
        },
        SLEEP: {
            MIN_HOURS: 7,
            MAX_HOURS: 9,
            IDEAL_HOURS: 8
        },
        STEPS: {
            SEDENTARY: 5000,
            LOW_ACTIVE: 7500,
            SOMEWHAT_ACTIVE: 10000,
            ACTIVE: 12500,
            HIGHLY_ACTIVE: 15000
        }
    },
    
    // 食物数据库配置
    FOOD: {
        CATEGORIES: [
            '谷物', '蔬菜', '水果', '肉类', '海鲜',
            '奶制品', '蛋类', '豆类', '坚果', '饮料'
        ],
        MAX_ITEMS_PER_PAGE: 20,
        SEARCH_DEBOUNCE: 300
    },
    
    // 提醒配置
    REMINDER: {
        WATER: {
            ENABLED: true,
            DEFAULT_INTERVAL: 60, // 分钟
            MIN_INTERVAL: 15,
            MAX_INTERVAL: 180
        },
        MEAL: {
            ENABLED: true,
            DEFAULT_TIMES: {
                BREAKFAST: '08:00',
                LUNCH: '12:30',
                DINNER: '19:00'
            }
        },
        WEIGHT: {
            ENABLED: true,
            DEFAULT_FREQUENCY: 'weekly', // daily, weekly
            DEFAULT_TIME: '08:00'
        }
    },
    
    // 图表配置
    CHART: {
        COLORS: {
            PRIMARY: '#10b981',
            SECONDARY: '#0ea5e9',
            ACCENT: '#f59e0b',
            DANGER: '#ef4444',
            SUCCESS: '#10b981',
            WARNING: '#f59e0b'
        },
        FONT: {
            FAMILY: "'Inter', sans-serif",
            SIZE: 12
        },
        ANIMATION: {
            ENABLED: true,
            DURATION: 1000,
            EASING: 'easeOutQuart'
        }
    },
    
    // 错误处理配置
    ERROR: {
        SILENT: false,
        REPORT_TO_SERVER: false,
        SHOW_USER_FRIENDLY: true,
        LOG_LEVEL: 'warn' // debug, info, warn, error
    },
    
    // 国际化配置
    I18N: {
        DEFAULT_LANGUAGE: 'zh-CN',
        SUPPORTED_LANGUAGES: ['zh-CN', 'en-US'],
        FALLBACK_LANGUAGE: 'zh-CN'
    }
};

// 冻结配置对象，防止意外修改
Object.freeze(AppConfig);

export default AppConfig;
