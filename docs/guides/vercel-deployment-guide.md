# 📚 Vercel部署完整指南 - 产品经理版

**适用人群：** 产品经理、非技术人员
**部署难度：** ⭐⭐☆☆☆（简单）
**预计时间：** 30分钟

---

## 📋 部署前准备清单

### ✅ 已完成
- [x] 飞书应用已创建
- [x] 飞书Base多维表格已创建
- [x] 本地代码已准备
- [x] 环境变量文件已创建（.env）

### ⏳ 需要你完成的（5分钟）
- [ ] 注册Vercel账号
- [ ] 安装Vercel CLI（可选，但推荐）
- [ ] 配置飞书权限套件

---

## 🚀 第一步：配置飞书权限（5分钟）

### 1.1 登录飞书开放平台

```
https://open.feishu.cn/app
```

### 1.2 进入应用配置

找到你的应用（App ID: `cli_a954a77f4bb95bca`）

### 1.3 配置权限套件

**操作步骤：**

1. 点击左侧菜单 **"权限管理"**
2. 点击 **"权限套件"** 标签
3. 点击 **"创建权限套件"** 按钮

**需要添加的权限：**

| 序号 | 权限名称 | 权限ID | 必需/可选 |
|------|---------|--------|----------|
| 1 | 获取用户统一ID | `contact:user.base:readonly` | ✅ 必需 |
| 2 | 获取用户邮箱 | `contact:user.email:readonly` | ✅ 必需 |
| 3 | 获取部门信息 | `contact:department:readonly` | ✅ 必需 |
| 4 | 获取部门下的用户 | `contact:user:readonly` | ✅ 必需 |
| 5 | 获取用户所属部门 | `contact:user.department:readonly` | ✅ 必需 |
| 6 | 多维表格-查看 | `bitable:app:readonly` | ✅ 必需 |
| 7 | 多维表格-编辑 | `bitable:app` | ✅ 必需 |
| 8 | 多维表格-创建记录 | `bitable:app:record:create` | ✅ 必需 |

**操作方法：**

在权限套件配置页面：
1. 在搜索框中搜索上述权限名称
2. 勾选所有权限
3. 点击 **"保存"**
4. 输入权限套件名称，如"AI培训评估系统权限"
5. 点击 **"发布权限套件"**

### 1.4 分发权限

**操作步骤：**

1. 点击左侧菜单 **"权限管理"**
2. 点击 **"权限与分组"** 标签
3. 找到你创建的权限套件
4. 点击右侧的 **"发布权限"** 按钮
5. 在弹出窗口中：
   - 选择 **"全员"** （或者选择特定部门/用户）
   - 点击 **"确认发布"**

### 1.5 等待权限生效

权限生效通常需要 **1-5分钟**。

**验证方法：**
- 刷新飞书应用
- 清除浏览器缓存
- 重新打开应用

---

## 🔧 第二步：安装部署工具（可选，5分钟）

### 方式A：使用Vercel CLI（推荐）⭐⭐⭐⭐⭐

**为什么推荐：**
- ✅ 操作简单，一行命令完成部署
- ✅ 自动上传环境变量
- ✅ 支持自动更新

**安装步骤：**

1. **打开命令行工具**
   - Windows: 按 `Win + R`，输入 `cmd`，回车
   - Mac: 打开"终端"应用

2. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

   如果提示 `npm` 命令不存在，需要先安装Node.js：
   - 访问：https://nodejs.org/
   - 下载并安装LTS版本
   - 安装完成后重新执行上述命令

3. **登录Vercel**
   ```bash
   vercel login
   ```

   按照提示操作：
   - 选择登录方式（推荐使用GitHub登录）
   - 授权Vercel访问你的账号
   - 等待登录成功

### 方式B：使用网页版（不需要安装工具）⭐⭐⭐☆☆

**优点：** 不需要安装任何软件
**缺点：** 需要手动配置，步骤较多

**访问地址：** https://vercel.com/new

---

## 📤 第三步：部署到Vercel（10分钟）

### 使用CLI部署（推荐）

**操作步骤：**

1. **打开项目目录**
   ```bash
   cd d:\software\ai_training_evaluation
   ```

2. **执行部署命令**
   ```bash
   vercel
   ```

3. **按提示操作**

   Vercel会问你几个问题，按以下方式回答：

   ```
   ? Set up and deploy "~/d:\software\ai_training_evaluation"? [Y/n] Y
   ? Which scope do you want to deploy to? (选择你的账号)
   ? Link to existing project? [y/N] N
   ? What's your project's name? ai-training-evaluation
   ? In which directory is your code located? ./
   ? Want to override the settings? [y/N] N
   ```

4. **等待部署完成**

   Vercel会自动：
   - 上传代码
   - 安装依赖
   - 构建项目
   - 部署到CDN

   预计需要 **2-5分钟**

5. **获取部署地址**

   部署成功后，Vercel会显示：
   ```
   ✅ Production: https://ai-training-evaluation.vercel.app
   ```

   **恭喜！你的应用已经上线了！** 🎉

### 使用网页版部署

**操作步骤：**

1. **访问Vercel导入页面**
   ```
   https://vercel.com/new
   ```

2. **导入项目**

   - 如果你的代码在GitHub：点击"Import Git Repository"
   - 如果代码在本地：点击"Upload a File or Folder"

3. **配置项目**

   - **Project Name**: `ai-training-evaluation`
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
   - **Build Command**: 留空
   - **Output Directory**: 留空

4. **点击"Deploy"**

   等待部署完成（2-5分钟）

---

## 🔐 第四步：配置环境变量（5分钟）

### 方式A：使用CLI（推荐）

**操作步骤：**

1. **添加环境变量**
   ```bash
   vercel env add FEISHU_APP_ID production
   ```
   输入：`cli_a954a77f4bb95bca`

2. **依次添加所有环境变量**
   ```bash
   # 飞书App Secret
   vercel env add FEISHU_APP_SECRET production
   # 输入：1qkoA78XBoye66WmSRypuhHpIHt2Qlso

   # Base App Token
   vercel env add BASE_APP_TOKEN production
   # 输入：MiG6bsjMiaEwAEskaSScC7W8nGb

   # Base URL
   vercel env add BASE_URL production
   # 输入：https://st3m3xa39z.feishu.cn/base/MiG6bsjMiaEwAEskaSScC7W8nGb

   # 表格ID（需要依次添加5个）
   vercel env add TABLE_EMPLOYEES production
   # 输入：tbl0fkpRKGAaCaPy

   vercel env add TABLE_TRAININGS production
   # 输入：tblShvLC5LCYzzfV

   vercel env add TABLE_TRAINING_SCORES production
   # 输入：tblxLgRDWMSz8xZo

   vercel env add TABLE_APPLICATION_SCORES production
   # 输入：tblNOBTibciFt8EC

   vercel env add TABLE_SCORE_CONFIGS production
   # 输入：tblJuSwhGEr94Pbu
   ```

3. **重新部署**
   ```bash
   vercel --prod
   ```

### 方式B：使用网页版

**操作步骤：**

1. **进入项目设置**
   - 访问：https://vercel.com/dashboard
   - 找到你的项目 `ai-training-evaluation`
   - 点击项目名称进入详情页
   - 点击顶部的 **"Settings"** 标签

2. **添加环境变量**
   - 点击左侧菜单 **"Environment Variables"**
   - 点击 **"Add New"** 按钮
   - 按照下表依次添加：

   | Key | Value | Environment |
   |-----|-------|-------------|
   | FEISHU_APP_ID | cli_a954a77f4bb95bca | Production |
   | FEISHU_APP_SECRET | 1qkoA78XBoye66WmSRypuhHpIHt2Qlso | Production |
   | BASE_APP_TOKEN | MiG6bsjMiaEwAEskaSScC7W8nGb | Production |
   | BASE_URL | https://st3m3xa39z.feishu.cn/base/MiG6bsjMiaEwAEskaSScC7W8nGb | Production |
   | TABLE_EMPLOYEES | tbl0fkpRKGAaCaPy | Production |
   | TABLE_TRAININGS | tblShvLC5LCYzzfV | Production |
   | TABLE_TRAINING_SCORES | tblxLgRDWMSz8xZo | Production |
   | TABLE_APPLICATION_SCORES | tblNOBTibciFt8EC | Production |
   | TABLE_SCORE_CONFIGS | tblJuSwhGEr94Pbu | Production |

3. **重新部署**
   - 点击顶部的 **"Deployments"** 标签
   - 找到最新的部署记录
   - 点击右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**

---

## ✅ 第五步：配置飞书应用（5分钟）

### 5.1 获取部署地址

你的应用部署地址类似：
```
https://ai-training-evaluation.vercel.app
```

或者你自定义的域名。

### 5.2 配置飞书应用首页

**操作步骤：**

