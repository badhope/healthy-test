import AppConfig from './core/config.js';
import Utils from './core/utils.js';
import HealthCalculator from './core/HealthCalculator.js';
import ErrorHandler, { ValidationError } from './core/ErrorHandler.js';
import StorageManager from './core/StorageManager.js';

class LabApp {
    constructor() {
        this.currentTab = 'home';
        this.isPrivacyMode = false;
        this.isSidebarOpen = false;
        this.reminders = {
            water: null,
            meal: null,
            weight: null
        };
        this.elements = {};
        this.initialized = false;
    }

    async init() {
        try {
            ErrorHandler.setupGlobalHandlers();
            
            this.cacheElements();
            this.loadSavedState();
            this.createParticles();
            this.setupEventListeners();
            this.initModules();
            
            this.initialized = true;
            console.log(`${AppConfig.APP.NAME} v${AppConfig.APP.VERSION} 初始化完成`);
        } catch (error) {
            ErrorHandler.handle(error, '应用初始化失败');
        }
    }

    cacheElements() {
        const elementIds = [
            'particles', 'sidebar', 'sidebarToggle', 'sidebarClose',
            'privacyToggle', 'sidebarPrivacyToggle', 'easterEgg',
            'homePage', 'height', 'weight', 'age', 'gender', 'waist', 'goal',
            'bmiValue', 'bmiStatus', 'bmrValue', 'bfpValue', 'bfpStatus',
            'idealWeight', 'tdeeValue', 'tdeeStatus', 'metValue', 'dailyCalories',
            'waterInterval', 'waterStatus', 'breakfastTime', 'lunchTime', 'dinnerTime',
            'mealStatus', 'targetWeight', 'weightReminderFrequency', 'weightStatus',
            'foodName', 'foodWeight', 'calorieResult', 'organInfo', 'organTitle',
            'organDesc', 'pixelBody', 'pixelOrganInfo', 'pixelOrganTitle',
            'pixelOrganDesc', 'pixelOrganMetrics', 'periodicTable', 'recommendations',
            'calculateBtn', 'setWaterReminderBtn', 'setMealRemindersBtn',
            'setWeightReminderBtn', 'calculateCaloriesBtn', 'languageToggle'
        ];

        elementIds.forEach(id => {
            this.elements[id] = Utils.safeGetElement(id);
        });
    }

    loadSavedState() {
        try {
            const settings = StorageManager.getSettings();
            this.isPrivacyMode = settings.privacyMode || false;
            
            const savedReminders = StorageManager.getReminders();
            if (savedReminders) {
                this.reminders = { ...this.reminders, ...savedReminders };
            }
        } catch (error) {
            console.warn('加载保存状态失败:', error);
        }
    }

