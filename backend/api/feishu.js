/**
 * 飞书API代理路由
 * 安全地调用飞书API，避免在前端暴露App Secret
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

// 飞书API配置
const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';
const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;

// 缓存access_token
let accessTokenCache = {
  token: null,
  expiresAt: null
};

/**
 * 获取tenant_access_token
 */
async function getAccessToken() {
  // 如果缓存有效，直接返回
  if (accessTokenCache.token && Date.now() < accessTokenCache.expiresAt) {
    return accessTokenCache.token;
  }

  try {
    const response = await axios.post(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
      app_id: APP_ID,
      app_secret: APP_SECRET
    });

    if (response.data.code === 0) {
      const token = response.data.tenant_access_token;
      const expiresIn = response.data.expire; // 秒

      // 缓存token（提前5分钟过期）
      accessTokenCache = {
        token: token,
        expiresAt: Date.now() + (expiresIn - 300) * 1000
      };

      return token;
    } else {
      throw new Error(`获取token失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('获取飞书access_token失败:', error);
    throw error;
  }
}

/**
 * 获取用户信息
 */
router.get('/user/info', async (req, res, next) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: '缺少user_id参数'
      });
    }

    const token = await getAccessToken();

    const response = await axios.get(`${FEISHU_API_BASE}/contact/v3/users/${user_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        user_id_type: 'user_id'
      }
    });

    if (response.data.code === 0) {
      res.json({
        success: true,
        data: response.data.data.user
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.msg
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * 获取部门列表
 */
router.get('/departments', async (req, res, next) => {
  try {
    const { parent_department_id = '0', page_size = 50 } = req.query;

    const token = await getAccessToken();

    const response = await axios.get(`${FEISHU_API_BASE}/contact/v3/departments/:department_id/children`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        department_id: parent_department_id,
        user_id_type: 'user_id',
        page_size: page_size
      }
    });

    if (response.data.code === 0) {
      res.json({
        success: true,
        data: response.data.data.items,
        total: response.data.data.items.length
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.msg
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * 获取用户列表
 */
router.get('/users', async (req, res, next) => {
  try {
    const { department_id, page_size = 50 } = req.query;

    const token = await getAccessToken();

    const response = await axios.get(`${FEISHU_API_BASE}/contact/v3/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        department_id_type: 'department_id',
        user_id_type: 'user_id',
        page_size: page_size
      }
    });

    if (response.data.code === 0) {
      res.json({
        success: true,
        data: response.data.data.items,
        total: response.data.data.items.length
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.msg
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * 获取Base表格记录
 */
router.get('/bitable/records', async (req, res, next) => {
  try {
    const { app_token, table_id, page_size = 100 } = req.query;

    if (!app_token || !table_id) {
      return res.status(400).json({
        success: false,
        message: '缺少app_token或table_id参数'
      });
    }

    const token = await getAccessToken();

    const response = await axios.get(`${FEISHU_API_BASE}/bitable/v1/apps/${app_token}/tables/${table_id}/records`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        page_size: page_size
      }
    });

    if (response.data.code === 0) {
      res.json({
        success: true,
        data: response.data.data.items,
        total: response.data.data.total,
        has_more: response.data.data.has_more
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.msg
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * 创建Base表格记录
 */
router.post('/bitable/records', async (req, res, next) => {
  try {
    const { app_token, table_id, fields } = req.body;

    if (!app_token || !table_id || !fields) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    const token = await getAccessToken();

    const response = await axios.post(`${FEISHU_API_BASE}/bitable/v1/apps/${app_token}/tables/${table_id}/records`, {
      fields: fields
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.code === 0) {
      res.json({
        success: true,
        data: response.data.data.record
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.data.msg
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
