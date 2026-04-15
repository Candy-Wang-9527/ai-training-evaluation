/**
 * 部门管理API
 */

const express = require('express');
const router = express.Router();

/**
 * 获取部门列表
 */
router.get('/list', async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: '需要实现飞书API调用',
      data: []
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 获取部门的员工列表
 */
router.get('/:department_id/users', async (req, res, next) => {
  try {
    const { department_id } = req.params;

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
