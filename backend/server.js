/**
 * AI培训评估系统 - 后端服务器
 * 运行在Vercel Serverless环境
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// 导入路由
const feishuRoutes = require('./api/feishu');
const userRoutes = require('./api/users');
const departmentRoutes = require('./api/departments');
const scoreRoutes = require('./api/scores');
const webhookRoutes = require('./api/webhook');

// 创建Express应用
const app = express();

// 中间件配置
app.use(helmet({
  contentSecurityPolicy: false, // 飞书应用需要加载外部资源
}));
app.use(compression());
app.use(cors({
  origin: '*', // 生产环境应该限制具体域名
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API路由
app.use('/api/feishu', feishuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/webhook', webhookRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.path
  });
});

// 导出应用（Vercel需要）
module.exports = app;

// 如果是本地开发，启动服务器
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`
🚀 AI培训评估系统后端服务已启动！

📡 服务器地址: http://localhost:${PORT}
🏥 健康检查: http://localhost:${PORT}/health
📖 API文档: http://localhost:${PORT}/api/docs

环境变量状态:
✅ FEISHU_APP_ID: ${process.env.FEISHU_APP_ID ? '已配置' : '未配置'}
✅ BASE_APP_TOKEN: ${process.env.BASE_APP_TOKEN ? '已配置' : '未配置'}
✅ TABLE_EMPLOYEES: ${process.env.TABLE_EMPLOYEES ? '已配置' : '未配置'}

按 Ctrl+C 停止服务器
    `);
  });
}
