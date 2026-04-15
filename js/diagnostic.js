/**
 * AI培训评估系统 - 自动诊断工具
 * 用于快速检测和报告系统问题
 */

(function() {
    'use strict';

    class SystemDiagnostic {
        constructor() {
            this.results = [];
            this.warnings = [];
            this.errors = [];
        }

        /**
         * 运行完整诊断
         */
        async runFullDiagnostic() {
            console.log('🔍 开始系统诊断...\n');

            this.checkPageURL();
            this.checkBrowserCompatibility();
            this.checkJavaScriptFiles();
            this.checkLocalStorage();
            this.checkDOMElements();
            this.checkEventListeners();
            this.checkFunctions();
            this.checkConfigurations();

            this.generateReport();
        }

        /**
         * 检查页面URL
         */
        checkPageURL() {
            const url = window.location.href;
            const page = url.split('/').pop();

            this.addResult('当前页面', page, 'info');
            this.addResult('完整URL', url, 'info');
        }

        /**
         * 检查浏览器兼容性
         */
        checkBrowserCompatibility() {
            const userAgent = navigator.userAgent;
            const isChrome = userAgent.includes('Chrome');
            const isFirefox = userAgent.includes('Firefox');
            const isEdge = userAgent.includes('Edge');

            if (isChrome || isFirefox || isEdge) {
                this.addResult('浏览器兼容性', '✅ 兼容', 'success');
            } else {
                this.addWarning('浏览器', '可能不完全兼容，建议使用Chrome、Firefox或Edge');
            }
        }

        /**
         * 检查JavaScript文件加载
         */
        checkJavaScriptFiles() {
            const requiredScripts = [
                'feishu-config.js',
                'utils.js',
                'app.js',
                'config.js',
                'role-config.js',
                'base-embed.js',
                'feishu-org-sync.js'
            ];

            const currentPage = window.location.pathname;
            const pageScripts = [];

            // 根据不同页面检查不同的脚本
            if (currentPage.includes('config.html')) {
                pageScripts.push('config.js', 'utils.js', 'feishu-config.js');
            } else if (currentPage.includes('index.html')) {
                pageScripts.push('app.js', 'utils.js', 'feishu-config.js', 'base-embed.js');
            } else if (currentPage.includes('role-config.html')) {
                pageScripts.push('role-config.js', 'feishu-org-sync.js', 'utils.js');
            }

            pageScripts.forEach(script => {
                if (this.isScriptLoaded(script)) {
                    this.addResult(`脚本加载: ${script}`, '✅ 已加载', 'success');
                } else {
                    this.addError(`脚本加载: ${script}`, '❌ 未找到');
                }
            });
        }

        /**
         * 检查脚本是否已加载
         */
        isScriptLoaded(scriptName) {
            const scripts = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].src.includes(scriptName)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 检查localStorage
         */
        checkLocalStorage() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                this.addResult('localStorage', '✅ 可用', 'success');

                // 检查关键配置
                const configs = [
                    'feishuBaseConfig',
                    'feishuBaseEmbed',
                    'user_role_mappings',
                    'weightConfig'
                ];

                configs.forEach(config => {
                    const data = localStorage.getItem(config);
                    if (data) {
                        this.addResult(`配置存在: ${config}`, '✅ 已配置', 'success');
                    } else {
                        this.addWarning(`配置缺失: ${config}`);
                    }
                });

            } catch (error) {
                this.addError('localStorage', '❌ 不可用: ' + error.message);
            }
        }

        /**
         * 检查关键DOM元素
         */
        checkDOMElements() {
            const currentPage = window.location.pathname;

            if (currentPage.includes('config.html')) {
                this.checkConfigPageElements();
            } else if (currentPage.includes('index.html')) {
                this.checkIndexPageElements();
            } else if (currentPage.includes('role-config.html')) {
                this.checkRoleConfigPageElements();
            }
        }

        /**
         * 检查配置页面元素
         */
        checkConfigPageElements() {
            const elements = [
                'testConnectionBtn',
                'saveBaseConfigBtn',
                'baseAppToken',
                'baseUrl',
                'employeeTableId',
                'trainingTableId',
                'trainingScoreTableId',
                'applicationScoreTableId',
                'scoreConfigTableId',
                'embedBlockId',
                'embedCode'
            ];

            elements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    this.addResult(`元素存在: ${id}`, '✅ 存在', 'success');
                } else {
                    this.addError(`元素缺失: ${id}`, '❌ 未找到');
                }
            });
        }

        /**
         * 检查评分页面元素
         */
        checkIndexPageElements() {
            for (let i = 1; i <= 7; i++) {
                const slider = document.getElementById(`score${i}Slider`);
                const input = document.getElementById(`score${i}Input`);
                const display = document.getElementById(`score${i}Display`);

                if (slider && input && display) {
                    this.addResult(`评分元素${i}`, '✅ 完整', 'success');
                } else {
                    this.addError(`评分元素${i}`,
                        `❌ 缺失: slider=${!!slider}, input=${!!input}, display=${!!display}`);
                }
            }

            // 检查Base嵌入容器
            const baseContainer = document.getElementById('baseContainer');
            if (baseContainer) {
                this.addResult('Base嵌入容器', '✅ 存在', 'success');
            } else {
                this.addError('Base嵌入容器', '❌ 未找到');
            }
        }

        /**
         * 检查角色配置页面元素
         */
        checkRoleConfigPageElements() {
            const elements = [
                'syncFeishuOrg',
                'clearSyncData',
                'searchUserInput',
                'searchUserBtn',
                'mappingType',
                'identifier'
            ];

            elements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    this.addResult(`元素存在: ${id}`, '✅ 存在', 'success');
                } else {
                    this.addError(`元素缺失: ${id}`, '❌ 未找到');
                }
            });
        }

        /**
         * 检查事件监听器
         */
        checkEventListeners() {
            const currentPage = window.location.pathname;

            if (currentPage.includes('config.html')) {
                this.checkConfigPageEventListeners();
            } else if (currentPage.includes('index.html')) {
                this.checkIndexPageEventListeners();
            }
        }

        /**
         * 检查配置页面事件监听器
         */
        checkConfigPageEventListeners() {
            const button = document.getElementById('testConnectionBtn');
            if (button && typeof getEventListeners !== 'undefined') {
                const listeners = getEventListeners(button);
                if (listeners && listeners.click) {
                    this.addResult('测试连接按钮', `✅ 有${listeners.click.length}个点击事件`, 'success');
                } else {
                    this.addError('测试连接按钮', '❌ 没有点击事件监听器');
                }
            }

            const saveButton = document.getElementById('saveBaseConfigBtn');
            if (saveButton && typeof getEventListeners !== 'undefined') {
                const listeners = getEventListeners(saveButton);
                if (listeners && listeners.click) {
                    this.addResult('保存配置按钮', `✅ 有${listeners.click.length}个点击事件`, 'success');
                } else {
                    this.addError('保存配置按钮', '❌ 没有点击事件监听器');
                }
            }
        }

        /**
         * 检查评分页面事件监听器
         */
        checkIndexPageEventListeners() {
            for (let i = 1; i <= 7; i++) {
                const slider = document.getElementById(`score${i}Slider`);
                const input = document.getElementById(`score${i}Input`);

                if (slider && typeof getEventListeners !== 'undefined') {
                    const listeners = getEventListeners(slider);
                    if (listeners && listeners.input) {
                        this.addResult(`滑块${i}事件`, `✅ 有input事件`, 'success');
                    } else {
                        this.addError(`滑块${i}事件`, '❌ 没有input事件监听器');
                    }
                }

                if (input && typeof getEventListeners !== 'undefined') {
                    const listeners = getEventListeners(input);
                    if (listeners && listeners.input) {
                        this.addResult(`输入框${i}事件`, `✅ 有input事件`, 'success');
                    } else {
                        this.addError(`输入框${i}事件`, '❌ 没有input事件监听器');
                    }
                }
            }
        }

        /**
         * 检查关键函数
         */
        checkFunctions() {
            const currentPage = window.location.pathname;

            if (currentPage.includes('config.html')) {
                this.checkFunctionsExist([
                    'saveBaseConfig',
                    'testBaseConnection',
                    'generateEmbedCode',
                    'loadBaseConfig'
                ]);
            } else if (currentPage.includes('index.html')) {
                this.checkFunctionsExist([
                    'saveScore',
                    'submitEvaluation',
                    'updateScorePreview'
                ]);
            }
        }

        /**
         * 检查函数是否存在
         */
        checkFunctionsExist(functionNames) {
            functionNames.forEach(funcName => {
                if (typeof window[funcName] === 'function') {
                    this.addResult(`函数存在: ${funcName}`, '✅ 存在', 'success');
                } else {
                    this.addError(`函数缺失: ${funcName}`, '❌ 未找到');
                }
            });
        }

        /**
         * 检查配置数据
         */
        checkConfigurations() {
            // 检查飞书Base配置
            const baseConfig = localStorage.getItem('feishuBaseConfig');
            if (baseConfig) {
                try {
                    const config = JSON.parse(baseConfig);
                    this.addResult('Base配置', '✅ 有效', 'success');

                    if (config.appToken) {
                        this.addResult('App Token', `✅ ${config.appToken.substring(0, 10)}...`, 'success');
                    }
                    if (config.baseUrl) {
                        this.addResult('Base URL', `✅ ${config.baseUrl}`, 'success');
                    }
                } catch (error) {
                    this.addError('Base配置', '❌ 解析失败: ' + error.message);
                }
            }

            // 检查角色配置
            const roleConfig = localStorage.getItem('user_role_mappings');
            if (roleConfig) {
                try {
                    const roles = JSON.parse(roleConfig);
                    const userCount = Object.keys(roles.by_name || {}).length;
                    this.addResult('角色配置', `✅ ${userCount}个用户`, 'success');
                } catch (error) {
                    this.addError('角色配置', '❌ 解析失败: ' + error.message);
                }
            }
        }

        /**
         * 添加结果
         */
        addResult(name, status, type = 'info') {
            this.results.push({ name, status, type });
        }

        /**
         * 添加警告
         */
        addWarning(message) {
            this.warnings.push(message);
            console.warn('⚠️ ' + message);
        }

        /**
         * 添加错误
         */
        addError(name, message) {
            this.errors.push({ name, message });
            console.error('❌ ' + name + ': ' + message);
        }

        /**
         * 生成诊断报告
         */
        generateReport() {
            console.log('\n' + '='.repeat(60));
            console.log('📊 系统诊断报告');
            console.log('='.repeat(60) + '\n');

            // 统计结果
            const successCount = this.results.filter(r => r.type === 'success').length;
            const errorCount = this.errors.length;
            const warningCount = this.warnings.length;

            console.log(`✅ 成功: ${successCount} | ⚠️ 警告: ${warningCount} | ❌ 错误: ${errorCount}\n`);

            // 详细结果
            console.log('📋 详细结果:');
            console.log('-'.repeat(60));
            this.results.forEach(result => {
                console.log(`${result.status} ${result.name}`);
            });

            // 错误详情
            if (this.errors.length > 0) {
                console.log('\n❌ 错误详情:');
                console.log('-'.repeat(60));
                this.errors.forEach(error => {
                    console.log(`❌ ${error.name}: ${error.message}`);
                });
            }

            // 警告详情
            if (this.warnings.length > 0) {
                console.log('\n⚠️ 警告详情:');
                console.log('-'.repeat(60));
                this.warnings.forEach(warning => {
                    console.log(`⚠️ ${warning}`);
                });
            }

            // 建议
            console.log('\n💡 建议:');
            console.log('-'.repeat(60));
            this.generateRecommendations();

            console.log('\n' + '='.repeat(60));
            console.log('诊断完成');
            console.log('='.repeat(60));

            // 返回报告对象
            return {
                success: successCount,
                errors: errorCount,
                warnings: warningCount,
                results: this.results,
                errorDetails: this.errors,
                warningDetails: this.warnings
            };
        }

        /**
         * 生成建议
         */
        generateRecommendations() {
            if (this.errors.length > 0) {
                console.log('1. 检查控制台的错误信息');
                console.log('2. 确保所有JavaScript文件已正确加载');
                console.log('3. 清除浏览器缓存后重试');
                console.log('4. 检查网络连接是否正常');
            }

            if (this.warnings.length > 0) {
                console.log('5. 解决警告项以获得更好的体验');
            }

            if (this.errors.length === 0 && this.warnings.length === 0) {
                console.log('✅ 系统运行正常，可以开始使用！');
            }
        }

        /**
         * 快速测试按钮功能
         */
        async testButton(buttonId) {
            const button = document.getElementById(buttonId);
            if (!button) {
                console.error(`按钮 ${buttonId} 不存在`);
                return;
            }

            console.log(`测试按钮: ${buttonId}`);

            // 检查元素
            console.log('  - 元素存在: ✅');
            console.log('  - 元素类型:', button.tagName);
            console.log('  - 元素可见:', button.offsetParent !== null);

            // 检查事件监听器
            if (typeof getEventListeners !== 'undefined') {
                const listeners = getEventListeners(button);
                console.log('  - 事件监听器:', listeners ? JSON.stringify(Object.keys(listeners)) : '无');

                if (listeners && listeners.click) {
                    console.log('  - 点击事件数量:', listeners.click.length);
                } else {
                    console.log('  - ❌ 没有点击事件监听器');
                }
            }

            // 尝试模拟点击
            try {
                console.log('  - 尝试模拟点击...');
                button.click();
                console.log('  - ✅ 点击成功');
            } catch (error) {
                console.error('  - ❌ 点击失败:', error.message);
            }
        }
    }

    // 导出到全局
    const diagnostic = new SystemDiagnostic();
    window.SystemDiagnostic = diagnostic;

    // 添加快捷命令
    console.log('%c🔧 系统诊断工具已加载', 'color: green; font-weight: bold;');
    console.log('%c使用方法:', 'color: blue; font-weight: bold;');
    console.log('  SystemDiagnostic.runFullDiagnostic() - 运行完整诊断');
    console.log('  SystemDiagnostic.testButton("按钮ID") - 测试特定按钮');
    console.log('');

    // 页面加载完成后自动运行基础诊断
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                console.log('%c🚀 页面加载完成，运行基础诊断...', 'color: blue;');
                diagnostic.checkPageURL();
                diagnostic.checkBrowserCompatibility();
                diagnostic.checkLocalStorage();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            console.log('%c🚀 页面已加载，运行基础诊断...', 'color: blue;');
            diagnostic.checkPageURL();
            diagnostic.checkBrowserCompatibility();
            diagnostic.checkLocalStorage();
        }, 1000);
    }

})();
