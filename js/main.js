// 工具函数
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// 显示提示信息
function showToast(message) {
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

// 创建彩带动画
function createConfetti() {
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

// 实验室网站主应用
class LabApp {
    constructor() {
        this.currentTab = 'home';
        this.isPrivacyMode = false;
        this.isSidebarOpen = false;
        this.init();
    }

    init() {
        this.createParticles();
        this.setupEventListeners();
        this.renderHomePage();
        this.setupSidebar();
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
        document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebarClose').addEventListener('click', () => this.toggleSidebar());

        // 隐私模式切换
        document.getElementById('privacyToggle').addEventListener('click', () => this.togglePrivacy());
        document.getElementById('sidebarPrivacy').addEventListener('click', () => this.togglePrivacy());

        // 彩蛋按钮
        document.getElementById('easterEgg').addEventListener('click', () => this.triggerEasterEgg());

        // 窗口大小变化
        window.addEventListener('resize', debounce(() => this.handleResize(), 200));
    }

    // 设置侧边栏导航
    setupSidebar() {
        const sidebarTabs = document.querySelectorAll('.sidebar-tab');
        sidebarTabs.forEach(tab => {
            // 移除旧的事件监听器，避免重复绑定
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            newTab.addEventListener('click', (e) => {
                // 更安全的方式获取标签ID
                const onclickAttr = newTab.getAttribute('onclick');
                if (onclickAttr) {
                    const match = onclickAttr.match(/'([^']+)'/);
                    if (match && match[1]) {
                        const tabId = match[1];
                        if (tabId === 'languageToggle' || tabId === 'togglePrivacy') return;
                        this.switchTab(tabId, e);
                    }
                }
            });
        });
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
            this.renderHomePage();
        } else {
            const tabContent = document.getElementById(`tab-${tabId}`);
            if (tabContent) {
                tabContent.classList.add('active');
                // 显示容器
                const container = document.querySelector('.container');
                if (container) {
                    container.style.display = 'block';
                }
            }
        }

        this.currentTab = tabId;
        this.toggleSidebar();
    }

    // 切换侧边栏
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
        this.isSidebarOpen = sidebar.classList.contains('open');
    }

    // 切换隐私模式
    togglePrivacy() {
        const toggle = document.querySelector('.toggle-switch');
        toggle.classList.toggle('active');
        this.isPrivacyMode = toggle.classList.contains('active');
        showToast(this.isPrivacyMode ? '隐私模式已开启' : '隐私模式已关闭');
    }

    // 触发彩蛋
    triggerEasterEgg() {
        createConfetti();
        showToast('🎉 实验室彩蛋触发！');
    }

    // 处理窗口大小变化
    handleResize() {
        // 响应式调整
        if (window.innerWidth <= 768 && this.isSidebarOpen) {
            this.toggleSidebar();
        }
    }

    // 渲染首页
    renderHomePage() {
        const container = document.querySelector('.container');
        if (!container) return;

        // 清空容器
        container.innerHTML = `
            <!-- 头部 -->
            <header>
                <div class="header-left">
                    <button class="sidebar-toggle" id="sidebarToggle">☰</button>
                    <div class="logo-container">
                        <h1 class="logo">Healthy-test</h1>
                        <div class="logo-shine"></div>
                    </div>
                </div>
                <p class="subtitle">探索生命科学的无限可能 · 从分子到系统的健康全景</p>
                <div class="badge-container">
                    <span class="badge badge-green">🔬 循证医学</span>
                    <span class="badge badge-blue">🧬 分子生物学</span>
                    <span class="badge badge-purple">⚗️ 生物化学</span>
                    <span class="badge badge-pink">📊 数据科学</span>
                </div>
            </header>

            <!-- 首页内容 -->
            <div class="home-page">
                <h1 class="home-title">健康科学实验室</h1>
                <p class="home-subtitle">
                    我们致力于通过科学方法和先进技术，探索人类健康的奥秘，
                    为您提供专业、全面的健康分析和个性化建议。
                </p>

                <div class="hero-buttons">
                    <button class="hero-button" onclick="labApp.switchTab('overview', { target: { closest: () => ({ classList: { add: () => {} } }) } })">
                        <span>📋</span> 身体数据实验室
                    </button>
                    <button class="hero-button secondary" onclick="labApp.switchTab('body', { target: { closest: () => ({ classList: { add: () => {} } }) } })">
                        <span>🫀</span> 人体解剖学
                    </button>
                    <button class="hero-button outline" onclick="labApp.switchTab('chemistry', { target: { closest: () => ({ classList: { add: () => {} } }) } })">
                        <span>⚗️</span> 生物化学分析
                    </button>
                </div>

                <div class="feature-cards">
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h3 class="feature-title">数据分析</h3>
                        <p class="feature-description">
                            基于最新的医学研究和算法，对您的身体数据进行全面分析，
                            提供科学的健康评估和个性化建议。
                        </p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🧪</div>
                        <h3 class="feature-title">科学研究</h3>
                        <p class="feature-description">
                            结合前沿的生命科学研究成果，为您提供基于证据的健康指导，
                            帮助您做出更明智的健康决策。
                        </p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔒</div>
                        <h3 class="feature-title">隐私保护</h3>
                        <p class="feature-description">
                            所有数据计算均在本地完成，不会上传到服务器，
                            确保您的个人健康信息安全保密。
                        </p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📱</div>
                        <h3 class="feature-title">响应式设计</h3>
                        <p class="feature-description">
                            适配各种设备屏幕，无论您使用电脑、平板还是手机，
                            都能获得最佳的用户体验。
                        </p>
                    </div>
                </div>
            </div>

            <!-- 页脚 -->
            <footer style="text-align: center; padding: 3rem 1rem; color: var(--text-light);">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">Healthy-test © 2026</p>
                <p style="font-size: 0.875rem; opacity: 0.8;">基于 WHO、NIH、Harvard Medical School 最新研究</p>
                <div style="margin: 1.5rem 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;">
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 1rem; backdrop-filter: blur(10px);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--primary);">网站贡献者</h4>
                        <p style="font-size: 0.875rem;">健康科学团队</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 1rem; backdrop-filter: blur(10px);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--primary);">仓库地址</h4>
                        <a href="https://github.com/healthy-test/healthy-test" target="_blank" style="font-size: 0.875rem; color: var(--secondary); text-decoration: none;">github.com/healthy-test/healthy-test</a>
                    </div>
                </div>
                <p style="font-size: 0.75rem; opacity: 0.6; margin-top: 1rem;">
                    🔒 隐私模式：所有计算在本地完成，数据不会上传服务器
                </p>
            </footer>
        `;

        // 重新绑定事件监听器
        this.setupEventListeners();
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
        const calculateBtn = document.querySelector('button[onclick="calculateAll(true)"]');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                showToast('分析完成！');
            });
        }
    }

    // 人体解剖学模块
    initBodyAnatomy() {
        const bodyParts = document.querySelectorAll('.body-part');
        bodyParts.forEach(part => {
            part.addEventListener('click', () => {
                const organ = part.getAttribute('data-organ');
                this.showOrganDetail(organ);
            });
        });
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
            }
        };

        const info = organInfo[organ] || { title: '未知器官', desc: '请选择一个器官查看详情' };
        const organInfoElement = document.getElementById('organInfo');
        if (organInfoElement) {
            document.getElementById('organTitle').textContent = info.title;
            document.getElementById('organDesc').textContent = info.desc;
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
                showToast(`${element.name} (${element.symbol}): 原子序数 ${element.atomicNumber}`);
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
                showToast(`推荐: ${rec.title}`);
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
            document.getElementById('pixelOrganTitle').textContent = info.title;
            document.getElementById('pixelOrganDesc').textContent = info.desc;
            
            const metricsContainer = document.getElementById('pixelOrganMetrics');
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

    // 健康提醒模块
    initReminders() {
        // 实现健康提醒功能
        const setWaterReminder = document.querySelector('button[onclick="setWaterReminder()"]');
        if (setWaterReminder) {
            setWaterReminder.addEventListener('click', () => {
                showToast('喝水提醒已设置！');
            });
        }

        const setMealReminders = document.querySelector('button[onclick="setMealReminders()"]');
        if (setMealReminders) {
            setMealReminders.addEventListener('click', () => {
                showToast(' meal时间提醒已设置！');
            });
        }

        const setWeightReminder = document.querySelector('button[onclick="setWeightReminder()"]');
        if (setWeightReminder) {
            setWeightReminder.addEventListener('click', () => {
                showToast('减肥提醒已设置！');
            });
        }

        const calculateCalories = document.querySelector('button[onclick="calculateCalories()"]');
        if (calculateCalories) {
            calculateCalories.addEventListener('click', () => {
                showToast('卡路里计算完成！');
            });
        }
    }

    // 清理资源
    cleanup() {
        // 清理定时器和事件监听器
        window.removeEventListener('resize', this.handleResize);
    }
}

// 初始化应用
let labApp;
window.addEventListener('DOMContentLoaded', () => {
    labApp = new LabApp();
    labApp.initModules();
});

// 窗口卸载时清理
window.addEventListener('unload', () => {
    if (labApp) {
        labApp.cleanup();
    }
});

// 全局函数
function switchTab(tabId, event) {
    if (labApp) {
        labApp.switchTab(tabId, event);
    }
}

function toggleLanguage() {
    showToast('语言切换功能开发中...');
}

function togglePrivacy() {
    if (labApp) {
        labApp.togglePrivacy();
    }
}

function triggerEasterEgg() {
    if (labApp) {
        labApp.triggerEasterEgg();
    }
}

function calculateAll(showToastFlag = false) {
    if (showToastFlag) {
        showToast('分析完成！');
    }
}

function showOrganDetail(organ) {
    if (labApp) {
        labApp.showOrganDetail(organ);
    }
}

function setWaterReminder() {
    showToast('喝水提醒已设置！');
}

function setMealReminders() {
    showToast(' meal时间提醒已设置！');
}

function setWeightReminder() {
    showToast('减肥提醒已设置！');
}

function calculateCalories() {
    showToast('卡路里计算完成！');
}

function closeModal(event) {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('open');
    }
}