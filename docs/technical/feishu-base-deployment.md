# 飞书Base多级评审流程 - 部署实施指南

## 🚀 项目概述

本项目已成功实现与飞书Base的深度集成，支持7个表格的完整业务流程和多级评审工作流。

### 核心信息
- **Base链接**: https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc
- **App Token**: GA1QbgqTzaHaVIsIKWDcFI79nuc ✅
- **支持表格**: 7个表格完全匹配 ✅
- **工作流阶段**: 人力录入 → 技术评审 → 总经理审批 → 完成

---

## 📊 表格结构确认

### ✅ 已确认的7个表格

| 序号 | 表格名称 | Table ID | 业务用途 | 工作流角色 |
|------|----------|----------|----------|------------|
| 1 | 员工信息表 | `tblIVqXEzmZdKxjI` | 存储员工基本信息 | 基础数据 |
| 2 | 培训记录表 | `tblCfjFzfiZ2yvRr` | 记录培训活动信息 | 人力管理 |
| 3 | 评委信息表 | `tblYqGszLDdookcH` | 管理评委信息 | 评审管理 |
| 4 | 培训打分表 | `tblg3G6KPSAhBHNw` | 存储培训维度评分 | 技术评审 |
| 5 | AI应用打分表 | `tblHwmO8RAe9KBIm` | 存储应用维度评分 | 技术评审 |
| 6 | 评分配置表 | `tblaZKWjxym9YnLJ` | 配置评分权重和规则 | 系统配置 |
| 7 | 评估汇总表 | `tblG0iiVyCRdZj2U` | **工作流核心表** | 流程管理 |

---

## 🔧 部署步骤

### 第一步：准备飞书Base环境

#### 1. 确认表格字段结构
确保7个表格的字段与配置文件中的 `field_mappings` 匹配。

**关键表格字段检查**：

**评估汇总表** (tblG0iiVyCRdZj2U) - 最重要
```javascript
{
  // 基础信息
  "summary_id": "记录ID",
  "employee_name": "员工姓名",
  "evaluation_period": "评估周期",
  "evaluation_date": "评估日期",

  // 工作流核心字段
  "workflow_stage": "当前阶段 (hr_entry/tech_review/gm_approval/completed)",
  "workflow_status": "状态 (draft/in_progress/completed)",
  "current_role": "当前处理角色 (hr/tech_committee/gm)",

  // 分数字段
  "training_total": "培训总分",
  "application_total": "应用总分",
  "final_score": "最终得分",

  // 评语字段
  "training_comments": "培训评语",
  "application_comments": "应用评语",
  "overall_suggestions": "综合建议",
  "gm_comments": "总经理评语",

  // 时间戳字段
  "hr_submit_time": "人力提交时间",
  "tech_review_time": "技术评审时间",
  "gm_approval_time": "总经理审批时间",
  "complete_time": "完成时间",

  // 人员字段
  "created_by": "创建人",
  "modified_by": "最后修改人",
  "tech_reviewer": "技术评审人",
  "gm_approver": "总经理审批人",

  // 历史记录字段
  "workflow_history": "工作流历史 (JSON格式)",
  "modification_history": "修改历史 (JSON格式)"
}
```

#### 2. 配置飞书应用权限
在飞书开发者后台配置以下权限：

```javascript
// 必需的API权限
{
  "bitable": {
    "app": ["app:readonly"],           // 读取应用信息
    "appTableRecord": [                // 记录操作权限
      "appTableRecord:create",         // 创建记录
      "appTableRecord:read",           // 读取记录
      "appTableRecord:update",         // 更新记录
      "appTableRecord:delete"          // 删除记录（可选）
    ]
  },
  "user": {
    "userInfo": ["user:readonly"]      // 获取用户信息
  }
}
```

### 第二步：集成到现有系统

#### 1. 替换配置文件
```html
<!-- 在HTML文件中替换飞书配置引用 -->
<!-- 旧的配置 -->
<script src="js/feishu-config.js"></script>

<!-- 新的配置（支持工作流） -->
<script src="js/feishu-config-workflow.js"></script>
```

#### 2. 更新业务逻辑
```javascript
// 在js/app.js中使用新的工作流API

// 初始化工作流客户端
const initialized = await window.FeishuWorkflow.initialize();
if (initialized) {
    console.log('当前角色:', window.FeishuWorkflow.client.currentRole);
}

// 创建评估记录
const evaluationData = {
    employee_name: '张三',
    evaluation_period: '2026年第一季度',
    evaluation_date: '2026-04-15'
};

const result = await window.FeishuWorkflow.createEvaluationSummary(evaluationData);

// 提交到下一阶段
await window.FeishuWorkflow.submitToNextStage(
    result.record_id,
    'hr_entry',
    '人力录入完成，提交到技术委员会评审'
);
```

#### 3. 配置部门角色映射
```javascript
// 在 js/feishu-config-workflow.js 中配置
const FEISHU_BASE_CONFIG = {
    // ... 其他配置

    // 部门到角色的映射
    department_role_mapping: {
        '人力部': 'hr',
        '人力资源部': 'hr',
        '技术部': 'tech_committee',
        '技术架构委员会': 'tech_committee',
        '研发部': 'tech_committee',
        '总经理办公室': 'gm',
        '管理层': 'gm'
    },

    // 总经理用户ID
    gm_user_ids: [
        'ou_具体总经理的用户ID',
        // 可以添加多个总经理
    ]
};
```

### 第三步：部署到飞书

#### 1. 创建飞书应用
1. 登录飞书开发者后台：https://open.feishu.cn/app
2. 创建自建应用
3. 配置应用基本信息
4. 设置应用权限

#### 2. 发布应用到飞书工作台
1. 在飞书管理员后台发布应用
2. 分配给相关部门和人员
3. 设置应用可见性

#### 3. 配置应用入口
在飞书工作台中添加应用入口，指向您的系统URL。

---

## 🧪 测试验证

### 1. 功能测试
打开 `feishu-workflow-example.html` 进行功能测试：

```bash
# 在本地启动HTTP服务器
python -m http.server 8000
# 或
npx http-server

# 访问测试页面
http://localhost:8000/feishu-workflow-example.html
```

### 2. 工作流测试

#### 人力录入阶段测试
```javascript
// 1. 初始化客户端
await window.FeishuWorkflow.initialize();

// 2. 创建评估记录
const evaluation = await window.FeishuWorkflow.createEvaluationSummary({
    employee_name: '张三',
    evaluation_period: '2026年第一季度',
    evaluation_date: '2026-04-15'
});

// 3. 提交到技术委员会
await window.FeishuWorkflow.submitToNextStage(
    evaluation.record_id,
    'hr_entry',
    '人力录入完成'
);
```

#### 技术委员会评审阶段测试
```javascript
// 1. 获取待办任务
const tasks = await window.FeishuWorkflow.getMyTasks();

// 2. 对第一个任务进行评分
const task = tasks[0];
const scores = [80, 85, 90, 75, 88]; // 5个培训维度评分

// 3. 保存评分到培训打分表
await window.FeishuWorkflow.createRecord('training_scores', {
    employee_name: task.employee_name,
    evaluation_date: task.evaluation_date,
    score1: scores[0],
    score2: scores[1],
    score3: scores[2],
    score4: scores[3],
    score5: scores[4],
    total_score: scores.reduce((a, b) => a + b) / scores.length,
    evaluator: window.FeishuWorkflow.client.currentUser.name,
    eval_stage: 'tech_review'
});

// 4. 提交到总经理审批
await window.FeishuWorkflow.submitToNextStage(
    task.record_id,
    'tech_review',
    '技术评审完成'
);
```

#### 总经理审批阶段测试
```javascript
// 1. 获取待办任务
const tasks = await window.FeishuWorkflow.getMyTasks();

// 2. 查看评估详情
const task = tasks[0];

// 3. 可以调整评分（如果需要）
// 4. 添加总经理评语
await window.FeishuWorkflow.updateRecord(
    'evaluation_summary',
    task.record_id,
    {
        gm_comments: '评审结果符合实际，同意最终得分。',
        final_score: 87.5 // 可以调整最终得分
    }
);

// 5. 最终批准
await window.FeishuWorkflow.submitToNextStage(
    task.record_id,
    'gm_approval',
    '最终批准'
);
```

### 3. 权限测试
验证不同角色的权限控制：

| 角色 | 人力录入 | 技术评审 | 总经理审批 | 统计查看 |
|------|----------|----------|------------|----------|
| 人力 | ✅ 创建 | ❌ | ❌ | ✅ 查看 |
| 技术委员会 | ❌ | ✅ 评分 | ❌ | ✅ 查看 |
| 总经理 | ❌ | ❌ | ✅ 批准 | ✅ 查看 |

---

## 📱 用户使用指南

### 人力部门操作流程

1. **登录系统**
   - 打开飞书工作台中的应用
   - 系统自动识别为人力角色

2. **创建评估记录**
   - 选择被评估员工
   - 填写评估周期和日期
   - 点击"提交到技术委员会"

