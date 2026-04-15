# 多角色配置和飞书组织架构同步功能使用指南

## 功能概述

系统现在支持：
- ✅ **多角色配置** - 一个用户可以同时拥有多个角色
- ✅ **飞书组织架构同步** - 从飞书获取部门和员工信息
- ✅ **智能权限检查** - 支持多角色的权限验证
- ✅ **快速员工搜索** - 根据姓名快速查找并配置角色

## 1. 多角色配置功能

### 1.1 为什么需要多角色？

在企业管理中，一个员工可能同时承担多个职责：
- **HR + 讲师**：既负责人力资源管理，又承担培训职责
- **技术评审员 + 部门经理**：既是技术专家，又是管理人员
- **总经理 + 管理员**：拥有最高决策权和系统管理权限

### 1.2 如何配置多角色

#### 方法1：通过角色配置页面

1. 访问角色配置页面：`https://ai-training-evaluation.vercel.app/role-config.html`
2. 找到"添加用户角色配置"区域
3. 选择配置方式（按姓名/按用户ID/按部门）
4. 输入标识符
5. **勾选多个角色**（支持多选）
6. 点击"添加角色配置"

示例：
```
姓名：王浩
角色：☑ 评审员 ☑ 人力部门
结果：王浩同时拥有评审员和人力部门的权限
```

#### 方法2：通过编程方式

```javascript
// 设置用户的多个角色
window.RoleConfig.setUserRoles('王浩', ['judge', 'hr'], 'by_name');

// 添加单个角色
window.RoleConfig.addUserRoleMapping('王浩', 'instructor', 'by_name');

// 检查用户是否有特定角色
const hasJudgeRole = window.RoleConfig.hasRole({name: '王浩'}, 'judge');

// 获取用户的所有角色
const roles = window.RoleConfig.getUserRoles({name: '王浩'});
// 返回：['judge', 'hr', 'instructor']
```

### 1.3 权限检查逻辑

多角色系统采用"任一角色有权限即可"的原则：

```javascript
// 检查用户是否有"创建培训"权限
const canCreate = window.RoleConfig.hasPermission(
    {name: '王浩'},
    'create_training'
);

// 逻辑：如果王浩的任一角色（评审员、人力部门）有该权限，则返回true
```

### 1.4 数据格式

**旧版本（单角色）：**
```json
{
    "by_name": {
        "王浩": "judge"
    }
}
```

**新版本（多角色）：**
```json
{
    "by_name": {
        "王浩": ["judge", "hr", "instructor"],
        "张三": ["hr"]
    }
}
```

系统会自动检测并迁移旧版本数据！

## 2. 飞书组织架构同步功能

### 2.1 功能介绍

飞书组织架构同步功能可以：
- 从飞书获取完整的组织架构信息
- 同步所有部门和员工数据
- 支持快速搜索和查找员工
- 自动关联部门和员工关系

### 2.2 配置飞书同步

#### 第一步：确保飞书环境

系统会自动检测是否在飞书环境中：
- ✅ 飞书环境：使用真实API数据
- ⚠️ 非飞书环境：使用模拟数据（开发测试）

#### 第二步：同步组织架构

1. 访问角色配置页面：`https://ai-training-evaluation.vercel.app/role-config.html`
2. 找到"飞书组织架构同步"区域
3. 点击"同步组织架构"按钮
4. 等待同步完成
5. 查看同步状态和统计信息

#### 同步信息显示：
```
✅ 已同步于 2026-04-15 14:30 (1小时前)
部门：7个，员工：8人
```

### 2.3 快速搜索员工

同步完成后，可以使用快速搜索功能：

1. 在"快速查找"区域输入员工姓名
2. 点击"搜索员工"按钮
3. 查看搜索结果
4. 点击"配置角色"按钮自动填充信息

搜索结果显示：
```
找到 2 名员工：

王浩 (Wang Hao)
技术部 | wanghao@example.com
[配置角色]

张三 (Zhang San)
研发组 | zhangsan@example.com
[配置角色]
```

### 2.4 API使用

```javascript
// 同步组织架构
const result = await FeishuOrgSync.syncOrganization();
console.log(result);

// 获取同步的数据
const orgData = FeishuOrgSync.getCachedOrganizationData();

// 搜索员工
const users = FeishuOrgSync.searchUsersByName('王浩');

// 根据用户ID获取信息
const userInfo = FeishuOrgSync.getUserInfo('user_001');

// 根据部门获取员工列表
const deptEmployees = FeishuOrgSync.getEmployeesByDepartment('dept_002');

// 获取部门名称
const deptName = FeishuOrgSync.getDepartmentName('dept_002');

// 获取同步状态
const status = FeishuOrgSync.getSyncStatus();
```

## 3. 实际使用场景

### 场景1：设置人力部门管理员

**需求：** 李四需要同时管理人力资源和培训工作

**步骤：**
1. 访问角色配置页面
2. 在"添加用户角色配置"区域：
   - 配置方式：按姓名
   - 标识符：李四
   - 分配角色：☑ 人力部门 ☑ 讲师
3. 点击"添加角色配置"

**结果：** 李四可以执行人力部门和讲师的所有操作

### 场景2：从飞书同步并配置角色

**需求：** 为新入职的员工批量配置角色

**步骤：**
1. 点击"同步组织架构"获取最新员工信息
2. 在快速查找中搜索员工姓名
3. 点击搜索结果中的"配置角色"按钮
4. 选择适当的角色并保存

