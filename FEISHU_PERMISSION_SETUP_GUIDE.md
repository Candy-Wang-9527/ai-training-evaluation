# 飞书应用权限配置完整指南

## 🎯 问题诊断

您遇到的问题：
- ❌ 组织架构同步没有成功
- ❌ Base也没有同步成功  
- ❌ 弹出错误：添加失败: window.RoleConfig.setUserRoles is not a function

## ✅ 已修复的问题

1. **RoleConfig方法缺失** - ✅ 已修复
   - 添加了setUserRoles、getUserRoles等多角色方法到window.RoleConfig导出
   
2. **飞书API调用优化** - ✅ 已优化
   - 改进了API调用方式
   - 添加了详细的调试日志
   - 增加了降级机制

3. **新增诊断工具** - ✅ 已添加
   - 系统诊断工具 (SystemDiagnostic)
   - 飞书API测试工具 (FeishuAPITester)

---

## 🔧 第一步：运行诊断（2分钟）

### 访问配置页面
```
https://ai-training-evaluation.vercel.app/config.html
```

### 运行诊断工具
1. 点击页面顶部的"运行系统诊断"按钮
2. 按`F12`打开浏览器控制台
3. 查看诊断报告

### 测试飞书API
1. 点击"测试飞书API"按钮
2. 查看控制台输出的权限检查结果

**预期看到：**
```
🔍 开始系统诊断...
✅ 成功: 15 | ⚠️ 警告: 2 | ❌ 错误: 0

📋 详细结果:
✅ 当前页面: config.html
✅ 浏览器兼容性: ✅ 兼容
✅ 脚本加载: config.js - ✅ 已加载
✅ 元素存在: saveBaseConfigBtn - ✅ 存在
...
```

---

## 🔐 第二步：配置飞书应用权限（10分钟）

### 2.1 登录飞书开发者平台

1. 访问：https://open.feishu.cn/app
2. 使用您的飞书账号登录
3. 找到您的应用：**AI培训评估系统**
   - App ID: `cli_a954a77f4bb95bca`

### 2.2 配置权限套件

**路径：** 权限管理 → 权限套件 → 创建权限套件

**创建权限套件 "AI培训评估系统权限"：**

#### 必需权限清单：

1. **多维表格权限**
   - ✅ 查看
   - ✅ 评论
   - ✅ 编辑
   - ✅ 创建

2. **通讯录权限**
   - ✅ 读取部门信息 (contact:department:readonly)
   - ✅ 读取用户信息 (contact:user:readonly)
   - ✅ 获取用户邮箱 (contact:user.email:readonly)

3. **应用权限**
   - ✅ 获取应用信息 (bitable:app:readonly)

### 2.3 发布权限套件

1. 创建权限套件后，点击"发布"
2. 选择发布范围：
   - ✅ 整个组织
   - 或选择特定部门/用户

### 2.4 分发权限

**路径：** 权限管理 → 权限套件 → 分发

1. 找到刚创建的权限套件
2. 点击"分发"
3. 选择要分发的对象：
   - ✅ 组织内所有用户
   - 或特定用户/部门

### 2.5 等待权限生效

权限分发后通常需要 **1-5分钟** 生效。

---

## 🧪 第三步：验证权限配置（5分钟）

### 3.1 在飞书环境中打开应用

**重要：** 必须在飞书环境中打开应用才能使用飞书API

**方法1：飞书工作台打开**
1. 打开飞书工作台
2. 在应用中找到"AI培训评估系统"
3. 点击打开

**方法2：直接URL打开**
```
https://ai-training-evaluation.vercel.app/config.html
```
然后在飞书浏览器插件中打开

### 3.2 运行飞书API测试

1. 访问配置页面
2. 点击"测试飞书API"按钮
3. 查看控制台输出

**成功的标志：**
```
🔍 开始飞书API权限检查...

📱 检查飞书JS SDK...
✅ 飞书JS SDK已加载
   可用模块: bitable (多维表格), contact (通讯录), permission (权限)

🔐 检查应用权限...
   ✅ bitable:app: 已授权
   ✅ contact:department:readonly: 已授权
   ✅ contact:user:readonly: 已授权

📊 测试多维表格API...
   ✅ 应用列表获取成功
   ✅ 找到目标应用: AI培训评估系统

👥 测试通讯录API...
   ✅ 部门列表获取成功: 7个部门
   ✅ 用户列表获取成功: 8名用户

💾 测试数据API...
   ✅ 数据表: employees: 4条记录
   ✅ 数据表: training_scores: 0条记录

✅ 成功: 8 | ⚠️ 警告: 0 | ❌ 错误: 0
```

---

## 🎯 第四步：测试同步功能（5分钟）

### 4.1 测试组织架构同步

1. 访问角色配置页面：`https://ai-training-evaluation.vercel.app/role-config.html`
2. 找到"飞书组织架构同步"区域
3. 点击"同步组织架构"按钮
4. 查看控制台日志

**预期结果：**
```
🔍 调用飞书API获取部门列表...
🔍 调用飞书API获取员工列表...
✅ 成功获取 7 个部门
✅ 成功获取 8 名员工
飞书组织架构同步完成
```

### 4.2 测试Base配置同步