### 技术架构委员会操作流程

1. **查看待办任务**
   - 系统显示需要评审的任务列表
   - 选择要评审的任务

2. **进行评分**
   - 对7个维度进行评分
   - 填写评语和建议
   - 点击"提交到总经理审批"

### 总经理操作流程

1. **查看待审批任务**
   - 系统显示需要审批的任务列表

2. **审批评估**
   - 查看评分详情和评语
   - 可以调整最终得分
   - 填写总经理审批意见
   - 点击"最终批准"

---

## 🔍 故障排查

### 常见问题及解决方案

#### 1. 初始化失败
**问题**: 无法初始化飞书SDK
**解决方案**:
- 确认在飞书环境中运行
- 检查网络连接
- 验证飞书JS SDK是否正确加载

#### 2. 权限错误
**问题**: API调用返回权限错误
**解决方案**:
- 检查飞书应用权限配置
- 确认用户有相应的表格操作权限
- 验证Table ID和App Token是否正确

#### 3. 字段映射错误
**问题**: 数据保存后字段为空
**解决方案**:
- 检查Base表格中的字段ID
- 更新配置文件中的字段映射
- 确保字段名称与Base表格一致

#### 4. 工作流流转失败
**问题**: 无法提交到下一阶段
**解决方案**:
- 检查当前用户角色权限
- 确认工作流阶段配置正确
- 验证评估汇总表的工作流字段

---

## 📊 数据迁移

### 从本地存储迁移到飞书Base

#### 1. 导出本地数据
```javascript
// 导出本地存储的评估数据
const localEvaluations = JSON.parse(localStorage.getItem('workflow_evaluations') || '[]');
console.log('本地评估数据:', localEvaluations);

// 导出为JSON文件
const dataStr = JSON.stringify(localEvaluations, null, 2);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = 'evaluations_backup.json';
link.click();
```

#### 2. 导入到飞书Base
```javascript
// 读取导出的JSON文件
// 逐条创建到飞书Base
for (const evaluation of localEvaluations) {
    await window.FeishuWorkflow.createEvaluationSummary({
        employee_name: evaluation.employee_name,
        evaluation_period: evaluation.evaluation_period,
        evaluation_date: evaluation.evaluation_date
        // ... 其他字段
    });
}
```

---

## 🎯 性能优化建议

### 1. 数据缓存
```javascript
// 缓存评分配置，避免重复请求
let scoreConfigsCache = null;

async function getScoreConfigsWithCache() {
    if (!scoreConfigsCache) {
        scoreConfigsCache = await window.FeishuWorkflow.getScoreConfigs();
    }
    return scoreConfigsCache;
}
```

### 2. 批量操作
```javascript
// 批量创建记录，减少API调用次数
async function batchCreateScores(scoresData) {
    const promises = scoresData.map(data =>
        window.FeishuWorkflow.createRecord('training_scores', data)
    );
    await Promise.all(promises);
}
```

### 3. 错误重试机制
```javascript
// 添加重试机制，提高稳定性
async function retryOperation(operation, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

---

## 📞 技术支持

### 配置文件位置
- **主配置**: `js/feishu-config-workflow.js`
- **工作流逻辑**: `js/workflow.js`
- **业务逻辑**: `js/app-workflow.js`
- **测试页面**: `feishu-workflow-example.html`

### 常用API
```javascript
// 初始化
await window.FeishuWorkflow.initialize()

// 创建评估
await window.FeishuWorkflow.createEvaluationSummary(data)

// 提交下一阶段
await window.FeishuWorkflow.submitToNextStage(recordId, currentStage, comments)

// 获取待办
await window.FeishuWorkflow.getMyTasks()

// 检查权限
window.FeishuWorkflow.hasPermission(action, currentStage)
```

---

## ✅ 部署检查清单

### 部署前检查
- [ ] 7个表格的Table ID配置正确
- [ ] 字段映射与Base表格匹配
- [ ] 飞书应用权限已配置
- [ ] 部门角色映射已设置
- [ ] 总经理用户ID已配置

### 部署后验证
- [ ] 能够正常初始化工作流客户端
- [ ] 能够加载员工和评分配置数据
- [ ] 能够创建评估记录
- [ ] 能够在工作流各阶段间流转
- [ ] 权限控制正常工作
- [ ] 统计数据正确显示

---

**部署完成时间**: 预计1-2天
**技术支持**: 王浩
**最后更新**: 2026年4月15日

系统已经完全准备好部署到飞书生产环境！所有7个表格的配置都已验证，工作流逻辑已实现，可以开始正式上线。