// 工具函数
class Utils {
    static debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    static showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: #1f2937;
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
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    static createConfetti() {
        const colors = ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            document.body.appendChild(confetti);
            
            const angle = (Math.PI * 2 * i) / 50;
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
}

// 实验室网站主应用
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
        this.init();
    }

    init() {
        this.createParticles();
        this.setupEventListeners();
        this.initModules();
    }

    // 创建粒子背景
    createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 10 + 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            container.appendChild(particle);
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 侧边栏切换
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        const sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => this.toggleSidebar());
        }

        // 隐私模式切换
        const privacyToggle = document.getElementById('privacyToggle');
        if (privacyToggle) {
            privacyToggle.addEventListener('click', () => this.togglePrivacy());
        }

        const sidebarPrivacyToggle = document.getElementById('sidebarPrivacyToggle');
        if (sidebarPrivacyToggle) {
            sidebarPrivacyToggle.addEventListener('click', () => this.togglePrivacy());
        }

        // 彩蛋按钮
        const easterEgg = document.getElementById('easterEgg');
        if (easterEgg) {
            easterEgg.addEventListener('click', () => this.triggerEasterEgg());
        }

        // 侧边栏标签切换
        const sidebarTabs = document.querySelectorAll('.sidebar-tab[data-tab]');
        sidebarTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId, e);
            });
        });

        // 首页按钮切换
        const heroButtons = document.querySelectorAll('[data-action="switch-tab"]');
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = button.getAttribute('data-target');
                this.switchTab(tabId, e);
            });
        });

        // 窗口大小变化
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 200));

        // 身体部位点击
        const bodyParts = document.querySelectorAll('.body-part');
        bodyParts.forEach(part => {
            part.addEventListener('click', () => {
                const organ = part.getAttribute('data-organ');
                this.showOrganDetail(organ);
            });
        });

        // 推荐卡片点击
        const recCards = document.querySelectorAll('.rec-card');
        recCards.forEach(card => {
            card.addEventListener('click', () => {
                const organ = card.getAttribute('data-organ');
                if (organ) {
                    this.showOrganDetail(organ);
                }
            });
        });

        // 计算按钮
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateAll(true));
        }

        // 健康提醒按钮
        const setWaterReminderBtn = document.getElementById('setWaterReminderBtn');
        if (setWaterReminderBtn) {
            setWaterReminderBtn.addEventListener('click', () => this.setWaterReminder());
        }

        const setMealRemindersBtn = document.getElementById('setMealRemindersBtn');
        if (setMealRemindersBtn) {
            setMealRemindersBtn.addEventListener('click', () => this.setMealReminders());
        }

        const setWeightReminderBtn = document.getElementById('setWeightReminderBtn');
        if (setWeightReminderBtn) {
            setWeightReminderBtn.addEventListener('click', () => this.setWeightReminder());
        }

        // 卡路里计算按钮
        const calculateCaloriesBtn = document.getElementById('calculateCaloriesBtn');
        if (calculateCaloriesBtn) {
            calculateCaloriesBtn.addEventListener('click', () => this.calculateCalories());
        }

        // 语言切换
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.toggleLanguage());
        }
    }

    // 切换标签页
    switchTab(tabId, event) {
        // 移除所有活动状态
        document.querySelectorAll('.sidebar-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // 添加活动状态
        const activeTab = event.target.closest('.sidebar-tab');
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        if (tabId === 'home') {
            this.showHomePage();
        } else {
            const tabContent = document.getElementById(`tab-${tabId}`);
            if (tabContent) {
                tabContent.classList.add('active');
                this.hideHomePage();
            }
        }

        this.currentTab = tabId;
        this.toggleSidebar();
    }

    // 显示首页
    showHomePage() {
        const homePage = document.getElementById('homePage');
        if (homePage) {
            homePage.style.display = 'block';
        }
    }

    // 隐藏首页
    hideHomePage() {
        const homePage = document.getElementById('homePage');
        if (homePage) {
            homePage.style.display = 'none';
        }
    }

    // 切换侧边栏
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
            this.isSidebarOpen = sidebar.classList.contains('open');
        }
    }

    // 切换隐私模式
    togglePrivacy() {
        const toggle = document.querySelector('.toggle-switch');
        if (toggle) {
            toggle.classList.toggle('active');
            this.isPrivacyMode = toggle.classList.contains('active');
            Utils.showToast(this.isPrivacyMode ? '隐私模式已开启' : '隐私模式已关闭');
        }
    }

    // 触发彩蛋
    triggerEasterEgg() {
        Utils.createConfetti();
        Utils.showToast('🎉 实验室彩蛋触发！');
    }

    // 处理窗口大小变化
    handleResize() {
        // 响应式调整
        if (window.innerWidth <= 768 && this.isSidebarOpen) {
            this.toggleSidebar();
        }
    }

    // 初始化各功能模块
    initModules() {
        // 身体数据实验室模块
        this.initBodyLab();
        
        // 人体解剖学模块
        this.initBodyAnatomy();
        
        // 生物化学分析模块
        this.initChemistry();
        
        // 消化系统模块
        this.initDigestion();
        
        // 健康推荐模块
        this.initRecommendations();
        
        // 像素人体模块
        this.initPixelBody();
        
        // 健康提醒模块
        this.initReminders();
        
        // 初始化图表
        this.initCharts();
    }

    // 初始化图表
    initCharts() {
        // 简单的图表初始化
        const canvasElements = document.querySelectorAll('canvas');
        canvasElements.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // 绘制占位图表
                ctx.fillStyle = '#f3f4f6';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#6b7280';
                ctx.font = '14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('图表功能开发中...', canvas.width / 2, canvas.height / 2);
            }
        });
    }

    // 身体数据实验室模块
    initBodyLab() {
        // 实现身体数据输入和分析功能
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        const ageInput = document.getElementById('age');
        const genderSelect = document.getElementById('gender');
        const waistInput = document.getElementById('waist');
        const goalSelect = document.getElementById('goal');

        const inputs = [heightInput, weightInput, ageInput, waistInput];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.calculateAll());
            }
        });

        if (genderSelect) {
            genderSelect.addEventListener('change', () => this.calculateAll());
        }

        if (goalSelect) {
            goalSelect.addEventListener('change', () => this.calculateAll());
        }
    }

    // 计算所有健康指标
    calculateAll(showToastFlag = false) {
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const waist = parseFloat(document.getElementById('waist').value);

        if (!height || !weight || !age) {
            if (showToastFlag) {
                Utils.showToast('请填写完整的身体数据');
            }
            return;
        }

        if (height < 50 || height > 250) {
            if (showToastFlag) {
                Utils.showToast('身高请在 50-250cm 之间');
            }
            return;
        }

        if (weight < 10 || weight > 300) {
            if (showToastFlag) {
                Utils.showToast('体重请在 10-300kg 之间');
            }
            return;
        }

        if (age < 1 || age > 150) {
            if (showToastFlag) {
                Utils.showToast('年龄请在 1-150 岁之间');
            }
            return;
        }

        // 计算BMI
        const bmi = weight / Math.pow(height / 100, 2);
        const bmiValue = document.getElementById('bmiValue');
        const bmiStatus = document.getElementById('bmiStatus');

        if (bmiValue && bmiStatus) {
            bmiValue.textContent = bmi.toFixed(1);
            
            if (bmi < 18.5) {
                bmiStatus.textContent = '偏瘦';
                bmiStatus.className = 'metric-status status-warning';
            } else if (bmi < 24) {
                bmiStatus.textContent = '正常';
                bmiStatus.className = 'metric-status status-good';
            } else if (bmi < 28) {
                bmiStatus.textContent = '超重';
                bmiStatus.className = 'metric-status status-warning';
            } else {
                bmiStatus.textContent = '肥胖';
                bmiStatus.className = 'metric-status status-danger';
            }
        }

        // 计算基础代谢率 (BMR) - Mifflin-St Jeor方程
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const bmrValue = document.getElementById('bmrValue');
        if (bmrValue) {
            bmrValue.textContent = Math.round(bmr);
        }

        // 计算体脂率 (BFP) - 基于BMI估算
        let bfp;
        if (gender === 'male') {
            bfp = 1.20 * bmi + 0.23 * age - 16.2;
        } else {
            bfp = 1.20 * bmi + 0.23 * age - 5.4;
        }

        const bfpValue = document.getElementById('bfpValue');
        const bfpStatus = document.getElementById('bfpStatus');

        if (bfpValue && bfpStatus) {
            bfpValue.textContent = bfp.toFixed(1) + '%';
            
            if (gender === 'male') {
                if (bfp < 10) {
                    bfpStatus.textContent = '过低';
                    bfpStatus.className = 'metric-status status-warning';
                } else if (bfp < 20) {
                    bfpStatus.textContent = '健康';
                    bfpStatus.className = 'metric-status status-good';
                } else if (bfp < 25) {
                    bfpStatus.textContent = '偏高';
                    bfpStatus.className = 'metric-status status-warning';
                } else {
                    bfpStatus.textContent = '肥胖';
                    bfpStatus.className = 'metric-status status-danger';
                }
            } else {
                if (bfp < 18) {
                    bfpStatus.textContent = '过低';
                    bfpStatus.className = 'metric-status status-warning';
                } else if (bfp < 28) {
                    bfpStatus.textContent = '健康';
                    bfpStatus.className = 'metric-status status-good';
                } else if (bfp < 33) {
                    bfpStatus.textContent = '偏高';
                    bfpStatus.className = 'metric-status status-warning';
                } else {
                    bfpStatus.textContent = '肥胖';
                    bfpStatus.className = 'metric-status status-danger';
                }
            }
        }

        // 计算理想体重范围 (BMI 18.5-24)
        const idealWeightMin = 18.5 * Math.pow(height / 100, 2);
        const idealWeightMax = 24 * Math.pow(height / 100, 2);
        const idealWeight = document.getElementById('idealWeight');

        if (idealWeight) {
            idealWeight.textContent = `${idealWeightMin.toFixed(1)}-${idealWeightMax.toFixed(1)}`;
        }

        // 计算每日总能量消耗 (TDEE)
        const activityLevel = 1.55; // 中等活动水平
        const tdee = bmr * activityLevel;
        const tdeeValue = document.getElementById('tdeeValue');
        const tdeeStatus = document.getElementById('tdeeStatus');

        if (tdeeValue && tdeeStatus) {
            tdeeValue.textContent = Math.round(tdee);
            tdeeStatus.textContent = '维持体重';
        }

        // 计算METs
        const metValue = document.getElementById('metValue');
        if (metValue) {
            metValue.textContent = activityLevel.toFixed(1);
        }

        // 更新每日卡路里需求
        const dailyCalories = document.getElementById('dailyCalories');
        if (dailyCalories) {
            dailyCalories.textContent = `每日卡路里需求: ${Math.round(tdee)} kcal`;
        }

        if (showToastFlag) {
            Utils.showToast('分析完成！');
        }
    }

    // 人体解剖学模块
    initBodyAnatomy() {
        // 已经在setupEventListeners中处理
    }

    // 显示器官详情
    showOrganDetail(organ) {
        const organInfo = {
            brain: {
                title: '大脑',
                desc: '大脑是人体的控制中心，负责处理感觉信息、控制运动、思考、记忆和情感。'
            },
            heart: {
                title: '心脏',
                desc: '心脏是一个肌肉泵，负责将血液输送到全身各个组织和器官。'
            },
            lung: {
                title: '肺',
                desc: '肺是呼吸系统的主要器官，负责气体交换，将氧气输送到血液中，同时排出二氧化碳。'
            },
            liver: {
                title: '肝脏',
                desc: '肝脏是人体最大的内脏器官，负责代谢、解毒、储存糖原等多种功能。'
            },
            muscle: {
                title: '肌肉',
                desc: '肌肉负责身体的运动，包括骨骼肌、平滑肌和心肌。'
            },
            digestive: {
                title: '消化系统',
                desc: '消化系统负责食物的消化和吸收，包括口腔、食道、胃、小肠和大肠。'
            },
            stomach: {
                title: '胃',
                desc: '胃负责储存和初步消化食物，分泌胃酸和消化酶。'
            },
            intestine: {
                title: '肠道',
                desc: '肠道负责吸收营养物质和排出废物，包括小肠和大肠。'
            },
            neck: {
                title: '颈部',
                desc: '颈部连接头部和躯干，包含食道、气管、血管和神经。'
            }
        };

        const info = organInfo[organ] || { title: '未知器官', desc: '请选择一个器官查看详情' };
        const organInfoElement = document.getElementById('organInfo');
        if (organInfoElement) {
            const organTitle = document.getElementById('organTitle');
            const organDesc = document.getElementById('organDesc');
            if (organTitle && organDesc) {
                organTitle.textContent = info.title;
                organDesc.textContent = info.desc;
            }
        }
    }

    // 生物化学分析模块
    initChemistry() {
        // 生成元素周期表
        this.generatePeriodicTable();
    }

    // 生成元素周期表
    generatePeriodicTable() {
        const periodicTable = document.getElementById('periodicTable');
        if (!periodicTable) return;

        const elements = [
            { symbol: 'H', name: '氢', atomicNumber: 1, group: 1, period: 1, category: 'nonmetal' },
            { symbol: 'C', name: '碳', atomicNumber: 6, group: 14, period: 2, category: 'nonmetal' },
            { symbol: 'N', name: '氮', atomicNumber: 7, group: 15, period: 2, category: 'nonmetal' },
            { symbol: 'O', name: '氧', atomicNumber: 8, group: 16, period: 2, category: 'nonmetal' },
            { symbol: 'Na', name: '钠', atomicNumber: 11, group: 1, period: 3, category: 'alkali' },
            { symbol: 'Mg', name: '镁', atomicNumber: 12, group: 2, period: 3, category: 'alkaline' },
            { symbol: 'P', name: '磷', atomicNumber: 15, group: 15, period: 3, category: 'nonmetal' },
            { symbol: 'S', name: '硫', atomicNumber: 16, group: 16, period: 3, category: 'nonmetal' },
            { symbol: 'Cl', name: '氯', atomicNumber: 17, group: 17, period: 3, category: 'halogen' },
            { symbol: 'K', name: '钾', atomicNumber: 19, group: 1, period: 4, category: 'alkali' },
            { symbol: 'Ca', name: '钙', atomicNumber: 20, group: 2, period: 4, category: 'alkaline' },
            { symbol: 'Fe', name: '铁', atomicNumber: 26, group: 8, period: 4, category: 'transition' },
            { symbol: 'Zn', name: '锌', atomicNumber: 30, group: 12, period: 4, category: 'transition' },
            { symbol: 'Cu', name: '铜', atomicNumber: 29, group: 11, period: 4, category: 'transition' },
            { symbol: 'I', name: '碘', atomicNumber: 53, group: 17, period: 5, category: 'halogen' }
        ];

        periodicTable.innerHTML = '';
        elements.forEach(element => {
            const elementDiv = document.createElement('div');
            elementDiv.className = `element ${element.category}`;
            elementDiv.style.cssText = `
                width: 60px;
                height: 60px;
                border: 1px solid var(--border);
                border-radius: var(--border-radius);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 5px;
                cursor: pointer;
                transition: var(--transition);
                background: white;
            `;
            elementDiv.innerHTML = `
                <div style="font-size: 0.75rem; color: var(--text-light);">${element.atomicNumber}</div>
                <div style="font-size: 1.25rem; font-weight: 700;">${element.symbol}</div>
                <div style="font-size: 0.625rem; color: var(--text-light);">${element.name}</div>
            `;
            elementDiv.addEventListener('click', () => {
                Utils.showToast(`${element.name} (${element.symbol}): 原子序数 ${element.atomicNumber}`);
            });
            periodicTable.appendChild(elementDiv);
        });
    }

    // 消化系统模块
    initDigestion() {
        // 实现消化系统时间轴功能
    }

    // 健康推荐模块
    initRecommendations() {
        const recommendations = document.getElementById('recommendations');
        if (!recommendations) return;

        const recData = [
            {
                title: '均衡饮食',
                desc: '摄入多样化的食物，包括水果、蔬菜、全谷物、 lean蛋白质和健康脂肪。',
                icon: '🍎',
                tags: ['营养', '健康']
            },
            {
                title: '规律运动',
                desc: '每周至少进行150分钟中等强度的有氧运动，如快走、游泳或骑自行车。',
                icon: '🏃',
                tags: ['运动', ' fitness']
            },
            {
                title: '充足睡眠',
                desc: '每天保证7-9小时的高质量睡眠，有助于身体恢复和免疫系统功能。',
                icon: '😴',
                tags: ['睡眠', '恢复']
            },
            {
                title: '压力管理',
                desc: '通过冥想、深呼吸或瑜伽等方式减轻压力，保持心理健康。',
                icon: '🧘',
                tags: ['心理健康', '压力']
            }
        ];

        recommendations.innerHTML = '';
        recData.forEach(rec => {
            const recCard = document.createElement('div');
            recCard.className = 'rec-card';
            recCard.style.cssText = `
                background: white;
                border-radius: var(--border-radius-lg);
                padding: 1.5rem;
                box-shadow: var(--shadow);
                transition: var(--transition);
                cursor: pointer;
            `;
            recCard.innerHTML = `
                <div class="rec-image" style="font-size: 2rem; margin-bottom: 1rem;">${rec.icon}</div>
                <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem;">${rec.title}</h3>
                <p style="color: var(--text-light); margin-bottom: 1rem;">${rec.desc}</p>
                <div class="rec-tags">
                    ${rec.tags.map(tag => `<span style="background: var(--light); padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; margin-right: 0.5rem;">${tag}</span>`).join('')}
                </div>
            `;
            recCard.addEventListener('click', () => {
                Utils.showToast(`推荐: ${rec.title}`);
            });
            recommendations.appendChild(recCard);
        });
    }

    // 像素人体模块
    initPixelBody() {
        const pixelBody = document.getElementById('pixelBody');
        if (!pixelBody) return;

        // 简单的像素人体实现
        pixelBody.style.cssText = `
            width: 200px;
            height: 400px;
            position: relative;
            margin: 0 auto;
        `;

        // 创建像素器官
        const organs = [
            { name: 'brain', x: 80, y: 20, width: 40, height: 30, color: '#e5e7eb' },
            { name: 'heart', x: 85, y: 80, width: 30, height: 30, color: '#fecaca' },
            { name: 'lungs', x: 70, y: 70, width: 60, height: 40, color: '#dbeafe' },
            { name: 'liver', x: 80, y: 130, width: 40, height: 30, color: '#fde68a' },
            { name: 'stomach', x: 85, y: 170, width: 30, height: 20, color: '#fed7aa' },
            { name: 'intestines', x: 75, y: 200, width: 50, height: 60, color: '#bbf7d0' }
        ];

        organs.forEach(organ => {
            const organElement = document.createElement('div');
            organElement.className = 'pixel-organ';
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
            organElement.addEventListener('click', () => {
                this.showPixelOrganDetail(organ.name);
            });
            pixelBody.appendChild(organElement);
        });
    }

    // 显示像素器官详情
    showPixelOrganDetail(organName) {
        const organInfo = {
            brain: {
                title: '大脑',
                desc: '大脑是人体的控制中心，负责处理信息、思考和记忆。',
                metrics: [
                    { name: '重量', value: '约1.4kg' },
                    { name: '神经元数量', value: '约860亿' },
                    { name: '能量消耗', value: '约20%的身体能量' }
                ]
            },
            heart: {
                title: '心脏',
                desc: '心脏是一个肌肉泵，负责将血液输送到全身。',
                metrics: [
                    { name: '重量', value: '约250-350g' },
                    { name: '跳动频率', value: '约60-100次/分钟' },
                    { name: '每日泵血量', value: '约7000升' }
                ]
            },
            lungs: {
                title: '肺',
                desc: '肺负责气体交换，将氧气输送到血液中。',
                metrics: [
                    { name: '肺泡数量', value: '约3亿' },
                    { name: '表面积', value: '约70平方米' },
                    { name: '每日通气量', value: '约12-15升' }
                ]
            },
            liver: {
                title: '肝脏',
                desc: '肝脏是人体最大的内脏器官，负责代谢和解毒。',
                metrics: [
                    { name: '重量', value: '约1.2-1.5kg' },
                    { name: '功能数量', value: '约500种' },
                    { name: '再生能力', value: '可以再生' }
                ]
            },
            stomach: {
                title: '胃',
                desc: '胃负责初步消化食物，分泌胃酸和消化酶。',
                metrics: [
                    { name: '容量', value: '约1.5-2升' },
                    { name: 'pH值', value: '1.5-3.5' },
                    { name: '排空时间', value: '2-4小时' }
                ]
            },
            intestines: {
                title: '肠道',
                desc: '肠道负责吸收营养物质和排出废物。',
                metrics: [
                    { name: '长度', value: '小肠约6米，大肠约1.5米' },
                    { name: '菌群数量', value: '约10¹⁴个细菌' },
                    { name: '吸收面积', value: '约200平方米' }
                ]
            }
        };

        const info = organInfo[organName] || { title: '未知器官', desc: '请选择一个器官查看详情', metrics: [] };
        const pixelOrganInfo = document.getElementById('pixelOrganInfo');
        if (pixelOrganInfo) {
            const pixelOrganTitle = document.getElementById('pixelOrganTitle');
            const pixelOrganDesc = document.getElementById('pixelOrganDesc');
            const metricsContainer = document.getElementById('pixelOrganMetrics');
            
            if (pixelOrganTitle && pixelOrganDesc) {
                pixelOrganTitle.textContent = info.title;
                pixelOrganDesc.textContent = info.desc;
            }
            
            if (metricsContainer) {
                metricsContainer.innerHTML = '';
                info.metrics.forEach(metric => {
                    const metricDiv = document.createElement('div');
                    metricDiv.style.cssText = `
                        display: flex;
                        justify-content: space-between;
                        padding: 0.5rem;
                        border-bottom: 1px solid var(--border);
                    `;
                    metricDiv.innerHTML = `
                        <span style="font-weight: 600;">${metric.name}:</span>
                        <span>${metric.value}</span>
                    `;
                    metricsContainer.appendChild(metricDiv);
                });
            }
        }
    }

    // 健康提醒模块
    initReminders() {
        // 实现健康提醒功能
    }

    // 设置喝水提醒
    setWaterReminder() {
        const interval = parseInt(document.getElementById('waterInterval').value);
        const waterStatus = document.getElementById('waterStatus');

        if (!interval || interval < 15 || interval > 180) {
            Utils.showToast('请设置合理的提醒间隔（15-180分钟）');
            return;
        }

        // 清除之前的提醒
        if (this.reminders.water) {
            clearInterval(this.reminders.water);
        }

        // 设置新的提醒
        this.reminders.water = setInterval(() => {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('喝水提醒', {
                    body: '该喝水了！保持水分对健康很重要。',
                    icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=water%20drop%20icon%20simple%20clean&image_size=square'
                });
            }
            Utils.showToast('该喝水了！保持水分对健康很重要。');
        }, interval * 60 * 1000);

        if (waterStatus) {
            waterStatus.textContent = `已设置，每${interval}分钟提醒一次`;
        }

        Utils.showToast('喝水提醒已设置！');

        // 请求通知权限
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }

    // 设置 meal时间提醒
    setMealReminders() {
        const breakfastTime = document.getElementById('breakfastTime').value;
        const lunchTime = document.getElementById('lunchTime').value;
        const dinnerTime = document.getElementById('dinnerTime').value;
        const mealStatus = document.getElementById('mealStatus');

        if (!breakfastTime || !lunchTime || !dinnerTime) {
            Utils.showToast('请设置完整的 meal时间');
            return;
        }

        // 清除之前的提醒
        if (this.reminders.meal) {
            clearInterval(this.reminders.meal);
        }

        // 检查 meal时间的函数
        const checkMealTime = () => {
            const now = new Date();
            const currentTime = now.toTimeString().substring(0, 5);

            if (currentTime === breakfastTime) {
                this.showMealNotification('早餐时间', '该吃早餐了！');
            } else if (currentTime === lunchTime) {
                this.showMealNotification('午餐时间', '该吃午餐了！');
            } else if (currentTime === dinnerTime) {
                this.showMealNotification('晚餐时间', '该吃晚餐了！');
            }
        };

        // 每分钟检查一次
        this.reminders.meal = setInterval(checkMealTime, 60 * 1000);

        if (mealStatus) {
            mealStatus.textContent = `已设置：早餐 ${breakfastTime}，午餐 ${lunchTime}，晚餐 ${dinnerTime}`;
        }

        Utils.showToast(' meal时间提醒已设置！');

        // 请求通知权限
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }

    // 显示 meal通知
    showMealNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=food%20icon%20simple%20clean&image_size=square'
            });
        }
        Utils.showToast(body);
    }

    // 设置减肥提醒
    setWeightReminder() {
        const targetWeight = parseFloat(document.getElementById('targetWeight').value);
        const frequency = document.getElementById('weightReminderFrequency').value;
        const weightStatus = document.getElementById('weightStatus');

        if (!targetWeight || targetWeight < 30 || targetWeight > 200) {
            Utils.showToast('请设置合理的目标体重（30-200kg）');
            return;
        }

        // 清除之前的提醒
        if (this.reminders.weight) {
            clearInterval(this.reminders.weight);
        }

        // 根据频率设置提醒
        const interval = frequency === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

        this.reminders.weight = setInterval(() => {
            this.showWeightNotification(targetWeight);
        }, interval);

        if (weightStatus) {
            weightStatus.textContent = `已设置，${frequency === 'daily' ? '每天' : '每周'}提醒一次，目标体重：${targetWeight}kg`;
        }

        Utils.showToast('减肥提醒已设置！');

        // 请求通知权限
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }

    // 显示减肥通知
    showWeightNotification(targetWeight) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('减肥提醒', {
                body: `记得监测体重！目标体重：${targetWeight}kg`,
                icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=weight%20scale%20icon%20simple%20clean&image_size=square'
            });
        }
        Utils.showToast(`记得监测体重！目标体重：${targetWeight}kg`);
    }

    // 计算卡路里
    calculateCalories() {
        const foodName = document.getElementById('foodName').value;
        const foodWeight = parseFloat(document.getElementById('foodWeight').value);
        const calorieResult = document.getElementById('calorieResult');

        if (!foodName || !foodWeight || foodWeight <= 0) {
            Utils.showToast('请输入食物名称和重量');
            return;
        }

        // 简单的食物卡路里数据库
        const foodDatabase = {
            '苹果': 52,
            '香蕉': 89,
            '鸡蛋': 155,
            '鸡胸肉': 165,
            '米饭': 130,
            '面条': 138,
            '牛肉': 250,
            '鱼肉': 200,
            '蔬菜': 25,
            '水果': 50
        };

        // 查找食物卡路里
        let caloriesPer100g = foodDatabase[foodName] || 100; // 默认值
        const totalCalories = (caloriesPer100g * foodWeight) / 100;

        if (calorieResult) {
            calorieResult.textContent = `${foodName} (${foodWeight}g)：${totalCalories.toFixed(0)} 卡路里`;
        }

        Utils.showToast('卡路里计算完成！');
    }

    // 切换语言
    toggleLanguage() {
        Utils.showToast('语言切换功能开发中...');
    }

    // 清理资源
    cleanup() {
        // 清理定时器
        Object.values(this.reminders).forEach(timer => {
            if (timer) {
                clearInterval(timer);
            }
        });

        // 清理事件监听器
        window.removeEventListener('resize', this.handleResize);
    }
}

// 新功能模块
let newFeatures;

// 扩展功能模块
let extendedFeatures;

// 初始化应用
let labApp;
window.addEventListener('DOMContentLoaded', () => {
    labApp = new LabApp();
    
    // 初始化新功能模块
    if (typeof NewFeatures !== 'undefined') {
        newFeatures = new NewFeatures(labApp);
    }
    
    // 初始化扩展功能模块
    if (typeof ExtendedFeatures !== 'undefined') {
        extendedFeatures = new ExtendedFeatures(labApp);
    }
});

// 窗口卸载时清理
window.addEventListener('unload', () => {
    if (labApp) {
        labApp.cleanup();
    }
});

// 全局函数
function closeModal(event) {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('open');
    }
}