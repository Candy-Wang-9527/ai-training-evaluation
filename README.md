# AI培训评估系统

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0-green.svg)](https://github.com/your-org/ai-training-evaluation)
[![Feishu](https://img.shields.io/badge/Feishu-Base-orange.svg)](https://feishu.cn)

> 企业级AI培训应用评估管理系统，支持多级评审流程、飞书Base集成、角色权限管理和完整的统计分析功能。

## 📋 目录

- [项目概述](#-项目概述)
- [主要功能](#-主要功能)
- [技术栈](#-技术栈)
- [文件结构](#-文件结构)
- [快速开始](#-快速开始)
- [系统配置](#-系统配置)
- [使用指南](#-使用指南)
- [飞书Base集成](#-飞书base集成)
- [角色权限系统](#-角色权限系统)
- [开发指南](#-开发指南)
- [常见问题](#-常见问题)
- [更新日志](#-更新日志)
- [技术支持](#-技术支持)

## 🎯 项目概述

AI培训评估系统是一个企业级的应用评估管理平台，专门用于评估员工在AI工具培训和实际应用方面的表现。系统支持完整的多级评审流程，从人力部门录入培训信息，到技术架构委员会进行专业评审，再到总经理最终审批，形成闭环的评估管理体系。

### 核心特性

- 🔄 **多级评审流程** - 支持3阶段工作流：人力录入 → 技术评审 → 总经理审批
- 🎭 **灵活角色配置** - 独立于飞书组织架构的5种角色权限管理
- 📊 **完整统计分析** - 实时数据分析、趋势图表、部门对比
- 🔗 **飞书Base集成** - 深度集成7个飞书多维表格，支持数据自动同步
- ⚖️ **动态权重配置** - 可灵活配置各评估维度的权重比例
- 🛡️ **安全防护** - XSS防护、输入验证、权限控制

## 🚀 主要功能

### 1. 培训信息管理
- ✅ 培训基础信息录入（名称、类型、时间、地点）
- ✅ 培训讲师和参与人员管理
- ✅ 培训目标和内容设置
- ✅ 支持按部门批量添加人员
- ✅ 草稿保存和最近记录查看

### 2. AI培训评估
- ✅ 7个维度的评分功能（5个培训维度 + 2个应用维度）
- ✅ 滑块和输入框双向同步
- ✅ 实时分数计算和预览
- ✅ 多级评语系统（培训评语、应用评语、综合建议）
- ✅ 评估历史记录追踪

### 3. 多级评审流程
- ✅ **人力录入阶段** - 创建培训记录和基础信息
- ✅ **技术评审阶段** - 专业评审员进行评分和评语
- ✅ **总经理审批阶段** - 最终审批和决策，可调整评分
- ✅ 工作流状态实时跟踪和历史记录

### 4. 角色权限管理
- ✅ **人力部门** (HR) - 培训信息录入和管理
- ✅ **评审员** (Judge) - 进行评分和评审
- ✅ **讲师** (Instructor) - 培训实施和内容管理
- ✅ **总经理** (GM) - 最终审批和决策
- ✅ **管理员** (Admin) - 系统配置和用户管理

### 5. 统计分析
- ✅ 数据概览卡片（总评估数、平均分、最高/最低分）
- ✅ 部门平均分对比图表
- ✅ 各维度平均分雷达图
- ✅ 评分趋势分析（支持7天/30天/本季度）
- ✅ 详细评分数据表格
- ✅ 数据导出功能

### 6. 系统配置
- ✅ 评估权重配置（培训和应用维度权重）
- ✅ 评分标准设置
- ✅ 飞书Base连接配置
- ✅ 员工信息管理
- ✅ 系统参数设置
- ✅ 数据备份与恢复

## 🛠️ 技术栈

### 前端技术
- **HTML5/CSS3** - 页面结构和样式
- **JavaScript ES6+** - 业务逻辑
- **Bootstrap 5.3.0** - UI框架
- **Font Awesome 6.4.0** - 图标库
- **Chart.js 4.3.0** - 数据可视化

### 后端集成
- **飞书JS SDK** - 飞书平台集成
- **飞书Base API** - 多维表格数据存储
- **LocalStorage** - 本地数据缓存

### 核心功能模块
- **角色权限系统** - 独立的角色配置管理
- **工作流引擎** - 多级评审流程控制
- **数据验证系统** - 完整的输入验证和安全防护
- **工具函数库** - 公共API和工具函数

## 📁 文件结构

```
ai_training_evaluation/
├── index.html                      # 主评分页面
├── training-input.html              # 培训信息录入页面
├── statistics.html                  # 统计分析页面
├── config.html                      # 系统配置页面
├── role-config.html                 # 角色配置管理页面
├── index_workflow.html              # 工作流版本（测试用）
├── feishu-workflow-example.html     # 飞书集成测试页面
│
├── css/
│   └── style.css                    # 自定义样式文件
│
├── js/
│   ├── utils.js                     # 公共工具库
│   ├── app.js                       # 主业务逻辑
│   ├── config.js                    # 配置页面逻辑
│   ├── statistics.js                # 统计页面逻辑
│   ├── role-config.js               # 角色配置管理
│   ├── workflow.js                  # 工作流管理模块
│   ├── feishu-config.js             # 飞书Base基础配置
│   ├── feishu-config-workflow.js    # 飞书工作流配置
│   └── app-workflow.js              # 工作流版本业务逻辑
│
├── assets/                          # 静态资源文件
│   └── images/
│
├── README.md                        # 项目说明文档
├── 修复报告.md                      # 系统修复报告
├── 业务流程分析报告.md              # 业务流程分析
├── 系统改进总结.md                  # 功能改进总结
├── 飞书Base部署指南.md              # 部署实施指南
└── 页面同步更新完成报告.md          # 同步更新报告
```

## 🏁 快速开始

### 环境要求

- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 本地HTTP服务器（用于测试飞书功能）
- 飞书企业账号（用于生产环境）

### 快速启动

#### 方法1：使用Python HTTP服务器

```bash
# 进入项目目录
cd ai_training_evaluation

# 启动HTTP服务器
python -m http.server 8000

# 或使用Python 3
python3 -m http.server 8000
```

#### 方法2：使用Node.js HTTP服务器

```bash
# 安装http-server（首次使用）
npm install -g http-server

# 启动服务器
http-server -p 8000
```

#### 方法3：使用PHP内置服务器

```bash
php -S localhost:8000
```

### 访问系统

启动服务器后，在浏览器中访问：
```
http://localhost:8000/index.html
```

## ⚙️ 系统配置

### 1. 飞书Base配置

#### Base信息
- **Base链接**: https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc
- **App Token**: GA1QbgqTzaHaVIsIKWDcFI79nuc

#### 支持的7个表格
| 序号 | 表格名称 | Table ID | 用途 |
|------|----------|----------|------|
| 1 | 员工信息表 | tblIVqXEzmZdKxjI | 存储员工基本信息 |
| 2 | 培训记录表 | tblCfjFzfiZ2yvRr | 记录培训活动信息 |
| 3 | 评委信息表 | tblYqGszLDdookcH | 管理评委信息 |
| 4 | 培训打分表 | tblg3G6KPSAhBHNw | 存储培训维度评分 |
| 5 | AI应用打分表 | tblHwmO8RAe9KBIm | 存储应用维度评分 |
| 6 | 评分配置表 | tblaZKWjxym9YnLJ | 配置评分权重和规则 |
| 7 | 评估汇总表 | tblG0iiVyCRdZj2U | 工作流核心表 |

#### 配置步骤

1. 在飞书开发者后台创建自建应用
2. 配置应用权限（bitable、user等）
3. 将应用发布到飞书工作台
4. 在系统配置页面填写Base信息

### 2. 角色权限配置

#### 支持的5种角色

| 角色 | 代码标识 | 主要职责 | 核心权限 |
|------|----------|----------|----------|
| **人力部门** | `hr` | 培训管理 | 创建培训、编辑信息、提交评审 |
| **评审员** | `judge` | 评分评估 | 查看任务、进行评分、提交评审 |
| **讲师** | `instructor` | 培训实施 | 查看培训、管理内容、上传材料 |
| **总经理** | `gm` | 最终审批 | 查看所有、批准评估、调整评分 |
| **管理员** | `admin` | 系统维护 | 配置角色、管理系统、导出数据 |

#### 配置方式

系统支持3种用户角色配置方式：

1. **按姓名配置**: 直接通过员工姓名分配角色
2. **按用户ID配置**: 通过飞书用户ID精确分配
3. **按部门配置**: 整个部门的人员统一分配角色

配置入口：导航栏 → 角色配置

### 3. 评分权重配置

#### 默认权重分配

**培训部分**（占总分40%）：
- 入门培训/基础使用：20%
- 优化使用方法：20%
- 质量保障：20%
- 团队赋能：20%
- OKR贡献：20%

**应用部分**（占总分60%）：
- OKR关联度：50%
- OKR贡献度：50%

#### 权重配置入口

导航栏 → 配置 → 权重配置

## 📖 使用指南

### 工作流程概览

```
┌─────────────┐
│  人力部门   │ 
│ (HR Entry)  │ 1. 录入培训信息
└──────┬──────┘
       ↓
┌─────────────┐
│ 技术委员会  │ 
│(Tech Review)│ 2. 进行专业评审和评分
└──────┬──────┘
       ↓
┌─────────────┐
│   总经理    │ 
│ (GM Approval)│ 3. 最终审批和决策
└──────┬──────┘
       ↓
┌─────────────┐
│   已完成    │ 
│  (Completed) │ 4. 查看统计报表
└─────────────┘
```

### 详细使用步骤

#### 步骤1：角色配置（管理员）

1. 访问 `role-config.html`
2. 添加用户角色映射：
   ```
   配置方式：按姓名配置
   标识符：张三
   分配角色：人力部门
   ```
3. 重复添加其他用户

#### 步骤2：录入培训信息（人力部门）

1. 访问 `training-input.html`
2. 填写培训基础信息：
   ```
   培训名称：2026年Q1 AI工具培训
   培训类型：入门培训
   培训时间：选择开始和结束日期
   培训地点：会议室A
   ```
3. 选择培训讲师
4. 添加参与人员（可按部门批量添加）
5. 点击"提交培训信息"

#### 步骤3：进行评分（评审员）

1. 访问 `index.html`
2. 选择被评估员工
3. 对7个维度进行评分（0-100分）：
   ```
   培训部分（5个维度）：
   - 入门培训/基础使用
   - 优化使用方法
   - 质量保障
   - 团队赋能
   - OKR贡献
   
   应用部分（2个维度）：
   - OKR关联度
   - OKR贡献度
   ```
4. 填写评语和建议
5. 点击"提交到下一阶段"

#### 步骤4：最终审批（总经理）

1. 访问 `index.html`
2. 查看待审批任务
3. 审查评分和评语
4. 可调整最终得分
5. 填写总经理审批意见
6. 点击"最终批准"

#### 步骤5：查看统计（相关人员）

1. 访问 `statistics.html`
2. 查看数据分析：
   - 评估概览
   - 部门对比
   - 维度分析
   - 趋势分析
3. 查看详细评分记录
4. 导出统计数据

## 🔗 飞书Base集成

### 集成特性

- ✅ **多表格支持** - 支持7个飞书多维表格
- ✅ **实时同步** - 评分数据自动同步到Base
- ✅ **双向通信** - 支持读取和写入Base数据
- ✅ **权限控制** - 基于飞书用户权限的访问控制
- ✅ **错误处理** - 完善的异常处理和降级方案

### API使用示例

#### 初始化飞书客户端
```javascript
// 初始化工作流客户端
const initialized = await window.FeishuWorkflow.initialize();

if (initialized) {
    console.log('飞书Base连接成功');
    console.log('当前用户:', window.FeishuWorkflow.client.currentUser);
    console.log('当前角色:', window.FeishuWorkflow.client.currentRole);
}
```

#### 创建评估记录
```javascript
const evaluationData = {
    employee_name: '张三',
    evaluation_period: '2026年第一季度',
    evaluation_date: '2026-04-15'
};

const result = await window.FeishuWorkflow.createEvaluationSummary(evaluationData);
```

#### 提交到下一阶段
```javascript
await window.FeishuWorkflow.submitToNextStage(
    result.record_id,
    'hr_entry',
    '人力录入完成，提交到技术委员会评审'
);
```

#### 获取待办任务
```javascript
const myTasks = await window.FeishuWorkflow.getMyTasks();
console.log('我的待办任务:', myTasks);
```

## 🎭 角色权限系统

### 系统特色

- ✅ **独立于飞书组织架构** - 不依赖飞书的部门结构
- ✅ **灵活的配置方式** - 支持姓名/用户ID/部门三种映射
- ✅ **实时权限验证** - 每个操作都会进行权限检查
- ✅ **测试角色功能** - 开发环境下的角色切换

### 权限检查API

```javascript
// 检查用户是否有特定权限
if (window.RoleConfig.hasPermission('hr', 'create_training')) {
    // 允许创建培训
}

// 获取当前用户角色
const currentRole = window.RoleConfig.getCurrentRole();

// 获取角色配置
const roleConfig = window.RoleConfig.getRoleConfig(currentRole);
```

### 配置文件存储

角色配置存储在浏览器本地存储中：
```javascript
localStorage.setItem('user_role_mappings', JSON.stringify({
  by_name: {
    '张三': 'hr',
    '李四': 'judge',
    '王浩': 'judge'
  },
  by_user_id: {
    'ou_xxxxxxxxx': 'gm'
  },
  by_department: {
    '技术部': 'judge',
    '人力部': 'hr'
  }
}));
```

## 💻 开发指南

### 开发环境设置

1. **克隆项目**
```bash
git clone https://github.com/your-org/ai-training-evaluation.git
cd ai_training_evaluation
```

2. **启动开发服务器**
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx http-server -p 8000
```

3. **访问开发页面**
```
http://localhost:8000/index.html
```

### 代码规范

#### JavaScript规范
```javascript
// 使用AITrainingUtils命名空间
AITrainingUtils.showAlert('消息', 'success');

// 使用RoleConfig命名空间
await window.RoleConfig.initialize();

// 使用FeishuWorkflow命名空间
await window.FeishuWorkflow.createEvaluationSummary(data);
```

#### 安全编码规范
```javascript
// ✅ 正确：使用安全的HTML内容设置
AITrainingUtils.safeSetContent(element, htmlContent, true);

// ❌ 错误：直接使用innerHTML
element.innerHTML = userInput; // 存在XSS风险
```

### 扩展开发

#### 添加新的评分维度

1. 在HTML中添加新的评分元素
2. 在JavaScript中添加事件绑定
3. 更新权重计算逻辑
4. 测试滑块同步功能

#### 添加新的角色类型

1. 在`js/role-config.js`中定义新角色
2. 设置角色权限
3. 更新权限检查逻辑
4. 测试角色功能

## ❓ 常见问题

### Q1: 飞书Base连接失败怎么办？

**A**: 请检查以下几点：
1. 确认在飞书环境中运行系统
2. 验证App Token是否正确
3. 检查飞书应用权限配置
4. 确认网络连接正常

### Q2: 滑块和输入框不同步怎么办？

**A**: 这个问题已经在最新版本中修复：
- ✅ index.html的7个评分滑块已修复
- ✅ config.html的7个权重滑块已修复
- ✅ 确保使用最新版本的JS文件

### Q3: 如何批量配置用户角色？

**A**: 有两种方法：
1. **手动配置**: 访问role-config.html，逐个添加
2. **导入配置**: 导出角色配置JSON文件，编辑后重新导入

### Q4: 非飞书环境能使用吗？

**A**: 可以。系统会自动检测环境：
- **飞书环境**: 连接飞书Base，使用实时数据
- **非飞书环境**: 使用本地模拟数据，功能完整可用

### Q5: 如何备份数据？

**A**: 
1. **导出数据**: 配置页面 → 数据备份 → 导出所有数据
2. **飞书Base**: 数据自动存储在飞书Base中
3. **本地存储**: 部分数据存储在浏览器LocalStorage中

### Q6: 系统支持多少用户并发？

**A**: 
- **前端**: 无限制，基于浏览器
- **飞书Base**: 受飞书API限制，建议单表不超过10万条记录
- **推荐**: 支持100-500用户并发使用

## 📝 更新日志

### v2.1.0 (2026-04-15) - 后端服务版 🔥

#### 🚀 重大架构升级
- ✅ **新增Node.js后端服务** - 完整的Express后端API
- ✅ **Vercel一体化部署** - 前后端统一部署，一行命令上线
- ✅ **飞书API代理** - 安全的API调用，不再暴露App Secret
- ✅ **环境变量管理** - 统一配置，开发生产环境分离
- ✅ **Webhook事件订阅** - 支持飞书事件自动同步

#### 📦 新增文件
- `backend/server.js` - Express后端服务器
- `backend/api/feishu.js` - 飞书API代理
- `backend/api/users.js` - 用户管理API
- `backend/api/departments.js` - 部门管理API
- `backend/api/scores.js` - 评分管理API
- `backend/api/webhook.js` - 飞书事件订阅
- `js/api-client.js` - 前端API客户端
- `.env` - 环境变量配置
- `vercel.json` - Vercel部署配置
- `package.json` - 项目依赖管理

#### 🎯 对于产品经理
- ✅ **部署更简单** - 一行命令 `vercel` 完成部署
- ✅ **配置更安全** - App Secret存储在服务器端
- ✅ **维护更容易** - 统一的API接口，完整的错误处理

#### 📖 新增文档
- [Vercel部署完整指南](docs/guides/vercel-deployment-guide.md) - **产品经理必读**
- [系统诊断报告](docs/reports/system-diagnostic-report-20260415.md)

### v2.0.0 (2026-04-15)
#### 🎉 重大更新
- ✅ 新增多级评审流程支持
- ✅ 新增角色配置管理系统
- ✅ 新增培训信息录入页面
- ✅ 修复所有滑块同步问题（14个滑块）
- ✅ 完善飞书Base集成（支持7个表格）
- ✅ 优化导航栏结构，统一用户体验

#### 🔧 功能改进
- ✅ 增强输入验证和安全防护
- ✅ 实现工作流状态管理
- ✅ 添加完整的权限控制
- ✅ 改进错误处理和用户提示
- ✅ 优化数据存储和缓存机制

#### 🐛 Bug修复
- ✅ 修复index.html滑块同步问题
- ✅ 修复config.html滑块同步问题
- ✅ 修复XSS安全漏洞
- ✅ 修复LocalStorage容量问题
- ✅ 修复事件监听器绑定问题

### v1.0.0 (2026-04-10)
- ✅ 基础评分功能
- ✅ 统计分析功能
- ✅ 系统配置功能
- ✅ 飞书Base基础集成

## 🤝 技术支持

### 联系方式
- **技术支持**: 王浩
- **公司**: 兆原数通（北京）数据科技有限公司
- **项目**: AI培训评估系统 v2.0

### 文档资源
- [飞书Base部署指南](./飞书Base部署指南.md)
- [业务流程分析报告](./业务流程分析报告.md)
- [系统修复报告](./修复报告.md)
- [页面同步更新报告](./页面同步更新完成报告.md)

### 问题反馈
如遇到问题或有建议，请通过以下方式反馈：
1. 在项目中创建Issue
2. 联系技术支持团队
3. 查阅相关文档资源

## 📄 许可证

MIT License

Copyright (c) 2026 兆原数通（北京）数据科技有限公司

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT ALL LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 🙏 致谢

感谢以下技术和服务的支持：
- [飞书开放平台](https://open.feishu.cn/)
- [Bootstrap](https://getbootstrap.com/)
- [Chart.js](https://www.chartjs.org/)
- [Font Awesome](https://fontawesome.com/)

---

**AI培训评估系统** - 让企业AI培训评估更加智能化、规范化！

*最后更新: 2026年4月15日*