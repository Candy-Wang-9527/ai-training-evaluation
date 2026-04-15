# 📖 产品经理快速开始指南

**适用人群：** 产品经理、非技术人员
**预计时间：** 30分钟完成配置和部署
**难度等级：** ⭐⭐☆☆☆（简单）

---

## 🎯 你需要做什么（3步，20分钟）

### ✅ 第1步：配置飞书权限（5分钟）

#### 1.1 登录飞书开放平台

```
https://open.feishu.cn/app
```

找到你的应用：`cli_a954a77f4bb95bca`

#### 1.2 添加权限套件

点击：**权限管理** → **权限套件** → **创建权限套件**

勾选以下权限：
- ✅ `contact:user.base:readonly` - 获取用户基本信息
- ✅ `contact:user.email:readonly` - 获取用户邮箱
- ✅ `contact:department:readonly` - 获取部门信息
- ✅ `contact:user:readonly` - 获取部门下的用户
- ✅ `contact:user.department:readonly` - 获取用户所属部门
- ✅ `bitable:app:readonly` - 多维表格查看
- ✅ `bitable:app` - 多维表格编辑

点击 **"保存"** → 输入名称 → 点击 **"发布权限套件"**

#### 1.3 分发权限

点击：**权限管理** → **权限与分组** → 找到你创建的套件 → 点击 **"发布权限"**

选择 **"全员"** → 点击 **"确认发布"**

---

### ✅ 第2步：部署到Vercel（10分钟）

#### 2.1 安装部署工具（推荐但非必需）

打开命令行工具（Windows: `Win + R` → 输入 `cmd`）

```bash
npm install -g vercel
```

如果提示 `npm` 命令不存在，访问：https://nodejs.org/ 下载安装

#### 2.2 登录Vercel

```bash
vercel login
```

按提示操作（推荐使用GitHub登录）

#### 2.3 部署

```bash
cd d:\software\ai_training_evaluation
vercel
```

一直按回车或输入 `Y` 即可。

等待2-5分钟，Vercel会显示：
```
✅ Production: https://ai-training-evaluation.vercel.app
```

**恭喜！你的应用已经上线了！** 🎉

---

### ✅ 第3步：配置环境变量（5分钟）

#### 方式A：使用命令行（推荐）

依次执行以下命令（我会帮你准备好所有值）：

```bash
# 飞书App ID
vercel env add FEISHU_APP_ID production
# 输入：cli_a954a77f4bb95bca

# 飞书App Secret
vercel env add FEISHU_APP_SECRET production
# 输入：1qkoA78XBoye66WmSRypuhHpIHt2Qlso

# Base App Token
vercel env add BASE_APP_TOKEN production
# 输入：MiG6bsjMiaEwAEskaSScC7W8nGb

# Base URL
vercel env add BASE_URL production
# 输入：https://st3m3xa39z.feishu.cn/base/MiG6bsjMiaEwAEskaSScC7W8nGb

# 员工表ID
vercel env add TABLE_EMPLOYEES production
# 输入：tbl0fkpRKGAaCaPy

# 培训表ID
vercel env add TABLE_TRAININGS production
# 输入：tblShvLC5LCYzzfV

# 培训评分表ID
vercel env add TABLE_TRAINING_SCORES production
# 输入：tblxLgRDWMSz8xZo

# 应用评分表ID
vercel env add TABLE_APPLICATION_SCORES production
# 输入：tblNOBTibciFt8EC

# 评分配置表ID
vercel env add TABLE_SCORE_CONFIGS production
# 输入：tblJuSwhGEr94Pbu
```

最后重新部署：
```bash
vercel --prod
```

#### 方式B：使用网页版（如果没有安装CLI）

1. 访问：https://vercel.com/dashboard
2. 找到项目 `ai-training-evaluation`
3. 点击 **Settings** → **Environment Variables**
4. 点击 **Add New**，依次添加上述环境变量
5. 点击 **Deployments** → **Redeploy**

---

## 🧪 测试验证（5分钟）

### 1. 在飞书中打开应用

打开飞书客户端 → 工作台 → 找到你的应用

或者直接访问：
```
https://ai-training-evaluation.vercel.app
```

### 2. 检查功能

✅ **检查1：用户信息**
- 顶部应该显示你的真实姓名（不是"访客"）
- 用户角色应该显示正确

✅ **检查2：员工列表**
- 员工下拉框应该显示真实的员工数据
- 不是测试数据（张三、李四等）

✅ **检查3：组织架构同步**
- 访问 `role-config.html`
- 点击 **"同步组织架构"** 按钮
- 应该显示真实的部门数量和员工数量

✅ **检查4：评分功能**
- 选择一个员工
- 调整评分滑块
- 点击 **"保存评分"**
- 应该提示保存成功

---

## ❓ 遇到问题？

### 问题1：看不到真实用户数据

**原因：** 飞书权限未生效

**解决：**
1. 等待5分钟（权限生效需要时间）
2. 刷新飞书应用
3. 清除浏览器缓存（`Ctrl + Shift + Delete`）
4. 重新打开应用

### 问题2：按钮点击没反应

**原因：** JavaScript加载失败

**解决：**
1. 按 `F12` 打开浏览器控制台
2. 查看 `Console` 标签是否有红色错误
3. 将错误信息反馈给我

### 问题3：部署失败

**原因：** 可能是网络问题或Vercel账号问题

**解决：**
1. 检查网络连接
2. 确认Vercel账号正常
3. 重新执行 `vercel` 命令

---

## 📞 需要帮助？

### 随时联系我

- 如果任何步骤不清楚，告诉我
- 我可以提供更详细的图文说明
- 或者帮你远程操作（如果你信任的话）

### 文档资源

- [Vercel部署完整指南](vercel-deployment-guide.md) - 更详细的步骤
- [系统诊断报告](../reports/system-diagnostic-report-20260415.md) - 技术细节
- [飞书Base配置指南](feishu-base-setup.md) - Base配置说明

---

## 🎉 完成后你将拥有

✅ 一个在Vercel上运行的完整AI培训评估系统
✅ 真实的飞书用户数据自动同步
✅ 安全的API调用（App Secret不暴露）
✅ 随时可以访问的在线应用

**接下来你可以：**
1. ✅ 邀请其他用户测试
2. ✅ 根据反馈优化功能
3. ✅ 查看统计分析
4. ✅ 开始正式使用

---

**预计完成时间：** 今天就能完成！🚀
**需要我的帮助：** 随时告诉我！
