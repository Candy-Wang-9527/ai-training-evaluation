/**
 * 评分管理API
 */

const express = require('express');
const router = express.Router();

/**
 * 保存培训评分
 */
router.post('/training', async (req, res, next) => {
  try {
    const { employee_name, evaluation_date, scores, evaluator } = req.body;

    // 验证数据
    if (!employee_name || !evaluation_date || !scores) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    // 这里应该保存到飞书Base
    // 暂时返回成功
    res.json({
      success: true,
      message: '培训评分已保存',
      data: {
        id: Date.now(),
        employee_name,
        evaluation_date,
        scores,
        evaluator,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 保存应用评分
 */
router.post('/application', async (req, res, next) => {
  try {
    const { employee_name, evaluation_date, scores, evaluator, comments } = req.body;

    // 验证数据
    if (!employee_name || !evaluation_date || !scores) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    // 这里应该保存到飞书Base
    // 暂时返回成功
    res.json({
      success: true,
      message: '应用评分已保存',
      data: {
        id: Date.now(),
        employee_name,
        evaluation_date,
        scores,
        evaluator,
        comments,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 获取评分统计
 */
router.get('/statistics', async (req, res, next) => {
  try {
    const { start_date, end_date, department } = req.query;

    // 这里应该从飞书Base查询数据
    res.json({
      success: true,
      message: '需要实现飞书Base查询',
      data: {
        total: 0,
        average_score: 0,
        by_department: {}
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
