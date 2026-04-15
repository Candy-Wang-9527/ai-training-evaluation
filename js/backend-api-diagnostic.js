/**
 * 后端API诊断工具
 * 用于验证Vercel后端API是否正常工作
 */

class BackendAPIDiagnostic {
    constructor() {
        this.baseURL = this.getBaseURL();
        this.testResults = [];
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
     * 运行完整诊断
     */
    async runFullDiagnostic() {
        console.log('🔍 开始后端API诊断...');
        console.log('📍 API基础地址:', this.baseURL);

        this.testResults = [];
        this.clearOutput();

        this.log('info', '🔍 开始后端API诊断...');
        this.log('info', `📍 API基础地址: ${this.baseURL}`);
        this.log('info', `🌐 当前环境: ${window.location.hostname}`);
        this.log('info', '');

        // 测试1：检查后端服务器是否可访问
        await this.testServerHealth();

        // 测试2：检查飞书API配置
        await this.testFeishuAPIConfig();

        // 测试3：测试获取部门列表
        await this.testGetDepartments();

        // 测试4：测试获取用户列表
        await this.testGetUsers();

        // 测试5：测试获取当前用户
        await this.testGetCurrentUser();

        // 生成诊断报告
        this.generateReport();
    }

    /**
     * 测试服务器健康状态
     */
    async testServerHealth() {
        this.log('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.log('info', '测试1: 检查后端服务器可访问性');

        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.log('success', `✅ 后端服务器可访问`);
                this.log('success', `   响应: ${JSON.stringify(data)}`);
                this.testResults.push({ name: '服务器健康检查', status: 'pass', message: '服务器可访问' });
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            this.log('error', `❌ 后端服务器不可访问`);
            this.log('error', `   错误: ${error.message}`);
            this.testResults.push({ name: '服务器健康检查', status: 'fail', message: error.message });
        }

        this.log('info', '');
    }

    /**
     * 测试飞书API配置
     */
    async testFeishuAPIConfig() {
        this.log('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.log('info', '测试2: 检查飞书API配置');

        try {
            // 测试获取access token
            const response = await fetch(`${this.baseURL}/feishu/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.access_token) {
                    this.log('success', `✅ 飞书API配置正确`);
                    this.log('success', `   App ID: ${data.data.app_id || '未返回'}`);
                    this.log('success', `   Token前缀: ${data.data.access_token.substring(0, 20)}...`);
                    this.testResults.push({ name: '飞书API配置', status: 'pass', message: '配置正确' });
                } else {
                    throw new Error(data.message || '获取token失败');
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            this.log('error', `❌ 飞书API配置有问题`);
            this.log('error', `   错误: ${error.message}`);
            this.log('warning', `   可能原因：`);
            this.log('warning', `   1. Vercel环境变量未配置或配置错误`);
            this.log('warning', `   2. 飞书App ID或App Secret不正确`);
            this.log('warning', `   3. 后端服务器未正确部署`);
            this.testResults.push({ name: '飞书API配置', status: 'fail', message: error.message });
        }

        this.log('info', '');
    }

    /**
     * 测试获取部门列表
     */
    async testGetDepartments() {
        this.log('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.log('info', '测试3: 获取飞书部门列表');

        try {
            const response = await fetch(`${this.baseURL}/feishu/departments?parent_department_id=0`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.log('success', `✅ 成功获取部门列表`);
                    this.log('success', `   部门数量: ${data.data.length}`);
                    if (data.data.length > 0) {
                        this.log('success', `   示例部门: ${data.data[0].name}`);
                    }
                    this.testResults.push({ name: '获取部门列表', status: 'pass', message: `获取${data.data.length}个部门` });
                } else {
                    throw new Error(data.message || '获取部门失败');
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            this.log('error', `❌ 获取部门列表失败`);
            this.log('error', `   错误: ${error.message}`);
            this.log('warning', `   可能原因：`);
            this.log('warning', `   1. 飞书应用未配置"通讯录-只读"权限`);
            this.log('warning', `   2. 权限套件未发布或未分配给应用`);
            this.testResults.push({ name: '获取部门列表', status: 'fail', message: error.message });
        }

        this.log('info', '');
    }

    /**
     * 测试获取用户列表
     */
    async testGetUsers() {
        this.log('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.log('info', '测试4: 获取飞书用户列表');

        try {
            const response = await fetch(`${this.baseURL}/feishu/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.log('success', `✅ 成功获取用户列表`);
                    this.log('success', `   用户数量: ${data.data.length}`);
                    if (data.data.length > 0) {
                        this.log('success', `   示例用户: ${data.data[0].name}`);
                    }
                    this.testResults.push({ name: '获取用户列表', status: 'pass', message: `获取${data.data.length}个用户` });
                } else {
                    throw new Error(data.message || '获取用户失败');
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            this.log('error', `❌ 获取用户列表失败`);
            this.log('error', `   错误: ${error.message}`);
            this.log('warning', `   可能原因：`);
            this.log('warning', `   1. 飞书应用未配置"获取用户信息"权限`);
            this.log('warning', `   2. 权限套件未发布或未分配给应用`);
            this.testResults.push({ name: '获取用户列表', status: 'fail', message: error.message });
        }

        this.log('info', '');
    }

    /**
     * 测试获取当前用户
     */
    async testGetCurrentUser() {
        this.log('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.log('info', '测试5: 获取当前用户信息');

        try {
            const response = await fetch(`${this.baseURL}/users/current`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.log('success', `✅ 成功获取当前用户信息`);
                    this.log('success', `   用户名: ${data.data.name}`);
                    this.log('success', `   用户ID: ${data.data.user_id || data.data.id}`);
                    this.testResults.push({ name: '获取当前用户', status: 'pass', message: `用户: ${data.data.name}` });
                } else {
                    throw new Error(data.message || '获取当前用户失败');
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            this.log('error', `❌ 获取当前用户失败`);
            this.log('error', `   错误: ${error.message}`);
            this.log('warning', `   注意：此功能需要从飞书客户端打开应用`);
            this.testResults.push({ name: '获取当前用户', status: 'fail', message: error.message });
        }

        this.log('info', '');
    }

    /**
     * 生成诊断报告
     */
    generateReport() {
        this.log('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.log('info', '📊 诊断报告总结');

        const passCount = this.testResults.filter(r => r.status === 'pass').length;
        const failCount = this.testResults.filter(r => r.status === 'fail').length;
        const totalCount = this.testResults.length;

        this.log('info', `总计: ${totalCount} 项测试`);
        this.log('success', `✅ 通过: ${passCount} 项`);
        this.log('error', `❌ 失败: ${failCount} 项`);
        this.log('info', '');

        if (failCount === 0) {
            this.log('success', '🎉 所有测试通过！后端API工作正常。');
        } else {
            this.log('warning', '⚠️ 部分测试失败，请检查错误信息并修复。');
            this.log('info', '');
            this.log('info', '💡 修复建议：');
            this.log('info', '');

            const failedTests = this.testResults.filter(r => r.status === 'fail');
            failedTests.forEach(test => {
                this.log('warning', `• ${test.name}: ${test.message}`);
            });

            this.log('info', '');
            this.log('info', '🔧 常见解决方案：');
            this.log('info', '');
            this.log('info', '1. 检查Vercel环境变量是否已配置：');
            this.log('info', '   - FEISHU_APP_ID');
            this.log('info', '   - FEISHU_APP_SECRET');
            this.log('info', '   - FEISHU_BASE_APP_TOKEN（可选）');
            this.log('info', '   - FEISHU_BASE_TABLE_ID（可选）');
            this.log('info', '');
            this.log('info', '2. 在飞书开放平台检查权限配置：');
            this.log('info', '   - 登录 https://open.feishu.cn/app');
            this.log('info', '   - 进入你的应用');
            this.log('info', '   - 检查"权限管理"→"权限套件"');
            this.log('info', '   - 确保包含以下权限：');
            this.log('info', '     • contact:department:readonly（查看部门）');
            this.log('info', '     • contact:user:readonly（查看用户）');
            this.log('info', '     • contact:user.base:readonly（查看用户基本信息）');
            this.log('info', '');
            this.log('info', '3. 确保权限套件已发布并分配给应用');
            this.log('info', '');
            this.log('info', '4. 重新部署Vercel应用：');
            this.log('info', '   vercel --prod');
        }

        this.log('info', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    /**
     * 输出日志到页面和控制台
     */
    log(type, message) {
        // 输出到控制台
        switch (type) {
            case 'success':
                console.log(`✅ ${message}`);
                break;
            case 'error':
                console.error(`❌ ${message}`);
                break;
            case 'warning':
                console.warn(`⚠️ ${message}`);
                break;
            default:
                console.log(message);
        }

        // 输出到页面（如果存在诊断输出元素）
        const outputElement = document.getElementById('diagnosticOutput');
        if (outputElement) {
            const line = document.createElement('div');
            line.textContent = message;

            switch (type) {
                case 'success':
                    line.className = 'text-success';
                    break;
                case 'error':
                    line.className = 'text-danger';
                    break;
                case 'warning':
                    line.className = 'text-warning';
                    break;
                default:
                    line.className = 'text-info';
            }

            outputElement.appendChild(line);
            outputElement.scrollTop = outputElement.scrollHeight;
        }
    }

    /**
     * 清空输出
     */
    clearOutput() {
        const outputElement = document.getElementById('diagnosticOutput');
        if (outputElement) {
            outputElement.innerHTML = '';
        }
    }
}

// 创建全局实例
const backendAPIDiagnostic = new BackendAPIDiagnostic();

// 导出到全局
window.BackendAPIDiagnostic = backendAPIDiagnostic;

console.log('🔍 后端API诊断工具已加载');
console.log('💡 使用方法：BackendAPIDiagnostic.runFullDiagnostic()');
