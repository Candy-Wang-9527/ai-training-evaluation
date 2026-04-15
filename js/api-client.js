/**
 * AI培训评估系统 - 后端API客户端
 * 统一管理所有后端API调用
 */

class APIClient {
  constructor() {
    // 自动检测API地址
    this.baseURL = this.getBaseURL();
  }

  /**
   * 获取API基础URL
   */
  getBaseURL() {
    // 如果在Vercel环境，使用相对路径
    if (window.location.hostname.includes('vercel.app') ||
        window.location.hostname.includes('feishu.cn')) {
      return '/api';
    }

    // 如果在本地开发，使用本地服务器
    if (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }

    // 默认使用相对路径
    return '/api';
  }

  /**
   * 通用请求方法
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      console.log(`📡 API请求: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      console.log(`✅ API响应:`, data);
      return data;

    } catch (error) {
      console.error(`❌ API错误:`, error);
      throw error;
    }
  }

  // ==================== 飞书API ====================

  /**
   * 获取用户信息
   */
  async getUserInfo(userId) {
    return await this.request(`/feishu/user/info?user_id=${userId}`);
  }

  /**
   * 获取部门列表
   */
  async getDepartments(parentDepartmentId = '0') {
    return await this.request(`/feishu/departments?parent_department_id=${parentDepartmentId}`);
  }

  /**
   * 获取用户列表
   */
  async getUsers(departmentId) {
    const params = departmentId ? `?department_id=${departmentId}` : '';
    return await this.request(`/feishu/users${params}`);
  }

  /**
   * 获取Base表格记录
   */
  async getBitableRecords(appToken, tableId, pageSize = 100) {
    return await this.request(`/feishu/bitable/records?app_token=${appToken}&table_id=${tableId}&page_size=${pageSize}`);
  }

  /**
   * 创建Base表格记录
   */
  async createBitableRecord(appToken, tableId, fields) {
    return await this.request('/feishu/bitable/records', {
      method: 'POST',
      body: JSON.stringify({
        app_token: appToken,
        table_id: tableId,
        fields: fields
      })
    });
  }

  // ==================== 用户API ====================

  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    return await this.request('/users/current');
  }

  /**
   * 获取用户列表
   */
  async getUserList() {
    return await this.request('/users/list');
  }

  // ==================== 部门API ====================

  /**
   * 获取部门列表
   */
  async getDepartmentList() {
    return await this.request('/departments/list');
  }

  /**
   * 获取部门的员工列表
   */
  async getDepartmentUsers(departmentId) {
    return await this.request(`/departments/${departmentId}/users`);
  }

  // ==================== 评分API ====================

  /**
   * 保存培训评分
   */
  async saveTrainingScore(scoreData) {
    return await this.request('/scores/training', {
      method: 'POST',
      body: JSON.stringify(scoreData)
    });
  }

  /**
   * 保存应用评分
   */
  async saveApplicationScore(scoreData) {
    return await this.request('/scores/application', {
      method: 'POST',
      body: JSON.stringify(scoreData)
    });
  }

  /**
   * 获取评分统计
   */
  async getScoreStatistics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/scores/statistics?${queryString}`);
  }
}

// 创建全局实例
const apiClient = new APIClient();

// 导出到全局
window.APIClient = apiClient;

console.log('📡 后端API客户端已加载');
console.log('API基础地址:', apiClient.baseURL);
