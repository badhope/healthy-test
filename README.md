# Healthy-test 🩺✨

[![GitHub Stars](https://img.shields.io/github/stars/badhope/healthy-test.svg)](https://github.com/badhope/healthy-test)
[![GitHub Forks](https://img.shields.io/github/forks/badhope/healthy-test.svg)](https://github.com/badhope/healthy-test)
[![GitHub Issues](https://img.shields.io/github/issues/badhope/healthy-test.svg)](https://github.com/badhope/healthy-test/issues)
[![License](https://img.shields.io/github/license/badhope/healthy-test.svg)](LICENSE)

> 🎉 健康测试平台 - 探索生命科学的无限可能，从分子到系统的健康全景

## 📋 项目简介

Healthy-test 是一个现代化的健康监测平台，旨在通过科学方法和先进技术，探索人类健康的奥秘，为用户提供专业、全面的健康分析和个性化建议。

### 🌟 项目特色

- 🎨 **现代化界面**：采用响应式设计，适配各种设备屏幕
- 🧠 **智能分析**：基于科学算法的健康数据计算和分析
- 🔒 **隐私保护**：所有数据计算均在本地完成，不会上传到服务器
- 📱 **多设备支持**：从桌面到移动设备，随时随地访问
- 🎯 **个性化建议**：根据用户数据生成定制化健康建议
- 🧪 **完整测试覆盖**：单元测试覆盖率 80%+

## 🚀 核心功能

### 1. 身体数据实验室 📊
- BMI、BMR、体脂率等健康指标计算
- 理想体重范围分析
- 每日能量消耗计算
- 健康风险评估

### 2. 交互式人体解剖 🫀
- 点击身体部位查看器官详情
- 器官相关健康知识
- 视觉化人体结构展示

### 3. 生物化学分析 ⚗️
- 人体必需元素周期表
- 电解质平衡分析
- 微量元素需求评估

### 4. 消化系统时间轴 🍽️
- 从口腔到肛门的消化过程
- 各消化器官功能详解
- 消化时间和pH值分析

### 5. 健康推荐 💡
- 个性化健康建议
- 科学的生活方式指导
- 健康名言轮播

### 6. 像素艺术人体 🎮
- 像素风格人体可视化
- 点击器官查看详细健康信息
- 器官健康指标展示

### 7. 健康提醒 ⏰
- 饮水提醒：自定义提醒间隔
- 用餐时间提醒：设置早中晚用餐时间
- 体重提醒：设置目标体重和提醒频率

### 8. 卡路里计算工具 🍎
- 食物卡路里数据库
- 根据食物重量计算卡路里
- 基于身体数据计算每日卡路里需求

### 9. 知识问答系统 🧠
- 5 大类题库（营养学、解剖学、运动科学、睡眠科学、心理健康）
- 40+ 道精选题目，包含详细解析
- 难度分级和得分系统
- 成就徽章奖励机制

### 10. 食物百科数据库 🍎
- 100+ 种食物详细营养信息
- 5 大分类（水果、蔬菜、谷物、肉类、海鲜）
- 智能搜索功能
- 卡路里计算器

### 11. 健康目标追踪 📈
- 饮水追踪（目标 2000ml/天）
- 步数追踪（目标 10000 步/天）
- 体重记录与趋势
- 睡眠记录
- 成就徽章系统

### 12. 虚拟健康宠物 🐾
- 6 种宠物形象可选
- 5 个成长阶段
- 4 大状态指标（健康、能量、幸福、经验）
- 6 种互动动作
- 升级进化机制

### 13. 健康挑战赛 🏆
- 6 大挑战类别
- 13 个预设挑战
- 分类筛选功能
- 进度追踪
- 成就奖励系统

## 🛠️ 技术栈

- **前端框架**: 原生 JavaScript (ES6+ Modules)
- **样式**: CSS3 (CSS变量、Flexbox、Grid)
- **数据存储**: 本地存储 (localStorage)
- **动画**: CSS动画 + JavaScript动画
- **测试**: Jest (覆盖率 80%+)
- **代码质量**: ESLint + Prettier

## 📦 安装步骤

### 方法一：直接访问

1. 打开浏览器
2. 访问 [Healthy-test](https://badhope.github.io/healthy-test/)

### 方法二：本地部署

1. **克隆仓库**
   ```bash
   git clone https://github.com/badhope/healthy-test.git
   cd healthy-test
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm start
   ```

4. **访问网站**
   打开浏览器，访问 `http://localhost:3000`

### 开发命令

```bash
# 启动开发服务器
npm start

# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 代码格式化
npm run format

# 综合质量检查
npm run quality
```

## 📖 使用指南

### 1. 身体数据输入
1. 进入「身体数据实验室」模块
2. 填写身高、体重、年龄等基本信息
3. 点击「启动全面分析」按钮
4. 查看计算结果和健康建议

### 2. 人体解剖探索
1. 进入「人体」模块
2. 点击SVG图上的身体部位
3. 查看器官详情和相关健康知识

### 3. 设置健康提醒
1. 进入「健康提醒」模块
2. 设置饮水提醒间隔
3. 设置早中晚用餐时间
4. 设置体重目标和提醒频率

## 🔧 项目结构

```
healthy-test/
├── css/                    # 样式文件
│   ├── components/         # 组件样式
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── forms.css
│   │   ├── modal.css
│   │   └── toast.css
│   ├── styles.css          # 主样式文件
│   └── variables.css       # CSS变量
├── js/                     # JavaScript文件
│   ├── core/               # 核心模块
│   │   ├── config.js       # 配置管理
│   │   ├── utils.js        # 工具函数
│   │   ├── ErrorHandler.js # 错误处理
│   │   ├── HealthCalculator.js # 健康计算
│   │   ├── Logger.js       # 日志系统
│   │   ├── PerformanceMonitor.js # 性能监控
│   │   ├── SecurityValidator.js # 安全验证
│   │   └── StorageManager.js # 存储管理
│   ├── data/               # 数据文件
│   │   ├── challenges.js
│   │   ├── foods.js
│   │   ├── organs.js
│   │   ├── pets.js
│   │   └── quizzes.js
│   ├── modules/            # 功能模块
│   │   ├── extendedFeatures.js
│   │   └── newFeatures.js
│   └── app.js              # 主应用入口
├── tests/                  # 测试文件
│   ├── ErrorHandler.test.js
│   ├── HealthCalculator.test.js
│   ├── SecurityValidator.test.js
│   ├── StorageManager.test.js
│   ├── Utils.test.js
│   └── integration.test.js
├── index.html              # 主HTML文件
├── package.json            # 项目配置
├── .eslintrc.json          # ESLint配置
├── .gitignore              # Git忽略文件
├── LICENSE                 # 许可证
└── README.md               # 项目说明
```

## 🔐 安全特性

- **XSS 防护**: 输入净化和输出编码
- **SQL 注入检测**: 输入验证
- **CSRF 防护**: Token 验证
- **数据脱敏**: 敏感信息保护
- **本地存储**: 数据不上传服务器

## 📊 性能监控

- Web Vitals 监控 (FCP/LCP/CLS/FID)
- 内存使用监控
- 网络状态监控
- 函数执行时间测量

## 🤝 贡献指南

1. **Fork 仓库**
2. **创建分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **打开 Pull Request**

### 代码规范

- 遵循 ESLint 配置规则
- 编写单元测试
- 保持代码覆盖率 80%+
- 提交前运行 `npm run quality`

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 感谢所有为项目贡献的开发者
- 基于 WHO、NIH、Harvard Medical School 最新研究
- 使用了现代前端技术和最佳实践

---

**Healthy-test** - 让健康管理变得简单、科学、有趣！ 🌟

[![GitHub Last Commit](https://img.shields.io/github/last-commit/badhope/healthy-test.svg)](https://github.com/badhope/healthy-test/commits/main)
