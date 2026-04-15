/**
 * 用户管理API
 */

const express = require('express');
const router = express.Router();

/**
 * 获取当前用户信息
 */
router.get('/current', async (req, res, next) => {
  try {
    // 从飞书JS SDK获取的用户信息通常在前端已经获取
    // 这里可以作为中转或补充信息

    res.json({
      success: true,
      message: '用户信息需要从前端传递',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 获取用户列表（从飞书组织架构）
 */
router.get('/list', async (req, res, next) => {
  try {
    // 这里调用飞书API获取用户列表
    // 实际实现会在feishu.js中

    res.json({
      success: true,
      message: '需要实现飞书API调用',
      data: []
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