    createParticles() {
        const container = this.elements.particles;
        if (!container) return;

        const prefersReducedMotion = Utils.prefersReducedMotion();
        const particleCount = prefersReducedMotion ? 0 : AppConfig.UI.PARTICLE_COUNT;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 6}s;
            `;
            container.appendChild(particle);
        }
    }

    setupEventListeners() {
        this.setupSidebarEvents();
        this.setupPrivacyEvents();
        this.setupNavigationEvents();
        this.setupBodyLabEvents();
        this.setupReminderEvents();
        this.setupMiscEvents();
    }

    setupSidebarEvents() {
        const { sidebarToggle, sidebarClose } = this.elements;
        
        sidebarToggle?.addEventListener('click', () => this.toggleSidebar());
        sidebarClose?.addEventListener('click', () => this.toggleSidebar());
    }

    setupPrivacyEvents() {
        const { privacyToggle, sidebarPrivacyToggle } = this.elements;
        
        privacyToggle?.addEventListener('click', () => this.togglePrivacy());
        sidebarPrivacyToggle?.addEventListener('click', () => this.togglePrivacy());
    }

    setupNavigationEvents() {
        document.querySelectorAll('.sidebar-tab[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId, e);
            });
        });

        document.querySelectorAll('[data-action="switch-tab"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = button.getAttribute('data-target');
                this.switchTab(tabId, e);
            });
        });

        document.querySelectorAll('.body-part').forEach(part => {
            part.addEventListener('click', () => {
                const organ = part.getAttribute('data-organ');
                this.showOrganDetail(organ);
            });
        });

        document.querySelectorAll('.rec-card[data-organ]').forEach(card => {
            card.addEventListener('click', () => {
                const organ = card.getAttribute('data-organ');
                this.showOrganDetail(organ);
            });
        });
    }

    setupBodyLabEvents() {
        const { height, weight, age, waist, gender, goal, calculateBtn } = this.elements;
        
        [height, weight, age, waist].forEach(input => {
            input?.addEventListener('input', Utils.debounce(() => this.calculateAll(), 300));
        });

        gender?.addEventListener('change', () => this.calculateAll());
        goal?.addEventListener('change', () => this.calculateAll());
        calculateBtn?.addEventListener('click', () => this.calculateAll(true));
    }

    setupReminderEvents() {
        this.elements.setWaterReminderBtn?.addEventListener('click', () => this.setWaterReminder());
        this.elements.setMealRemindersBtn?.addEventListener('click', () => this.setMealReminders());
        this.elements.setWeightReminderBtn?.addEventListener('click', () => this.setWeightReminder());
        this.elements.calculateCaloriesBtn?.addEventListener('click', () => this.calculateCalories());
    }

    setupMiscEvents() {
        this.elements.easterEgg?.addEventListener('click', () => this.triggerEasterEgg());
        this.elements.languageToggle?.addEventListener('click', () => this.toggleLanguage());
        
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), AppConfig.UI.DEBOUNCE_DELAY));
    }

    switchTab(tabId, event) {
        document.querySelectorAll('.sidebar-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        const activeTab = event?.target?.closest('.sidebar-tab');
        activeTab?.classList.add('active');
        
        if (tabId === 'home') {
            this.showHomePage();
        } else {
            const tabContent = Utils.safeGetElement(`tab-${tabId}`);
            tabContent?.classList.add('active');
            this.hideHomePage();
        }

        this.currentTab = tabId;
        
        if (Utils.isMobile()) {
            this.toggleSidebar();
        }
    }

    showHomePage() {
        this.elements.homePage && (this.elements.homePage.style.display = 'block');
    }

    hideHomePage() {
        this.elements.homePage && (this.elements.homePage.style.display = 'none');
    }

    toggleSidebar() {
        const { sidebar } = this.elements;
        if (sidebar) {
            sidebar.classList.toggle('open');
            this.isSidebarOpen = sidebar.classList.contains('open');
        }
    }

    togglePrivacy() {
        const toggle = Utils.safeQuerySelector('.toggle-switch');
        if (toggle) {
            toggle.classList.toggle('active');
            this.isPrivacyMode = toggle.classList.contains('active');
            Utils.showToast(this.isPrivacyMode ? AppConfig.MESSAGES.PRIVACY_ON : AppConfig.MESSAGES.PRIVACY_OFF);
            
            try {
                StorageManager.saveSettings({ privacyMode: this.isPrivacyMode });
            } catch (error) {
                console.warn('保存隐私设置失败:', error);
            }
        }
    }

    triggerEasterEgg() {
        Utils.createConfetti();
        Utils.showToast('🎉 实验室彩蛋触发！');
    }

    handleResize() {
        if (Utils.isMobile() && this.isSidebarOpen) {
            this.toggleSidebar();
        }
    }

    initModules() {
        this.initBodyLab();
        this.initBodyAnatomy();
        this.initChemistry();
        this.initDigestion();
        this.initRecommendations();
        this.initPixelBody();
        this.initReminders();
        this.initCharts();
    }

    initBodyLab() {
        this.calculateAll();
    }

    calculateAll(showToastFlag = false) {
        try {
            const height = parseFloat(this.elements.height?.value);
            const weight = parseFloat(this.elements.weight?.value);
            const age = parseInt(this.elements.age?.value, 10);
            const gender = this.elements.gender?.value || 'male';

            if (!height || !weight || !age) {
                if (showToastFlag) Utils.showToast(AppConfig.MESSAGES.INCOMPLETE_DATA);
                return;
            }

            const heightValidation = Utils.validateNumber(
                height, 
                AppConfig.VALIDATION.HEIGHT.MIN, 
                AppConfig.VALIDATION.HEIGHT.MAX,
                '身高'
            );
            if (!heightValidation.valid) {
                if (showToastFlag) Utils.showToast(heightValidation.error);
                return;
            }

            const weightValidation = Utils.validateNumber(
                weight,
                AppConfig.VALIDATION.WEIGHT.MIN,
                AppConfig.VALIDATION.WEIGHT.MAX,
                '体重'
            );
            if (!weightValidation.valid) {
                if (showToastFlag) Utils.showToast(weightValidation.error);
                return;
            }

            const ageValidation = Utils.validateInteger(
                age,
                AppConfig.VALIDATION.AGE.MIN,
                AppConfig.VALIDATION.AGE.MAX,
                '年龄'
            );
            if (!ageValidation.valid) {
                if (showToastFlag) Utils.showToast(ageValidation.error);
                return;
            }

            const metrics = HealthCalculator.calculateAllMetrics(weight, height, age, gender);
            this.updateMetricsDisplay(metrics);

            if (showToastFlag) {
                Utils.showToast(AppConfig.MESSAGES.CALCULATION_COMPLETE);
            }
        } catch (error) {
            ErrorHandler.handle(error, '计算失败，请检查输入数据');
        }
    }

    updateMetricsDisplay(metrics) {
        const { bmiValue, bmiStatus, bmrValue, bfpValue, bfpStatus, 
                idealWeight, tdeeValue, tdeeStatus, metValue, dailyCalories } = this.elements;

        if (bmiValue) bmiValue.textContent = metrics.bmi.value;
        if (bmiStatus) {
            bmiStatus.textContent = metrics.bmi.status;
            bmiStatus.className = `metric-status status-${metrics.bmi.level}`;
        }

        if (bmrValue) bmrValue.textContent = metrics.bmr;

        if (bfpValue) bfpValue.textContent = `${metrics.bfp.value}%`;
        if (bfpStatus) {
            bfpStatus.textContent = metrics.bfp.status;
            bfpStatus.className = `metric-status status-${metrics.bfp.level}`;
        }

        if (idealWeight) idealWeight.textContent = `${metrics.idealWeight.min}-${metrics.idealWeight.max}`;

        if (tdeeValue) tdeeValue.textContent = metrics.tdee;
        if (tdeeStatus) tdeeStatus.textContent = '维持体重';

        if (metValue) metValue.textContent = metrics.activityLevel.toFixed(1);
        if (dailyCalories) dailyCalories.textContent = `每日卡路里需求: ${metrics.tdee} kcal`;
    }

    initBodyAnatomy() {}

    showOrganDetail(organ) {
        const organInfo = this.getOrganInfo(organ);
        const { organTitle, organDesc } = this.elements;

        if (organTitle) organTitle.textContent = organInfo.title;
        if (organDesc) organDesc.textContent = organInfo.desc;
    }

    getOrganInfo(organ) {
        const organData = {
            brain: { title: '大脑', desc: '大脑是人体的控制中心，负责处理感觉信息、控制运动、思考、记忆和情感。' },
            heart: { title: '心脏', desc: '心脏是一个肌肉泵，负责将血液输送到全身各个组织和器官。' },
            lung: { title: '肺', desc: '肺是呼吸系统的主要器官，负责气体交换，将氧气输送到血液中，同时排出二氧化碳。' },
            liver: { title: '肝脏', desc: '肝脏是人体最大的内脏器官，负责代谢、解毒、储存糖原等多种功能。' },
            muscle: { title: '肌肉', desc: '肌肉负责身体的运动，包括骨骼肌、平滑肌和心肌。' },
            digestive: { title: '消化系统', desc: '消化系统负责食物的消化和吸收，包括口腔、食道、胃、小肠和大肠。' },
            stomach: { title: '胃', desc: '胃负责储存和初步消化食物，分泌胃酸和消化酶。' },
            intestine: { title: '肠道', desc: '肠道负责吸收营养物质和排出废物，包括小肠和大肠。' },
            neck: { title: '颈部', desc: '颈部连接头部和躯干，包含食道、气管、血管和神经。' }
        };

        return organData[organ] || { title: '未知器官', desc: '请选择一个器官查看详情' };
    }

    initChemistry() {
        this.generatePeriodicTable();
    }

    generatePeriodicTable() {
        const periodicTable = this.elements.periodicTable;
        if (!periodicTable) return;

        const elements = [
            { symbol: 'H', name: '氢', atomicNumber: 1, category: 'nonmetal' },
            { symbol: 'C', name: '碳', atomicNumber: 6, category: 'nonmetal' },
            { symbol: 'N', name: '氮', atomicNumber: 7, category: 'nonmetal' },
            { symbol: 'O', name: '氧', atomicNumber: 8, category: 'nonmetal' },
            { symbol: 'Na', name: '钠', atomicNumber: 11, category: 'alkali' },
            { symbol: 'Mg', name: '镁', atomicNumber: 12, category: 'alkaline' },
            { symbol: 'P', name: '磷', atomicNumber: 15, category: 'nonmetal' },
            { symbol: 'S', name: '硫', atomicNumber: 16, category: 'nonmetal' },
            { symbol: 'Cl', name: '氯', atomicNumber: 17, category: 'halogen' },
            { symbol: 'K', name: '钾', atomicNumber: 19, category: 'alkali' },
            { symbol: 'Ca', name: '钙', atomicNumber: 20, category: 'alkaline' },
            { symbol: 'Fe', name: '铁', atomicNumber: 26, category: 'transition' },
            { symbol: 'Zn', name: '锌', atomicNumber: 30, category: 'transition' },
            { symbol: 'Cu', name: '铜', atomicNumber: 29, category: 'transition' },
            { symbol: 'I', name: '碘', atomicNumber: 53, category: 'halogen' }
        ];

        periodicTable.innerHTML = '';
        elements.forEach(element => {
            const elementDiv = document.createElement('div');
            elementDiv.className = `element ${element.category}`;
            elementDiv.setAttribute('role', 'button');
            elementDiv.setAttribute('tabindex', '0');
            elementDiv.setAttribute('aria-label', `${element.name}, 原子序数 ${element.atomicNumber}`);
            elementDiv.innerHTML = `
                <div class="atomic-number">${element.atomicNumber}</div>
                <div class="symbol">${element.symbol}</div>
                <div class="name">${element.name}</div>
            `;
            elementDiv.addEventListener('click', () => {
                Utils.showToast(`${element.name} (${element.symbol}): 原子序数 ${element.atomicNumber}`);
            });
            elementDiv.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    Utils.showToast(`${element.name} (${element.symbol}): 原子序数 ${element.atomicNumber}`);
                }
            });
            periodicTable.appendChild(elementDiv);
        });
    }

    initDigestion() {}

    initRecommendations() {
        const recommendations = this.elements.recommendations;
        if (!recommendations) return;

        const recData = [
            { title: '均衡饮食', desc: '摄入多样化的食物，包括水果、蔬菜、全谷物、lean蛋白质和健康脂肪。', icon: '🍎', tags: ['营养', '健康'] },
            { title: '规律运动', desc: '每周至少进行150分钟中等强度的有氧运动，如快走、游泳或骑自行车。', icon: '🏃', tags: ['运动', 'fitness'] },
            { title: '充足睡眠', desc: '每天保证7-9小时的高质量睡眠，有助于身体恢复和免疫系统功能。', icon: '😴', tags: ['睡眠', '恢复'] },
            { title: '压力管理', desc: '通过冥想、深呼吸或瑜伽等方式减轻压力，保持心理健康。', icon: '🧘', tags: ['心理健康', '压力'] }
        ];

        recommendations.innerHTML = '';
        recData.forEach(rec => {
            const recCard = document.createElement('div');
            recCard.className = 'rec-card';
            recCard.setAttribute('role', 'button');
            recCard.setAttribute('tabindex', '0');
            recCard.innerHTML = `
                <div class="rec-image">${rec.icon}</div>
                <h3>${rec.title}</h3>
                <p>${rec.desc}</p>
                <div class="rec-tags">
                    ${rec.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
            recCard.addEventListener('click', () => Utils.showToast(`推荐: ${rec.title}`));
            recommendations.appendChild(recCard);
        });
    }

    initPixelBody() {
        const pixelBody = this.elements.pixelBody;
        if (!pixelBody) return;

        const organs = [
            { name: 'brain', x: 80, y: 20, width: 40, height: 30, color: '#e5e7eb' },
            { name: 'heart', x: 85, y: 80, width: 30, height: 30, color: '#fecaca' },
            { name: 'lungs', x: 70, y: 70, width: 60, height: 40, color: '#dbeafe' },
            { name: 'liver', x: 80, y: 130, width: 40, height: 30, color: '#fde68a' },
            { name: 'stomach', x: 85, y: 170, width: 30, height: 20, color: '#fed7aa' },
            { name: 'intestines', x: 75, y: 200, width: 50, height: 60, color: '#bbf7d0' }
        ];

        pixelBody.innerHTML = '';
        organs.forEach(organ => {
            const organElement = document.createElement('div');
            organElement.className = 'pixel-organ';
            organElement.setAttribute('role', 'button');
            organElement.setAttribute('tabindex', '0');
            organElement.setAttribute('aria-label', organ.name);
            organElement.style.cssText = `
                position: absolute;
                left: ${organ.x}px;
                top: ${organ.y}px;
                width: ${organ.width}px;
                height: ${organ.height}px;
                background: ${organ.color};
                border: 1px solid var(--border);
                border-radius: 4px;
                cursor: pointer;
                transition: var(--transition);
            `;
            organElement.addEventListener('click', () => this.showPixelOrganDetail(organ.name));
            pixelBody.appendChild(organElement);
        });
    }

    showPixelOrganDetail(organName) {
        const organInfo = this.getPixelOrganInfo(organName);
        const { pixelOrganTitle, pixelOrganDesc, pixelOrganMetrics } = this.elements;

        if (pixelOrganTitle) pixelOrganTitle.textContent = organInfo.title;
        if (pixelOrganDesc) pixelOrganDesc.textContent = organInfo.desc;

        if (pixelOrganMetrics) {
            pixelOrganMetrics.innerHTML = organInfo.metrics.map(metric => `
                <div class="metric-row">
                    <span class="metric-name">${metric.name}:</span>
                    <span class="metric-value">${metric.value}</span>
                </div>
            `).join('');
        }
    }

    getPixelOrganInfo(organName) {
        const organData = {
            brain: { title: '大脑', desc: '大脑是人体的控制中心，负责处理信息、思考和记忆。', metrics: [{ name: '重量', value: '约1.4kg' }, { name: '神经元数量', value: '约860亿' }, { name: '能量消耗', value: '约20%的身体能量' }] },
            heart: { title: '心脏', desc: '心脏是一个肌肉泵，负责将血液输送到全身。', metrics: [{ name: '重量', value: '约250-350g' }, { name: '跳动频率', value: '约60-100次/分钟' }, { name: '每日泵血量', value: '约7000升' }] },
            lungs: { title: '肺', desc: '肺负责气体交换，将氧气输送到血液中。', metrics: [{ name: '肺泡数量', value: '约3亿' }, { name: '表面积', value: '约70平方米' }, { name: '每日通气量', value: '约12-15升' }] },
            liver: { title: '肝脏', desc: '肝脏是人体最大的内脏器官，负责代谢和解毒。', metrics: [{ name: '重量', value: '约1.2-1.5kg' }, { name: '功能数量', value: '约500种' }, { name: '再生能力', value: '可以再生' }] },
            stomach: { title: '胃', desc: '胃负责初步消化食物，分泌胃酸和消化酶。', metrics: [{ name: '容量', value: '约1.5-2升' }, { name: 'pH值', value: '1.5-3.5' }, { name: '排空时间', value: '2-4小时' }] },
            intestines: { title: '肠道', desc: '肠道负责吸收营养物质和排出废物。', metrics: [{ name: '长度', value: '小肠约6米，大肠约1.5米' }, { name: '菌群数量', value: '约10¹⁴个细菌' }, { name: '吸收面积', value: '约200平方米' }] }
        };

        return organData[organName] || { title: '未知器官', desc: '请选择一个器官查看详情', metrics: [] };
    }

    initReminders() {}

    setWaterReminder() {
        try {
            const interval = parseInt(this.elements.waterInterval?.value, 10);

            const validation = Utils.validateInteger(
                interval,
                AppConfig.VALIDATION.WATER_INTERVAL.MIN,
                AppConfig.VALIDATION.WATER_INTERVAL.MAX,
                '提醒间隔'
            );

            if (!validation.valid) {
                Utils.showToast(validation.error);
                return;
            }

            if (this.reminders.water) {
                clearInterval(this.reminders.water);
            }

            this.reminders.water = setInterval(() => {
                this.showNotification('喝水提醒', '该喝水了！保持水分对健康很重要。');
            }, interval * 60 * 1000);

            if (this.elements.waterStatus) {
                this.elements.waterStatus.textContent = `已设置，每${interval}分钟提醒一次`;
            }

            StorageManager.saveReminders(this.reminders);
            Utils.showToast('喝水提醒已设置！');
            this.requestNotificationPermission();
        } catch (error) {
            ErrorHandler.handle(error, '设置提醒失败');
        }
    }

    setMealReminders() {
        try {
            const breakfastTime = this.elements.breakfastTime?.value;
            const lunchTime = this.elements.lunchTime?.value;
            const dinnerTime = this.elements.dinnerTime?.value;

            if (!breakfastTime || !lunchTime || !dinnerTime) {
                Utils.showToast('请设置完整的用餐时间');
                return;
            }

            if (this.reminders.meal) {
                clearInterval(this.reminders.meal);
            }

            const checkMealTime = () => {
                const currentTime = new Date().toTimeString().substring(0, 5);

                if (currentTime === breakfastTime) {
                    this.showNotification('早餐时间', '该吃早餐了！');
                } else if (currentTime === lunchTime) {
                    this.showNotification('午餐时间', '该吃午餐了！');
                } else if (currentTime === dinnerTime) {
                    this.showNotification('晚餐时间', '该吃晚餐了！');
                }
            };

            this.reminders.meal = setInterval(checkMealTime, 60 * 1000);

            if (this.elements.mealStatus) {
                this.elements.mealStatus.textContent = `已设置：早餐 ${breakfastTime}，午餐 ${lunchTime}，晚餐 ${dinnerTime}`;
            }

            StorageManager.saveReminders(this.reminders);
            Utils.showToast('用餐时间提醒已设置！');
            this.requestNotificationPermission();
        } catch (error) {
            ErrorHandler.handle(error, '设置提醒失败');
        }
    }

    setWeightReminder() {
        try {
            const targetWeight = parseFloat(this.elements.targetWeight?.value);
            const frequency = this.elements.weightReminderFrequency?.value;

            const validation = Utils.validateNumber(
                targetWeight,
                AppConfig.VALIDATION.TARGET_WEIGHT.MIN,
                AppConfig.VALIDATION.TARGET_WEIGHT.MAX,
                '目标体重'
            );

            if (!validation.valid) {
                Utils.showToast(validation.error);
                return;
            }

            if (this.reminders.weight) {
                clearInterval(this.reminders.weight);
            }

            const interval = frequency === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

            this.reminders.weight = setInterval(() => {
                this.showNotification('减肥提醒', `记得监测体重！目标体重：${targetWeight}kg`);
            }, interval);

            if (this.elements.weightStatus) {
                this.elements.weightStatus.textContent = `已设置，${frequency === 'daily' ? '每天' : '每周'}提醒一次，目标体重：${targetWeight}kg`;
            }

            StorageManager.saveReminders(this.reminders);
            Utils.showToast('减肥提醒已设置！');
            this.requestNotificationPermission();
        } catch (error) {
            ErrorHandler.handle(error, '设置提醒失败');
        }
    }

    showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body });
        }
        Utils.showToast(body);
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    calculateCalories() {
        try {
            const foodName = Utils.sanitizeInput(this.elements.foodName?.value || '');
            const foodWeight = parseFloat(this.elements.foodWeight?.value);

            if (!foodName || !foodWeight || foodWeight <= 0) {
                Utils.showToast('请输入食物名称和重量');
                return;
            }

            const foodDatabase = {
                '苹果': 52, '香蕉': 89, '鸡蛋': 155, '鸡胸肉': 165,
                '米饭': 130, '面条': 138, '牛肉': 250, '鱼肉': 200,
                '蔬菜': 25, '水果': 50
            };

            const caloriesPer100g = foodDatabase[foodName] || 100;
            const totalCalories = Math.round((caloriesPer100g * foodWeight) / 100);

            if (this.elements.calorieResult) {
                this.elements.calorieResult.textContent = `${foodName} (${foodWeight}g)：${totalCalories} 卡路里`;
            }

            Utils.showToast('卡路里计算完成！');
        } catch (error) {
            ErrorHandler.handle(error, '计算失败');
        }
    }

    toggleLanguage() {
        Utils.showToast('语言切换功能开发中...');
    }

    initCharts() {
        document.querySelectorAll('canvas').forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#f3f4f6';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#6b7280';
                ctx.font = '14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('图表功能开发中...', canvas.width / 2, canvas.height / 2);
            }
        });
    }

    cleanup() {
        Object.values(this.reminders).forEach(timer => {
            if (timer) clearInterval(timer);
        });

        window.removeEventListener('resize', this.handleResize);
    }
}

let labApp;

window.addEventListener('DOMContentLoaded', () => {
    labApp = new LabApp();
    labApp.init();
});

window.addEventListener('unload', () => {
    labApp?.cleanup();
});

window.closeModal = function(event) {
    const modal = document.getElementById('modal');
    modal?.classList.remove('open');
};

export default LabApp;
