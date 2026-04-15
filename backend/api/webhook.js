/**
 * 飞书事件订阅Webhook
 * 接收飞书的事件通知，自动同步组织架构数据
 */

const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// 飞书验证令牌（如果配置了）
const VERIFICATION_TOKEN = process.env.FEISHU_VERIFICATION_TOKEN;
const ENCRYPT_KEY = process.env.FEISHU_ENCRYPT_KEY;

/**
 * 飞书事件订阅验证
 * 当你配置事件订阅时，飞书会发送一个验证请求
 */
router.get('/feishu', (req, res) => {
  const { challenge, token } = req.query;

  // 验证token
  if (VERIFICATION_TOKEN && token !== VERIFICATION_TOKEN) {
    return res.status(403).json({
      code: 403,
      msg: 'Invalid token'
    });
  }

  // 返回challenge以完成验证
  res.json({
    challenge: challenge
  });
});

/**
 * 接收飞书事件通知
 */
router.post('/feishu', async (req, res, next) => {
  try {
    console.log('收到飞书事件:', req.body);

    const { event_type, data } = req.body;

    // 处理不同类型的事件
    switch (event_type) {
      case 'user.add':
        await handleUserAdd(data);
        break;

      case 'user.modified':
        await handleUserModified(data);
        break;

      case 'department.add':
        await handleDepartmentAdd(data);
        break;

      case 'department.modified':
        await handleDepartmentModified(data);
        break;

      default:
        console.log('未处理的事件类型:', event_type);
    }

    // 返回成功响应
    res.json({
      code: 0,
      msg: 'success'
    });

  } catch (error) {
    console.error('处理飞书事件失败:', error);
    // 即使处理失败，也返回成功，避免飞书重复发送
    res.json({
      code: 0,
      msg: 'success'
    });
  }
});

/**
 * 处理用户新增事件
 */
async function handleUserAdd(data) {
  console.log('处理用户新增事件:', data);

  // 这里可以实现：
  // 1. 将新用户添加到数据库
  // 2. 或者添加到飞书Base员工表
  // 3. 发送通知给管理员

  // TODO: 实现具体的业务逻辑
}

/**
 * 处理用户信息变更事件
 */
async function handleUserModified(data) {
  console.log('处理用户信息变更事件:', data);

  // 这里可以实现：
  // 1. 更新数据库中的用户信息
  // 2. 或者更新飞书Base员工表
  // 3. 检查关键信息变更（如部门变动）

  // TODO: 实现具体的业务逻辑
}

/**
 * 处理部门新增事件
 */
async function handleDepartmentAdd(data) {
  console.log('处理部门新增事件:', data);

  // 这里可以实现：
  // 1. 将新部门添加到数据库
  // 2. 或者添加到飞书Base部门表
  // 3. 同步部门架构到本地缓存

  // TODO: 实现具体的业务逻辑
}

/**
 * 处理部门信息变更事件
 */
async function handleDepartmentModified(data) {
  console.log('处理部门信息变更事件:', data);

  // 这里可以实现：
  // 1. 更新数据库中的部门信息
  // 2. 或者更新飞书Base部门表
  // 3. 检查关键信息变更（如部门名称、负责人）

  // TODO: 实现具体的业务逻辑
}

module.exports = router;