1. 登录飞书开放平台
2. 找到你的应用
3. 点击 **"应用功能"** → **"网页"** → **"移动端应用首页"**
4. 输入你的Vercel部署地址：
   ```
   https://ai-training-evaluation.vercel.app/index.html
   ```
5. 点击 **"保存"**
6. 同样配置 **"PC端应用首页"**（如果需要）

### 5.3 发布应用

**操作步骤：**

1. 点击左侧菜单 **"版本管理与发布"**
2. 点击 **"创建版本"**
3. 填写版本信息：
   - 版本号：`1.0.0`
   - 更新说明：`首次发布`
4. 点击 **"保存"**
5. 点击 **"申请发布"**
6. 选择发布范围：
   - **测试版**：只有指定的用户可以看到
   - **正式版**：所有用户都可以看到
7. 等待审核通过（通常几分钟）

---

## 🧪 第六步：测试验证（5分钟）

### 6.1 在飞书中打开应用

**方法1：从飞书工作台打开**
1. 打开飞书客户端
2. 点击左侧 **"工作台"**
3. 找到你的应用（如果已发布）
4. 点击应用图标打开

**方法2：直接访问URL**
```
https://ai-training-evaluation.vercel.app
```

### 6.2 验证功能

**检查清单：**

- [ ] 页面能正常打开
- [ ] 显示当前用户信息（不是"访客"）
- [ ] 用户角色显示正确
- [ ] 员工列表显示真实数据（不是测试数据）
- [ ] 点击按钮有响应
- [ ] 组织架构能正常同步

**测试按钮功能：**

1. **测试角色配置页面**
   - 访问：`https://ai-training-evaluation.vercel.app/role-config.html`
   - 点击 **"同步组织架构"** 按钮
   - 应该显示真实的部门数量和员工数量

2. **测试评分功能**
   - 访问：`https://ai-training-evaluation.vercel.app/index.html`
   - 选择员工
   - 调整评分滑块
   - 点击 **"保存评分"**
   - 应该提示保存成功

### 6.3 查看日志

**如果遇到问题，查看日志：**

1. **打开浏览器控制台**
   - Windows: 按 `F12`
   - Mac: `Cmd + Option + I`

2. **查看Console标签**
   - 红色文字表示错误
   - 黄色文字表示警告

3. **查看Network标签**
   - 查看API请求是否成功
   - 状态码 `200` 表示成功
   - 状态码 `4xx` 或 `5xx` 表示失败

---

## 🎯 常见问题解决

### 问题1：部署后页面404

**原因：** 文件路径不正确

**解决：**
- 检查URL是否正确
- 确保文件存在（如index.html在根目录）
- 访问完整URL，如：`https://你的域名.vercel.app/index.html`

### 问题2：API请求失败

**原因：** 环境变量未配置

**解决：**
1. 访问Vercel项目设置
2. 检查环境变量是否全部添加
3. 重新部署应用

### 问题3：无法获取用户信息

**原因：** 飞书权限未配置或未生效

**解决：**
1. 检查飞书权限套件是否配置
2. 确认权限已分发
3. 等待5分钟后重试
4. 清除浏览器缓存

### 问题4：按钮点击没反应

**原因：** JavaScript加载失败

**解决：**
1. 打开浏览器控制台查看错误
2. 检查js/api-client.js是否加载
3. 确认后端服务运行正常

---

## 📊 部署成功标志

如果看到以下情况，说明部署成功：

✅ **Vercel显示：**
```
✅ Production: https://ai-training-evaluation.vercel.app
```

✅ **浏览器控制台显示：**
```
📡 后端API客户端已加载
API基础地址: /api
```

✅ **角色配置页面显示：**
```
✅ 已同步组织架构
部门数量：X个，员工数量：X人
```

✅ **飞书应用显示：**
- 当前用户：显示你的真实姓名
- 用户角色：显示正确角色（如"评审员"）
- 员工列表：显示真实的员工数据

---

## 🎉 恭喜部署完成！

你的AI培训评估系统现在已经在Vercel上运行了！

**下一步建议：**
1. ✅ 在飞书应用中测试所有功能
2. ✅ 邀请其他用户进行UAT测试
3. ✅ 根据反馈优化用户体验
4. ✅ 定期检查Vercel使用情况

**技术支持：**
- 遇到问题随时联系我
- 查看Vercel文档：https://vercel.com/docs
- 查看飞书开放平台文档：https://open.feishu.cn/document

---

**文档更新日期：** 2026年4月15日
**技术支持：** AI助手 + 兆原数通（北京）数据科技有限公司
