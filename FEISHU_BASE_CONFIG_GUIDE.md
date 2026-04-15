# 飞书Base配置功能使用指南

## 功能概述

系统已全面修复飞书Base配置功能，现在支持：
- ✅ 自动配置默认的飞书Base信息
- ✅ 保存和管理Base连接配置
- ✅ 自动生成网页嵌入代码
- ✅ 在多个页面动态加载Base嵌入
- ✅ Base连接测试功能

## 默认配置

系统已预配置以下飞书Base信息：

```javascript
Base URL: https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc
App Token: GA1QbgqTzaHaVIsIKWDcFI79nuc

子表格ID:
- 员工表: tblIVqXEzmZdKxjI
- 培训表: tblCfjFzfiZ2yvRr
- 培训评分表: tblg3G6KPSAhBHNw
- 应用评分表: tblHwmO8RAe9KBIm
- 评分配置表: tblaZKWjxym9YnLJ
```

## 使用步骤

### 1. 配置Base信息

1. 访问配置页面：`https://ai-training-evaluation.vercel.app/config.html`
2. 点击左侧菜单的"飞书Base配置"
3. 填写Base信息（已预填充默认值）
4. 点击"测试连接"验证配置
5. 点击"保存Base配置"

### 2. 生成嵌入代码

配置保存后，系统会自动生成嵌入代码：

```html
<iframe
  src="https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc/embed"
  width="100%"
  height="600"
  frameborder="0"
  scrolling="auto">
</iframe>
```

### 3. 查看嵌入效果

配置完成后，Base嵌入会自动显示在以下页面：
- **评分页面** (`index.html`) - 底部Base嵌入区域
- **统计分析页面** (`statistics.html`) - 数据表格区域

## 功能详解

### 配置管理

#### 保存配置
- 所有配置自动保存到浏览器localStorage
- 包含：App Token、Base URL、各表格ID、嵌入Block ID
- 下次访问自动加载

#### 清空配置
- 点击"清空配置"按钮
- 确认后清除所有Base配置
- 恢复默认嵌入代码

#### 测试连接
- **飞书环境**：真实连接Base，加载员工数据
- **本地环境**：验证配置格式，显示模拟模式提示
- 显示连接状态和加载的数据量

### 嵌入代码生成

#### 自动生成
- 修改任何Base配置字段时自动重新生成
- 支持标准嵌入和自定义Block ID嵌入

#### 自定义Block ID
如果需要嵌入特定视图：
1. 在飞书Base中获取视图的Block ID
2. 填写到"嵌入Block ID"字段
3. 系统自动生成对应的嵌入代码

### 多页面同步

配置一次，全局生效：
1. 在`config.html`中配置Base信息
2. 配置自动保存到localStorage
3. 所有页面自动读取最新配置
4. Base嵌入在所有页面同步更新

受影响的页面：
- `index.html` - 评分页面
- `statistics.html` - 统计分析页面
- `config.html` - 配置页面（预览）

## 技术实现

### 文件结构

```
js/
├── feishu-config.js    # 飞书Base配置常量
├── base-embed.js       # Base嵌入管理器（新增）
├── config.js          # 配置页面逻辑（已增强）
└── app.js             # 主应用逻辑（已修改）

pages/
├── config.html        # 配置页面（已增强）
├── index.html         # 评分页面（已修改）
└── statistics.html    # 统计页面（已修改）
```

### 核心功能

#### 1. Base嵌入管理器 (base-embed.js)

```javascript
// 自动初始化所有Base容器
BaseEmbedManager.init('baseContainer');

// 手动刷新嵌入
BaseEmbedManager.refresh('baseContainer');

// 打开Base新页面
BaseEmbedManager.openBase();
```

#### 2. 配置管理 (config.js)

```javascript
// 保存配置
saveBaseConfig();

// 加载配置
loadBaseConfig();

// 测试连接
testBaseConnection();

// 生成嵌入代码
generateEmbedCode();
```

### 数据流程

1. **配置阶段**
   ```
   用户填写表单 → 点击保存 → 保存到localStorage → 生成嵌入代码
   ```

2. **加载阶段**
   ```
   页面加载 → 读取localStorage → 渲染iframe → 显示Base内容
   ```

3. **同步阶段**
   ```
   配置更新 → 更新localStorage → 通知所有页面 → 自动刷新嵌入
   ```

## 故障排查

### 问题1: Base嵌入不显示

**可能原因：**
- localStorage未保存配置
- 网络连接问题
- Base URL不正确

**解决方法：**
1. 打开浏览器开发者工具(F12) → Console
2. 查看是否有JavaScript错误
3. 检查localStorage中是否有`feishuBaseEmbed`
4. 重新在config.html中保存配置

### 问题2: 配置保存失败

**可能原因：**
- 浏览器禁用localStorage
- 字段验证失败

**解决方法：**
1. 检查浏览器是否允许localStorage
2. 确保必填字段（App Token、Base URL）已填写
3. 清除浏览器缓存后重试

### 问题3: 连接测试失败

**可能原因：**
- 不在飞书环境中
- App Token或Base URL错误
- 网络连接问题

**解决方法：**
1. 本地开发时显示"模拟模式"是正常的
2. 确认Base URL格式正确
3. 在飞书环境中重新测试

### 问题4: 嵌入代码不同步

**可能原因：**
- 多个标签页未刷新
- localStorage未正确更新

**解决方法：**
1. 在config.html中重新保存配置
2. 刷新所有打开的页面
3. 清除浏览器缓存后重试

## 高级功能

### 自定义嵌入视图

如果只想嵌入特定的表格视图：

1. 在飞书Base中找到要嵌入的视图
2. 获取视图的Block ID
3. 在配置页面的"嵌入Block ID"字段中填入
4. 保存配置

示例：
```
Base URL: https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc
嵌入Block ID: blkXXXXX
```

生成的嵌入URL：
```
https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc/embed?blockId=blkXXXXX
```

### 编程式访问

```javascript
// 获取当前嵌入配置
const config = BaseEmbedManager.loadEmbedConfig();
console.log(config.embedUrl);

// 手动渲染嵌入
const container = document.getElementById('myContainer');
BaseEmbedManager.renderEmbed(container, 'https://...');

// 刷新特定容器
BaseEmbedManager.refresh('baseContainer');
```

## 安全建议

1. **保护App Token**
   - App Token默认以密码形式显示
   - 点击眼睛图标可切换显示/隐藏
   - 不要在公开场合分享完整配置

2. **数据备份**
   - 定期导出配置页面数据
   - 保存重要配置到本地文件

3. **权限管理**
   - 确保Base表格的访问权限正确设置
   - 只允许授权用户访问敏感数据

## 更新日志

### v1.1.0 (2026-04-15)
- ✅ 添加默认Base配置
- ✅ 实现配置自动保存
- ✅ 创建Base嵌入管理器
- ✅ 支持多页面同步
- ✅ 添加连接测试功能
- ✅ 优化用户体验

### v1.0.0
- 初始版本

## 技术支持

如有问题，请：
1. 查看浏览器控制台的日志信息
2. 参考本文档的故障排查部分
3. 联系技术支持：王浩

## 链接

- 配置页面：https://ai-training-evaluation.vercel.app/config.html
- 评分页面：https://ai-training-evaluation.vercel.app/index.html
- 统计分析：https://ai-training-evaluation.vercel.app/statistics.html
- 飞书Base：https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc
