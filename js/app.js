// AI培训评估系统 - 主JavaScript文件（集成飞书Base版本）
// 使用公共工具库 AITrainingUtils

// 全局变量
let employeesList = [];
let scoreConfigs = null;
let isFeishuEnv = false;

// 初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

// 初始化应用
async function initializeApp() {
    console.log('初始化AI培训评估系统...');

    // 设置当前日期
    const today = AITrainingUtils.getTodayString();
    document.getElementById('evaluationDate').value = today;
    
    // 初始化飞书Base
    await initializeFeishuBase();
    
    // 加载员工数据
    await loadEmployees();
    
    // 加载评分配置
    await loadScoreConfig();
    
    // 初始化滑块和输入框同步（必须在绑定事件之前）
    initializeScoreInputs();

    // 绑定事件监听器
    bindEventListeners();

    // 初始化更新分数预览
    updateScorePreview();

    console.log('系统初始化完成');
}

// 初始化飞书Base
async function initializeFeishuBase() {
    try {
        // 检查是否在飞书环境中
        if (typeof lark !== 'undefined') {
            console.log('飞书环境检测成功');
            
            // 初始化飞书Base客户端
            await FeishuBase.initialize();
            
            isFeishuEnv = FeishuBase.client.isInitialized;
            
            if (isFeishuEnv) {
                console.log('飞书Base连接成功');
                AITrainingUtils.safeSetContent(document.getElementById('envStatus'), '<i class="fas fa-check-circle text-success me-1"></i>飞书Base连接正常', true);
            } else {
                console.warn('飞书Base连接失败，使用本地模式');
                AITrainingUtils.safeSetContent(document.getElementById('envStatus'), '<i class="fas fa-exclamation-triangle text-warning me-1"></i>本地模式（无Base连接）', true);
            }
        } else {
            console.warn('非飞书环境，使用本地模式');
            AITrainingUtils.safeSetContent(document.getElementById('envStatus'), '<i class="fas fa-exclamation-triangle text-warning me-1"></i>本地模式（非飞书环境）', true);
        }
    } catch (error) {
        console.error('飞书Base初始化失败:', error);
        AITrainingUtils.safeSetContent(document.getElementById('envStatus'), '<i class="fas fa-times-circle text-danger me-1"></i>飞书Base连接失败', true);
    }
}

// 加载员工数据
async function loadEmployees() {
    const select = document.getElementById('employeeSelect');
    const loadingElement = document.getElementById('loadingEmployees');
    
    try {
        // 显示加载状态
        loadingElement.style.display = 'block';
        
        let employees = [];
        
        if (isFeishuEnv) {
            // 从飞书Base获取员工数据
            employees = await FeishuBase.loadEmployees();
            console.log(`从飞书Base获取${employees.length}名员工数据`);
        } else {
            // 本地模拟数据
            employees = [
                { id: 1, name: '张三', department: '研发部' },
                { id: 2, name: '李四', department: '产品部' },
                { id: 3, name: '王五', department: '销售部' },
                { id: 4, name: '赵六', department: '实施部' }
            ];
            console.log('使用本地模拟员工数据');
        }
        
        // 存储员工列表
        employeesList = employees;
        
        // 清空现有选项（除了第一个）
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // 添加员工选项
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.name;
            option.textContent = `${employee.name} - ${employee.department}`;
            select.appendChild(option);
        });
        
        // 隐藏加载状态
        loadingElement.style.display = 'none';
        
        if (employees.length > 0) {
            console.log('员工数据加载成功');
        } else {
            console.warn('未找到员工数据');
        }
        
    } catch (error) {
        console.error('加载员工数据失败:', error);
        loadingElement.style.display = 'none';
        AITrainingUtils.handleError(error, '加载员工数据');
    }
}

// 加载评分配置
async function loadScoreConfig() {
    try {
        if (isFeishuEnv) {
            // 从飞书Base获取评分配置
            scoreConfigs = await FeishuBase.getScoreConfiguration();
            console.log('从飞书Base加载评分配置');
        } else {
            // 本地默认配置
            scoreConfigs = {
                training: [
                    { id: 'config_1', category: '培训', dimension: '技术理解', weight: 0.2 },
                    { id: 'config_2', category: '培训', dimension: '应用能力', weight: 0.2 },
                    { id: 'config_3', category: '培训', dimension: '创新思维', weight: 0.2 },
                    { id: 'config_4', category: '培训', dimension: '团队协作', weight: 0.2 },
                    { id: 'config_5', category: '培训', dimension: '学习态度', weight: 0.2 }
                ],
                application: [
                    { id: 'config_6', category: '应用', dimension: '业务应用', weight: 0.5 },
                    { id: 'config_7', category: '应用', dimension: '效率提升', weight: 0.5 }
                ],
                getTrainingWeights: function() {
                    return this.training.map(c => parseFloat(c.weight) || 0.2);
                },
                getApplicationWeights: function() {
                    return this.application.map(c => parseFloat(c.weight) || 0.5);
                },
                getTrainingDimensions: function() {
                    return this.training.map(c => c.dimension);
                },
                getApplicationDimensions: function() {
                    return this.application.map(c => c.dimension);
                }
            };
            console.log('使用本地默认评分配置');
        }
    } catch (error) {
        console.error('加载评分配置失败:', error);
        AITrainingUtils.AITrainingUtils.showAlert('加载评分配置失败，使用默认配置', 'warning');
    }
}

// 绑定事件监听器
function bindEventListeners() {
    // 员工选择变化
    document.getElementById('employeeSelect').addEventListener('change', function(e) {
        const selectedName = e.target.value;
        const employee = employeesList.find(emp => emp.name === selectedName);
        if (employee) {
            document.getElementById('employeeDept').value = employee.department;
        } else {
            document.getElementById('employeeDept').value = '';
        }
    });
    
    // 保存按钮
    document.getElementById('saveBtn').addEventListener('click', saveScore);
    
    // 提交按钮
    document.getElementById('submitBtn').addEventListener('click', submitEvaluation);
    
    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    
    // 刷新Base按钮
    document.getElementById('refreshBase').addEventListener('click', async function(e) {
        e.preventDefault();
        await refreshBaseData();
    });
    
    // 打开Base按钮
    document.getElementById('openBaseBtn').addEventListener('click', function() {
        window.open('https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc', '_blank');
    });
    
    // 监听所有评分输入变化
    for (let i = 1; i <= 7; i++) {
        const slider = document.getElementById(`score${i}Slider`);
        const input = document.getElementById(`score${i}Input`);
        const display = document.getElementById(`score${i}Display`);

        console.log(`初始化评分${i}: slider=${!!slider}, input=${!!input}, display=${!!display}`);

        if (slider && input && display) {
            // 滑块变化 -> 更新输入框和显示
            slider.addEventListener('input', function() {
                console.log(`滑块${i}变化: ${this.value}`);
                const value = parseInt(this.value);
                input.value = value;
                display.textContent = value;
                updateScorePreview();
            });

            // 输入框变化 -> 更新滑块和显示
            input.addEventListener('input', function() {
                console.log(`输入框${i}变化: ${this.value}`);
                let value = parseInt(this.value) || 0;

                // 限制范围0-100
                if (value < 0) value = 0;
                if (value > 100) value = 100;

                this.value = value;
                slider.value = value;
                display.textContent = value;
                updateScorePreview();
            });

            console.log(`✅ 评分${i}滑块同步事件已绑定`);
        } else {
            console.error(`❌ 评分${i}元素未找到: slider=${!!slider}, input=${!!input}, display=${!!display}`);
        }
    }
    
    // Base连接测试按钮
    const testBtn = document.getElementById('testConnectionBtn');
    if (testBtn) {
        testBtn.addEventListener('click', testBaseConnection);
    }
}

// 初始化评分输入
function initializeScoreInputs() {
    console.log('🔧 开始初始化评分输入...');

    // 设置所有评分输入框的初始值和范围
    for (let i = 1; i <= 7; i++) {
        const slider = document.getElementById(`score${i}Slider`);
        const input = document.getElementById(`score${i}Input`);
        const display = document.getElementById(`score${i}Display`);

        if (slider && input && display) {
            // 使用HTML中的初始值,而不是强制设置为75
            const htmlSliderValue = parseInt(slider.value) || 0;
            const htmlInputValue = parseInt(input.value) || 0;

            // 统一使用滑块的值作为初始值
            const initialValue = htmlSliderValue;

            slider.value = initialValue;
            input.value = initialValue;
            display.textContent = initialValue;

            console.log(`✅ 评分${i}初始化完成, 初始值=${initialValue}`);
        } else {
            console.error(`❌ 评分${i}元素未找到: slider=${!!slider}, input=${!!input}, display=${!!display}`);
        }
    }

    console.log('✅ 评分输入初始化完成');
}

// 更新分数预览
function updateScorePreview() {
    try {
        // 获取所有评分
        const scores = [];
        for (let i = 1; i <= 7; i++) {
            const input = document.getElementById(`score${i}Input`);
            scores.push(parseInt(input?.value) || 0);
        }
        
        // 获取权重配置
        const trainingWeights = scoreConfigs?.getTrainingWeights() || [0.2, 0.2, 0.2, 0.2, 0.2];
        const applicationWeights = scoreConfigs?.getApplicationWeights() || [0.5, 0.5];
        
        // 默认权重分配（培训40%，应用60%）
        const trainingWeight = 0.4;
        const applicationWeight = 0.6;
        
        // 计算总分
        const trainingScores = scores.slice(0, 5); // 前5个是培训分数
        const applicationScores = scores.slice(5, 7); // 后2个是应用分数
        
        const trainingTotal = AITrainingUtils.calculateWeightedTotal(trainingScores, trainingWeights);
        const applicationTotal = AITrainingUtils.calculateWeightedTotal(applicationScores, applicationWeights);
        const finalScore = trainingTotal * trainingWeight + applicationTotal * applicationWeight;
        
        // 更新显示
        document.getElementById('trainingTotalPreview').textContent = trainingTotal.toFixed(1);
        document.getElementById('applicationTotalPreview').textContent = applicationTotal.toFixed(1);
        document.getElementById('finalScorePreview').textContent = finalScore.toFixed(1);
        
        // 根据分数设置颜色
        AITrainingUtils.setScoreColor(finalScore, 'finalScorePreview');
        AITrainingUtils.setScoreColor(trainingTotal, 'trainingTotalPreview');
        AITrainingUtils.setScoreColor(applicationTotal, 'applicationTotalPreview');
        
    } catch (error) {
        console.error('更新分数预览失败:', error);
    }
}


// 保存评分
async function saveScore() {
    const selectedEmployee = document.getElementById('employeeSelect').value;
    const evaluationDate = document.getElementById('evaluationDate').value;

    // 验证员工姓名
    if (!AITrainingUtils.isValidEmployeeName(selectedEmployee)) {
        AITrainingUtils.showAlert('请先选择被评估员工', 'warning');
        return;
    }

    // 验证评估日期
    if (!AITrainingUtils.isValidDate(evaluationDate)) {
        AITrainingUtils.showAlert('请选择有效的评估日期', 'warning');
        return;
    }

    // 验证评分数据
    const scores = [];
    for (let i = 1; i <= 7; i++) {
        const input = document.getElementById(`score${i}Input`);
        const value = parseInt(input?.value) || 0;

        if (!AITrainingUtils.isValidScore(value)) {
            AITrainingUtils.showAlert(`第${i}个评分必须在0-100之间`, 'warning');
            return;
        }

        scores.push(value);
    }
    
    // 获取当前用户（从导航栏）
    const currentUser = document.getElementById('currentUser').textContent || '匿名评估人';
    
    // 准备培训评分数据
    const trainingData = {
        employee_name: selectedEmployee,
        evaluation_date: evaluationDate,
        score1: scores[0],
        score2: scores[1],
        score3: scores[2],
        score4: scores[3],
        score5: scores[4],
        total_score: AITrainingUtils.calculateWeightedTotal(
            scores.slice(0, 5),
            scoreConfigs?.getTrainingWeights() || [0.2, 0.2, 0.2, 0.2, 0.2]
        ),
        evaluator: currentUser
    };
    
    // 准备应用评分数据
    const applicationData = {
        employee_name: selectedEmployee,
        evaluation_date: evaluationDate,
        score6: scores[5],
        score7: scores[6],
        total_score: AITrainingUtils.calculateWeightedTotal(
            scores.slice(5, 7),
            scoreConfigs?.getApplicationWeights() || [0.5, 0.5]
        ),
        evaluator: currentUser,
        comments: document.getElementById('comments')?.value || ''
    };
    
    try {
        // 显示保存状态
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>保存中...';
        saveBtn.disabled = true;
        
        let saveResult = null;
        
        if (isFeishuEnv) {
            // 保存到飞书Base
            const trainingResult = await FeishuBase.saveTrainingScore(trainingData);
            const applicationResult = await FeishuBase.saveApplicationScore(applicationData);
            
            if (trainingResult.success && applicationResult.success) {
                saveResult = { success: true, message: '数据已保存到飞书Base' };
            } else {
                saveResult = { success: false, message: '保存失败，请检查权限' };
            }
        } else {
            // 保存到本地存储
            saveToLocalStorage(trainingData, applicationData);
            saveResult = { success: true, message: '数据已保存到本地（非飞书环境）' };
        }
        
        // 恢复按钮状态
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        
        if (saveResult.success) {
            AITrainingUtils.showAlert(saveResult.message, 'success');
            console.log('评分保存成功:', { selectedEmployee, scores });
        } else {
            AITrainingUtils.showAlert(saveResult.message, 'error');
        }
        
    } catch (error) {
        console.error('保存评分失败:', error);
        
        // 恢复按钮状态
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.innerHTML = '<i class="fas fa-save me-1"></i>保存评分';
        saveBtn.disabled = false;
        
        AITrainingUtils.showAlert('保存失败: ' + error.message, 'error');
    }
}

// 保存到本地存储（非飞书环境）
function saveToLocalStorage(trainingData, applicationData) {
    try {
        // 获取现有数据
        const trainingScores = AITrainingUtils.loadFromLocalStorage('local_training_scores', []);
        const applicationScores = AITrainingUtils.loadFromLocalStorage('local_application_scores', []);

        // 添加新数据
        trainingScores.push({
            ...trainingData,
            id: Date.now(),
            created_time: new Date().toISOString()
        });

        applicationScores.push({
            ...applicationData,
            id: Date.now() + 1,
            created_time: new Date().toISOString()
        });

        // 使用安全的本地存储方法
        const trainingSaved = AITrainingUtils.saveToLocalStorage('local_training_scores', trainingScores);
        const applicationSaved = AITrainingUtils.saveToLocalStorage('local_application_scores', applicationScores);

        if (!trainingSaved || !applicationSaved) {
            throw new Error('本地存储保存失败');
        }

    } catch (error) {
        console.error('本地存储保存失败:', error);
        throw error;
    }
}

// 提交评估
async function submitEvaluation() {
    const confirmResult = confirm('确定提交本次评估吗？提交后将无法修改。');
    
    if (!confirmResult) return;
    
    // 先保存评分
    await saveScore();
    
    // 显示提交成功消息
    AITrainingUtils.showAlert('评估已成功提交！系统将自动计算统计结果。', 'success');
    
    // 重置表单
    setTimeout(() => {
        resetForm();
        window.location.href = 'statistics.html';
    }, 2000);
}

// 刷新Base数据
async function refreshBaseData() {
    try {
        AITrainingUtils.showAlert('正在刷新数据...', 'info');
        
        // 重新加载员工数据
        await loadEmployees();
        
        // 重新加载评分配置
        await loadScoreConfig();
        
        AITrainingUtils.showAlert('数据刷新完成！', 'success');
        
    } catch (error) {
        console.error('刷新数据失败:', error);
        AITrainingUtils.showAlert('刷新数据失败: ' + error.message, 'error');
    }
}

// 重置表单
function resetForm() {
    // 重置员工选择
    document.getElementById('employeeSelect').selectedIndex = 0;
    document.getElementById('employeeDept').value = '';

    // 重置日期为今天
    const today = AITrainingUtils.getTodayString();
    document.getElementById('evaluationDate').value = today;
    
    // 重置所有评分输入
    for (let i = 1; i <= 7; i++) {
        const slider = document.getElementById(`score${i}Slider`);
        const input = document.getElementById(`score${i}Input`);
        const display = document.getElementById(`score${i}Display`);
        
        if (slider && input && display) {
            const initialValue = 75;
            slider.value = initialValue;
            input.value = initialValue;
            display.textContent = initialValue;
        }
    }
    
    // 重置备注
    const commentsElement = document.getElementById('comments');
    if (commentsElement) commentsElement.value = '';
    
    // 更新预览
    updateScorePreview();
    
    console.log('表单已重置');
}


// Base连接测试函数（您提到的缺失功能）
async function testBaseConnection() {
    const urlInput = document.getElementById('baseUrlInput');
    const resultDiv = document.getElementById('connectionResult');
    const messageSpan = document.getElementById('resultMessage');
    
    if (!urlInput || !resultDiv || !messageSpan) {
        console.error('验证UI元素未找到');
        return;
    }
    
    // 禁用按钮，防止重复点击
    const testBtn = document.getElementById('testConnectionBtn');
    const originalText = testBtn.innerHTML;
    testBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>测试中...';
    testBtn.disabled = true;
    
    try {
        const url = urlInput.value.trim();
        let appToken = '';
        
        // 从URL中提取app_token
        if (url) {
            const matches = url.match(/\/base\/([A-Za-z0-9]+)/);
            if (matches && matches[1]) {
                appToken = matches[1];
                console.log('从URL中提取的app_token:', appToken);
            } else {
                // 直接使用输入的token
                appToken = url;
            }
        } else {
            // 使用配置文件中的token
            appToken = FEISHU_BASE_CONFIG.app_token;
        }
        
        if (!appToken) {
            throw new Error('未找到有效的Base标识符');
        }
        
        // 测试连接
        console.log('测试Base连接，app_token:', appToken);
        
        // 首先检测环境
        if (typeof lark !== 'undefined' && lark) {
            // 飞书环境：尝试使用SDK
            try {
                await FeishuBase.initialize();
                
                if (FeishuBase.client.isInitialized) {
                    // 测试加载员工数据
                    const employees = await FeishuBase.loadEmployees();
                    
                    resultDiv.className = 'alert alert-success';
                    messageSpan.textContent = `✅ 连接成功！Base: ${appToken}，加载了 ${employees.length} 条员工记录`;
                    resultDiv.style.display = 'block';
                    
                    console.log('飞书Base连接测试成功');
                } else {
                    throw new Error('飞书Base客户端初始化失败');
                }
            } catch (sdkError) {
                console.warn('飞书SDK测试失败:', sdkError);
                throw new Error(`飞书环境检测正常，但Base连接失败: ${sdkError.message}`);
            }
        } else {
            // 非飞书环境：使用模拟数据
            console.log('非飞书环境，使用模拟验证');
            
            // 验证配置文件中的token是否与输入一致
            const configToken = FEISHU_BASE_CONFIG.app_token;
            if (appToken === configToken) {
                resultDiv.className = 'alert alert-warning';
                messageSpan.textContent = `⚠️ 本地模式验证通过：Base配置正确（${appToken}），但需要飞书环境才能连接真实数据`;
                resultDiv.style.display = 'block';
            } else {
                resultDiv.className = 'alert alert-warning';
                messageSpan.textContent = `⚠️ 注意：输入标识符(${appToken})与配置标识符(${configToken})不一致，系统将使用配置文件`;
                resultDiv.style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Base连接测试失败:', error);
        
        resultDiv.className = 'alert alert-danger';
        messageSpan.textContent = `❌ 连接失败: ${error.message}`;
        resultDiv.style.display = 'block';
    } finally {
        // 恢复按钮状态
        testBtn.innerHTML = originalText;
        testBtn.disabled = false;
    }
}

console.log('AI培训评估系统主逻辑已加载');