### 场景3：部门级别的角色配置

**需求：** 技术部所有员工都是评审员

**步骤：**
1. 在"添加用户角色配置"区域：
   - 配置方式：按部门
   - 标识符：技术部
   - 分配角色：☑ 评审员
2. 点击"添加角色配置"

**结果：** 技术部所有员工自动获得评审员权限

## 4. 权限系统详解

### 4.1 角色权限对照表

| 角色 | 主要权限 | 适用场景 |
|------|----------|----------|
| **人力部门 (hr)** | 创建培训、编辑信息、提交评审、查看统计 | HR人员、培训管理员 |
| **评审员 (judge)** | 查看评估任务、进行评分、提交评审、添加评语 | 部门经理、技术专家 |
| **讲师 (instructor)** | 查看自己的培训、管理培训内容、上传材料 | 培训师、内训师 |
| **总经理 (gm)** | 查看所有评估、批准评估、调整评分、最终批准 | 公司高管、决策层 |
| **管理员 (admin)** | 配置角色、系统管理、用户管理、数据导出 | IT管理员、系统管理员 |

### 4.2 多角色权限合并规则

当用户拥有多个角色时：
- **权限合并**：拥有所有角色的权限总和
- **检查逻辑**：任一角色有权限即可操作
- **显示顺序**：按角色重要性排序

示例：
```javascript
// 用户角色：['hr', 'instructor']
// 权限合并结果：
✅ create_training (来自hr)
✅ edit_training (来自hr)
✅ submit_to_review (来自hr)
✅ view_statistics (来自hr/instructor)
✅ manage_training_content (来自instructor)
✅ upload_materials (来自instructor)
```

## 5. 数据管理

### 5.1 导出角色配置

1. 在角色配置页面点击"导出配置"按钮
2. 保存JSON文件到本地
3. 文件包含所有角色映射和权限配置

### 5.2 导入角色配置

1. 点击"选择文件"按钮
2. 选择之前导出的JSON文件
3. 系统自动导入并恢复配置

### 5.3 清除同步数据

如需重新同步或清理数据：
1. 点击"清除同步数据"按钮
2. 确认清除操作
3. 所有飞书组织架构数据将被删除

## 6. 故障排查

### 问题1：多角色配置不生效

**可能原因：**
- 浏览器缓存了旧版本数据
- localStorage数据损坏

**解决方法：**
1. 清除浏览器缓存
2. 检查浏览器控制台是否有错误
3. 重新添加角色配置

### 问题2：飞书同步失败

**可能原因：**
- 不在飞书环境中
- 网络连接问题
- API权限不足

**解决方法：**
1. 确认在飞书环境中打开页面
2. 检查网络连接
3. 联系飞书管理员确认API权限
4. 使用模拟数据进行测试

### 问题3：搜索不到员工

**可能原因：**
- 组织架构数据未同步
- 搜索关键词不正确

**解决方法：**
1. 先执行"同步组织架构"
2. 确认同步成功且有数据
3. 使用准确的姓名搜索

## 7. 开发者API

### 7.1 角色配置API

```javascript
// 获取用户的所有角色
const roles = window.RoleConfig.getUserRoles(userInfo);

// 检查用户是否有特定角色
const hasRole = window.RoleConfig.hasRole(userInfo, 'judge');

// 检查用户是否有任一指定角色
const hasAny = window.RoleConfig.hasAnyRole(userInfo, ['judge', 'hr']);

// 检查用户是否有所有指定角色
const hasAll = window.RoleConfig.hasAllRoles(userInfo, ['judge', 'hr']);

// 检查权限
const hasPermission = window.RoleConfig.hasPermission(userInfo, 'create_training');

// 设置用户角色
const result = window.RoleConfig.setUserRoles('王浩', ['judge', 'hr'], 'by_name');

// 添加单个角色
window.RoleConfig.addUserRoleMapping('王浩', 'instructor', 'by_name');

// 移除特定角色
window.RoleConfig.removeUserRoleFromUser('王浩', 'instructor', 'by_name');
```

### 7.2 飞书组织架构API

```javascript
// 同步组织架构
const result = await FeishuOrgSync.syncOrganization();

// 获取缓存的组织架构数据
const orgData = FeishuOrgSync.getCachedOrganizationData();

// 搜索用户
const users = FeishuOrgSync.searchUsersByName('王浩');

// 获取用户信息
const userInfo = FeishuOrgSync.getUserInfo('user_001');

// 获取部门员工列表
const employees = FeishuOrgSync.getEmployeesByDepartment('dept_002');

// 获取部门名称
const deptName = FeishuOrgSync.getDepartmentName('dept_002');

// 获取同步状态
const status = FeishuOrgSync.getSyncStatus();

// 清除同步数据
FeishuOrgSync.clearSyncData();
```

## 8. 更新日志

### v2.0.0 (2026-04-15)
- ✅ 新增多角色配置功能
- ✅ 添加飞书组织架构同步
- ✅ 支持快速员工搜索
- ✅ 优化权限检查逻辑
- ✅ 自动迁移旧版本数据
- ✅ 增强角色配置页面UI

## 9. 技术支持

如有问题或建议，请：
1. 查看浏览器控制台的日志信息
2. 参考本文档的故障排查部分
3. 联系技术支持：王浩

## 10. 链接

- 角色配置页面：https://ai-training-evaluation.vercel.app/role-config.html
- 系统配置页面：https://ai-training-evaluation.vercel.app/config.html
- 飞书Base：https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc
