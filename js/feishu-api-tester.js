/**
 * 飞书API权限检查和测试工具
 * 用于诊断飞书应用权限配置问题
 */

(function() {
    'use strict';

    class FeishuAPITester {
        constructor() {
            this.lark = window.lark || null;
            this.testResults = [];
        }

        /**
         * 运行完整的权限检查
         */
        async runPermissionCheck() {
            console.log('🔍 开始飞书API权限检查...\n');

            this.checkLarkSDK();
            await this.checkPermissions();
            await this.testBitableAPI();
            await this.testContactAPI();
            await this.testDataAPI();

            this.generateReport();
        }

        /**
         * 检查飞书JS SDK
         */
        checkLarkSDK() {
            console.log('📱 检查飞书JS SDK...');

            if (typeof lark !== 'undefined') {
                console.log('✅ 飞书JS SDK已加载');
                console.log('   SDK版本:', lark.version || '未知');
                console.log('   全局对象:', typeof lark);

                // 检查可用的API模块
                const modules = [];
                if (lark.bitable) modules.push('bitable (多维表格)');
                if (lark.contact) modules.push('contact (通讯录)');
                if (lark.permission) modules.push('permission (权限)');

                console.log('   可用模块:', modules.join(', ') || '无');

                this.addResult('飞书JS SDK', '✅ 已加载', 'success');

            } else {
                console.log('❌ 飞书JS SDK未加载');
                console.log('   请检查是否在飞书环境中打开页面');
                this.addError('飞书JS SDK', '未加载');
            }
        }

        /**
         * 检查权限状态
         */
        async checkPermissions() {
            console.log('\n🔐 检查应用权限...');

            if (!this.lark || !this.lark.permission) {
                console.log('⚠️ 权限API不可用');
                this.addWarning('权限API', '权限API不可用，无法检查权限状态');
                return;
            }

            try {
                // 检查所需权限
                const requiredScopes = [
                    'bitable:app',           // 多维表格应用权限
                    'bitable:app:readonly', // 多维表格只读权限
                    'contact:department:readonly', // 部门只读权限
                    'contact:user:readonly',      // 用户只读权限
                    'contact:user.email:readonly' // 用户邮箱只读权限
                ];

                console.log('所需权限:', requiredScopes);

                // 请求权限
                for (const scope of requiredScopes) {
                    try {
                        console.log(`   检查权限: ${scope}`);
                        const response = await this.lark.permission.request({
                            scopes: [scope]
                        });

                        if (response.code === 0) {
                            console.log(`   ✅ ${scope}: 已授权`);
                            this.addResult(`权限: ${scope}`, '✅ 已授权', 'success');
                        } else {
                            console.log(`   ❌ ${scope}: ${response.msg}`);
                            this.addError(`权限: ${scope}`, response.msg);
                        }

                    } catch (error) {
                        console.log(`   ⚠️ ${scope}: 请求失败 - ${error.message}`);
                        this.addWarning(`权限: ${scope}`, error.message);
                    }
                }

            } catch (error) {
                console.error('权限检查失败:', error);
                this.addError('权限检查', error.message);
            }
        }

        /**
         * 测试多维表格API
         */
        async testBitableAPI() {
            console.log('\n📊 测试多维表格API...');

            if (!this.lark || !this.lark.bitable) {
                console.log('❌ 多维表格API不可用');
                this.addError('多维表格API', 'API不可用');
                return;
            }

            try {
                const appToken = 'GA1QbgqTzaHaVIsIKWDcFI79nuc';

                // 测试获取app列表
                console.log('   测试: 获取应用列表');
                const response = await this.lark.bitable.appList({
                    page_size: 10
                });

                console.log('   API响应:', response);

                if (response.code === 0) {
                    console.log('   ✅ 应用列表获取成功');
                    console.log('   应用数量:', response.data.items.length);

                    // 查找目标应用
                    const targetApp = response.data.items.find(app => app.app_token === appToken);
                    if (targetApp) {
                        console.log(`   ✅ 找到目标应用: ${targetApp.name}`);
                        this.addResult('多维表格API', '✅ 正常', 'success');
                    } else {
                        console.log(`   ⚠️ 未找到目标应用 (token: ${appToken})`);
                        this.addWarning('多维表格API', '未找到目标应用');
                    }

                } else {
                    console.log(`   ❌ API调用失败: ${response.msg}`);
                    this.addError('多维表格API', response.msg);
                }

            } catch (error) {
                console.error('多维表格API测试失败:', error);
                this.addError('多维表格API', error.message);
            }
        }

        /**
         * 测试通讯录API
         */
        async testContactAPI() {
            console.log('\n👥 测试通讯录API...');

            if (!this.lark || !this.lark.contact) {
                console.log('❌ 通讯录API不可用');
                this.addError('通讯录API', 'API不可用');
                return;
            }

            try {
                // 测试获取部门列表
                console.log('   测试: 获取部门列表');
                const deptResponse = await this.lark.contact.department.list({
                    parent_department_id: '0',
                    user_id_type: 'user_id'
                });

                console.log('   部门API响应:', deptResponse);

                if (deptResponse.code === 0) {
                    console.log(`   ✅ 部门列表获取成功: ${deptResponse.data.items.length}个部门`);
                    this.addResult('部门API', `✅ ${deptResponse.data.items.length}个部门`, 'success');

                    // 测试获取用户列表
                    console.log('   测试: 获取用户列表');
                    const userResponse = await this.lark.contact.user.list({
                        department_id_type: 'department_id',
                        user_id_type: 'user_id',
                        page_size: 10
                    });

                    console.log('   用户API响应:', userResponse);

                    if (userResponse.code === 0) {
                        console.log(`   ✅ 用户列表获取成功: ${userResponse.data.items.length}名用户`);
                        this.addResult('用户API', `✅ ${userResponse.data.items.length}名用户`, 'success');
                    } else {
                        console.log(`   ❌ 用户列表获取失败: ${userResponse.msg}`);
                        this.addError('用户API', userResponse.msg);
                    }

                } else {
                    console.log(`   ❌ 部门列表获取失败: ${deptResponse.msg}`);
                    this.addError('部门API', deptResponse.msg);
                }

            } catch (error) {
                console.error('通讯录API测试失败:', error);
                this.addError('通讯录API', error.message);
            }
        }

        /**
         * 测试数据API
         */
        async testDataAPI() {
            console.log('\n💾 测试数据API...');

            const appToken = 'GA1QbgqTzaHaVIsIKWDcFI79nuc';
            const tables = {
                employees: 'tblIVqXEzmZdKxjI',
                training_scores: 'tblg3G6KPSAhBHNw'
            };

            for (const [tableName, tableId] of Object.entries(tables)) {
                try {
                    console.log(`   测试: 读取表 ${tableName} (table_id: ${tableId})`);

                    const response = await this.lark.bitable.appTableRecord.list({
                        app_token: appToken,
                        table_id: tableId,
                        page_size: 5
                    });

                    console.log(`   ${tableName} API响应:`, response);

                    if (response.code === 0) {
                        const recordCount = response.data.items ? response.data.items.length : 0;
                        console.log(`   ✅ ${tableName} 读取成功: ${recordCount}条记录`);
                        this.addResult(`数据表: ${tableName}`, `✅ ${recordCount}条记录`, 'success');
                    } else {
                        console.log(`   ❌ ${tableName} 读取失败: ${response.msg}`);
                        this.addError(`数据表: ${tableName}`, response.msg);
                    }

                } catch (error) {
                    console.error(`   ${tableName} 测试失败:`, error);
                    this.addError(`数据表: ${tableName}`, error.message);
                }
            }
        }

        /**
         * 生成权限配置指南
         */
        generatePermissionGuide() {
            console.log('\n' + '='.repeat(60));
            console.log('📖 飞书应用权限配置指南');
            console.log('='.repeat(60) + '\n');

            console.log('1. 登录飞书开发者平台:');
            console.log('   https://open.feishu.cn/app');
            console.log('');
            console.log('2. 找到您的应用 (App ID: cli_a954a77f4bb95bca)');
            console.log('');
            console.log('3. 配置权限套件:');
            console.log('   进入"权限管理" -> "权限套件"');
            console.log('');
            console.log('4. 添加以下权限:');
            console.log('   ✅ 多维表格 - 查看、评论、编辑、创建');
            console.log('   ✅ 通讯录 - 读取部门信息、读取用户信息');
            console.log('   ✅ 获取用户邮箱 - 读取用户邮箱');
            console.log('');
            console.log('5. 发布权限套件:');
            console.log('   创建权限套件 -> 选择权限 -> 发布');
            console.log('');
            console.log('6. 分发权限:');
            console.log('   权限管理 -> 分发权限 -> 选择组织/用户 -> 发布');
            console.log('');
            console.log('7. 等待权限生效:');
            console.log('   通常需要1-5分钟，请稍后重试');
            console.log('');

            console.log('⚠️ 重要提示:');
            console.log('   - 确保应用已发布');
            console.log('   - 确保权限套件已分发');
            console.log('   - 确保在飞书环境中打开应用');
            console.log('   - 某些API可能需要企业管理员审批');
        }

        /**
         * 添加结果
         */
        addResult(name, status, type = 'info') {
            this.testResults.push({ name, status, type });
        }

        /**
         * 添加错误
         */
        addError(name, message) {
            this.testResults.push({ name, status: `❌ ${message}`, type: 'error' });
        }

        /**
         * 添加警告
         */
        addWarning(name, message) {
            this.testResults.push({ name, status: `⚠️ ${message}`, type: 'warning' });
        }

        /**
         * 生成测试报告
         */
        generateReport() {
            console.log('\n' + '='.repeat(60));
            console.log('📊 飞书API权限测试报告');
            console.log('='.repeat(60) + '\n');

            const successCount = this.testResults.filter(r => r.type === 'success').length;
            const errorCount = this.testResults.filter(r => r.type === 'error').length;
            const warningCount = this.testResults.filter(r => r.type === 'warning').length;

            console.log(`✅ 成功: ${successCount} | ⚠️ 警告: ${warningCount} | ❌ 错误: ${errorCount}\n`);

            console.log('📋 详细结果:');
            console.log('-'.repeat(60));
            this.testResults.forEach(result => {
                console.log(`${result.status} ${result.name}`);
            });

            if (errorCount > 0) {
                console.log('\n💡 建议操作:');
                console.log('1. 检查飞书应用权限配置');
                console.log('2. 确认权限套件已发布和分发');
                console.log('3. 确认在飞书环境中打开应用');
                console.log('4. 联系飞书管理员确认应用状态');
            }

            console.log('\n' + '='.repeat(60));
            console.log('测试完成');
            console.log('='.repeat(60));

            return {
                success: successCount,
                errors: errorCount,
                warnings: warningCount
            };
        }
    }

    // 导出到全局
    const tester = new FeishuAPITester();
    window.FeishuAPITester = tester;

    console.log('%c🔧 飞书API测试工具已加载', 'color: blue; font-weight: bold;');
    console.log('%c使用方法:', 'color: blue; font-weight: bold;');
    console.log('  FeishuAPITester.runPermissionCheck() - 运行完整权限检查');
    console.log('  FeishuAPITester.generatePermissionGuide() - 显示权限配置指南');
    console.log('');

})();