1. 访问系统配置页面：`https://ai-training-evaluation.vercel.app/config.html`
2. 点击"飞书Base配置"菜单
3. 点击"测试连接"按钮
4. 查看结果

**预期结果：**
```
✅ 连接成功！Base: GA1QbgqTzaHaVIsIKWDcFI79nuc，加载了 X 条员工记录
或
⚠️ 本地模式验证通过：Base配置正确，但需要飞书环境才能连接真实数据
```

### 4.3 测试评分保存

1. 访问评分页面：`https://ai-training-evaluation.vercel.app/index.html`
2. 选择员工，填写评分
3. 点击"保存评分"
4. 查看控制台日志

**预期结果：**
```
📝 尝试保存数据到表 training_scores，table_id: tblg3G6KPSAhBHNw
🔍 检测到飞书环境，尝试调用飞书API...
✅ 数据保存成功
```

---

## 🐛 常见问题排查

### 问题1：权限检查失败

**症状：**
```
❌ 权限: bitable:app: 请求失败 - User denied permission
```

**解决方案：**
1. 检查飞书应用权限套件是否已发布
2. 检查权限是否已分发到您的账号
3. 尝试重新打开应用，让权限请求重新弹出
4. 联系飞书管理员确认应用状态

### 问题2：API不可用

**症状：**
```
❌ 多维表格API: API不可用
❌ 通讯录API: API不可用
```

**解决方案：**
1. 确认在飞书环境中打开应用
2. 检查飞书JS SDK是否正确加载
3. 查看控制台是否有JavaScript错误
4. 尝试刷新页面或清除缓存

### 问题3：同步返回空数据

**症状：**
```
✅ 部门列表获取成功: 0个部门
✅ 用户列表获取成功: 0名用户
```

**可能原因：**
1. 权限配置不正确
2. 组织架构中没有数据
3. App Token或Table ID不正确

**解决方案：**
1. 重新检查权限配置
2. 确认飞书组织架构中有数据
3. 验证配置文件中的App Token和Table ID

### 问题4：Base连接测试失败

**症状：**
```
❌ 连接失败: 飞书环境检测正常，但Base连接失败
```

**解决方案：**
1. 检查Base App Token是否正确
2. 检查Base应用是否已发布
3. 确认Base表格ID是否正确
4. 尝试在飞书Base中直接打开表格验证

---

## 📊 权限配置检查清单

使用以下清单确保所有权限都已正确配置：

### 飞书开发者平台
- [ ] 应用已创建并发布
- [ ] App ID: cli_a954a77f4bb95bca
- [ ] 应用状态：已启用

### 权限套件
- [ ] 权限套件已创建
- [ ] 包含多维表格权限（查看、评论、编辑、创建）
- [ ] 包含通讯录权限（部门、用户、邮箱）
- [ ] 权限套件已发布

### 权限分发
- [ ] 权限已分发到您的账号
- [ ] 权限已分发到相关用户/部门

### 应用配置
- [ ] App Token: GA1QbgqTzaHaVIsIKWDcFI79nuc
- [ ] Base URL配置正确
- [ ] Table ID配置正确

### 环境检查
- [ ] 在飞书环境中打开应用
- [ ] 飞书JS SDK已加载
- [ ] 控制台无JavaScript错误

---

## 🎁 额外工具

### 1. 控制台快速测试

在浏览器控制台中输入：

```javascript
// 测试角色配置功能
window.RoleConfig.setUserRoles('测试用户', ['judge', 'hr'], 'by_name');

// 测试飞书权限检查
FeishuAPITester.runPermissionCheck();

// 查看权限配置指南
FeishuAPITester.generatePermissionGuide();

// 运行完整系统诊断
SystemDiagnostic.runFullDiagnostic();

// 测试特定按钮
SystemDiagnostic.testButton('saveBaseConfigBtn');
```

### 2. 本地模拟模式

如果不在飞书环境中，系统会自动使用模拟数据：

**组织架构模拟数据：**
- 7个部门
- 8名员工
- 完整的层级关系

**Base模拟数据：**
- 员工表：4名员工
- 评分配置：7个维度
- 培训评分表：空（等待添加）

---

## 📞 技术支持

如果按照以上步骤仍然无法解决问题，请提供以下信息：

1. **诊断报告** - 运行"测试飞书API"的完整控制台输出
2. **权限截图** - 飞书开发者平台中的权限配置截图
3. **环境信息** - 浏览器版本、操作系统
4. **错误日志** - 控制台中的完整错误信息

---

## 🔗 相关链接

- **飞书开发者平台**: https://open.feishu.cn/app
- **飞书API文档**: https://open.feishu.cn/document/
- **应用配置页面**: https://ai-training-evaluation.vercel.app/config.html
- **角色配置页面**: https://ai-training-evaluation.vercel.app/role-config.html
- **飞书Base**: https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc

---

**注意：** 
- ✅ 代码已修复并推送到GitHub
- ✅ Vercel正在自动部署最新版本
- ⏳ 等待2-3分钟后访问最新版本
- 🔑 飞书权限配置是成功的关键

现在您可以开始测试了！记住：**必须在飞书环境中打开应用才能使用飞书API功能**。
