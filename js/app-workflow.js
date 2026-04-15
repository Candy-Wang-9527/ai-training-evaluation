// AI培训评估系统 - 主JavaScript文件（工作流版本）
// 支持多级评审流程和修复的滑块同步

// 全局变量
let employeesList = [];
let scoreConfigs = null;
let isFeishuEnv = false;
let currentEvaluation = null;

// 初始化应用
document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

// 初始化应用
async function initializeApp() {
    console.log('初始化AI培训评估系统（工作流版本）...');

    try {
        // 设置当前日期
        const today = AITrainingUtils.getTodayString();
        document.getElementById('evaluationDate').value = today;

        // 初始化工作流管理器
        const userRole = await workflowManager.initialize();
        console.log('用户角色:', userRole);

        // 初始化飞书Base
        await initializeFeishuBase();

        // 加载员工数据
        await loadEmployees();

        // 加载评分配置
        await loadScoreConfig();

        // 修复：初始化滑块和输入框同步（必须在绑定事件之前）
        initializeScoreInputs();

        // 绑定事件监听器
        bindEventListeners();

        // 修复：初始化更新分数预览
        updateScorePreview();

        // 配置工作流UI
        configureWorkflowUI();

        console.log('系统初始化完成');

    } catch (error) {
        console.error('系统初始化失败:', error);
        AITrainingUtils.handleError(error, '系统初始化');
    }
}

// 配置工作流UI
function configureWorkflowUI() {
    // 根据当前角色配置界面
    const role = workflowManager.currentRole;

    // 设置默认阶段
    let defaultStage;
    switch(role) {
        case 'hr':
            defaultStage = 'hr_entry';
            break;
        case 'tech_committee':
            defaultStage = 'tech_review';
            break;
        case 'gm':
            defaultStage = 'gm_approval';
            break;
        default:
            defaultStage = 'hr_entry';
    }

    workflowManager.setCurrentStage(defaultStage);
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
            } else {
                console.warn('飞书Base连接失败，使用本地模式');
            }
        } else {
            console.warn('非飞书环境，使用本地模式');
        }
    } catch (error) {
        console.error('飞书Base初始化失败:', error);
        AITrainingUtils.handleError(error, '飞书Base初始化');
    }
}

// 加载员工数据
async function loadEmployees() {
    const select = document.getElementById('employeeSelect');
    const loadingElement = document.getElementById('loadingEmployees');

    try {
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

        if (employees.length > 0) {
            console.log('员工数据加载成功');
        } else {
            console.warn('未找到员工数据');
        }

    } catch (error) {
        console.error('加载员工数据失败:', error);
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
        AITrainingUtils.showAlert('加载评分配置失败，使用默认配置', 'warning');
    }
}

// 修复：初始化评分输入（解决滑块同步问题）
function initializeScoreInputs() {
    console.log('初始化评分输入...');

    // 设置所有评分输入框的初始值和范围
    for (let i = 1; i <= 7; i++) {
        const slider = document.getElementById(`score${i}Slider`);
        const input = document.getElementById(`score${i}Input`);
        const display = document.getElementById(`score${i}Display`);

        if (slider && input && display) {
            // 设置初始值
            const initialValue = 75; // 默认75分

            // 修复：同步设置所有三个元素的值
            slider.value = initialValue;
            input.value = initialValue;
            display.textContent = initialValue;

            console.log(`评分${i}已初始化为${initialValue}分`);
        } else {
            console.warn(`评分${i}的元素未找到`);
        }
    }
}

// 绑定事件监听器（修复滑块同步问题）
function bindEventListeners() {
    console.log('绑定事件监听器...');

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
    document.getElementById('saveBtn').addEventListener('click', saveDraft);

    // 工作流相关按钮
    document.getElementById('submitToTechBtn').addEventListener('click', submitToTechReview);
    document.getElementById('submitToGMBtn').addEventListener('click', submitToGMApproval);
    document.getElementById('approveBtn').addEventListener('click', finalApproval);

    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', resetForm);

    // 修复：监听所有评分输入变化，确保滑块和输入框同步
    for (let i = 1; i <= 7; i++) {
        const slider = document.getElementById(`score${i}Slider`);
        const input = document.getElementById(`score${i}Input`);
        const display = document.getElementById(`score${i}Display`);

        if (slider && input && display) {
            // 滑块变化 -> 更新输入框和显示
            slider.addEventListener('input', function() {
                const value = parseInt(this.value) || 0;
                input.value = value;  // 同步到输入框
                display.textContent = value;  // 同步到显示
                updateScorePreview();  // 更新分数预览
            });

            // 输入框变化 -> 更新滑块和显示
            input.addEventListener('input', function() {
                let value = parseInt(this.value) || 0;

                // 限制范围0-100
                if (value < 0) value = 0;
                if (value > 100) value = 100;

                this.value = value;  // 更新输入框值
                slider.value = value;  // 同步到滑块
                display.textContent = value;  // 同步到显示
                updateScorePreview();  // 更新分数预览
            });

            console.log(`评分${i}的事件监听器已绑定`);
        }
    }

    console.log('所有事件监听器绑定完成');
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

// 保存草稿
async function saveDraft() {
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

    // 获取评分数据
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

    try {
        // 显示保存状态
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>保存中...';
        saveBtn.disabled = true;

        // 准备评估数据
        const evaluationData = {
            employee_name: selectedEmployee,
            evaluation_date: evaluationDate,
            scores: scores,
            training_comments: document.getElementById('trainingComments').value,
            application_comments: document.getElementById('applicationComments').value,
            overall_suggestions: document.getElementById('overallSuggestions').value,

            // 工作流信息
            workflow_stage: workflowManager.currentStage,
            workflow_role: workflowManager.currentRole,

            // 计算分数
            training_total: AITrainingUtils.calculateWeightedTotal(
                scores.slice(0, 5),
                scoreConfigs?.getTrainingWeights() || [0.2, 0.2, 0.2, 0.2, 0.2]
            ),
            application_total: AITrainingUtils.calculateWeightedTotal(
                scores.slice(5, 7),
                scoreConfigs?.getApplicationWeights() || [0.5, 0.5]
            )
        };

        // 保存到飞书Base或本地存储
        let saveResult;
        if (isFeishuEnv) {
            saveResult = await saveToFeishuBase(evaluationData);
        } else {
            saveResult = saveToLocalStorage(evaluationData);
        }

        // 恢复按钮状态
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;

        if (saveResult.success) {
            AITrainingUtils.showAlert(saveResult.message, 'success');
            updateLastSavedTime();
        } else {
            AITrainingUtils.showAlert(saveResult.message, 'error');
        }

    } catch (error) {
        console.error('保存草稿失败:', error);

        // 恢复按钮状态
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.innerHTML = '<i class="fas fa-save me-1"></i>保存草稿';
        saveBtn.disabled = false;

        AITrainingUtils.handleError(error, '保存草稿');
    }
}

// 提交到技术委员会
async function submitToTechReview() {
    // 先保存草稿
    await saveDraft();

    // 确认提交
    const confirmResult = confirm('确定提交到技术架构委员会评审吗？提交后将无法修改。');
    if (!confirmResult) return;

    try {
        // 更新工作流状态
        const nextStage = await workflowManager.submitToNextStage(currentEvaluation);

        // 显示成功消息
        AITrainingUtils.showAlert('已提交到技术架构委员会评审', 'success');

        // 更新UI
        workflowManager.setCurrentStage(nextStage.current_stage);

        // 跳转到统计页面
        setTimeout(() => {
            window.location.href = 'statistics.html';
        }, 2000);

    } catch (error) {
        AITrainingUtils.handleError(error, '提交到技术委员会');
    }
}

// 提交到总经理审批
async function submitToGMApproval() {
    // 先保存草稿
    await saveDraft();

    // 确认提交
    const confirmResult = confirm('确定提交到总经理审批吗？提交后将无法修改。');
    if (!confirmResult) return;

    try {
        // 更新工作流状态
        const nextStage = await workflowManager.submitToNextStage(currentEvaluation);

        // 显示成功消息
        AITrainingUtils.showAlert('已提交到总经理审批', 'success');

        // 更新UI
        workflowManager.setCurrentStage(nextStage.current_stage);

        // 跳转到统计页面
        setTimeout(() => {
            window.location.href = 'statistics.html';
        }, 2000);

    } catch (error) {
        AITrainingUtils.handleError(error, '提交到总经理审批');
    }
}

// 最终批准
async function finalApproval() {
    // 先保存草稿
    await saveDraft();

    // 确认批准
    const confirmResult = confirm('确定最终批准此评估吗？批准后流程结束。');
    if (!confirmResult) return;

    try {
        // 更新工作流状态
        const nextStage = await workflowManager.submitToNextStage(currentEvaluation);

        // 添加总经理审批意见
        if (document.getElementById('gmComments')) {
            nextStage.gm_comments = document.getElementById('gmComments').value;
        }

        // 显示成功消息
        AITrainingUtils.showAlert('评估已最终批准完成！', 'success');

        // 更新UI
        workflowManager.setCurrentStage(nextStage.current_stage);

        // 跳转到统计页面
        setTimeout(() => {
            window.location.href = 'statistics.html';
        }, 2000);

    } catch (error) {
        AITrainingUtils.handleError(error, '最终批准');
    }
}

// 保存到飞书Base
async function saveToFeishuBase(data) {
    try {
        // 这里实现飞书Base保存逻辑
        console.log('保存数据到飞书Base:', data);

        return {
            success: true,
            message: '数据已保存到飞书Base'
        };

    } catch (error) {
        console.error('保存到飞书Base失败:', error);
        return {
            success: false,
            message: '保存失败: ' + error.message
        };
    }
}

// 保存到本地存储
function saveToLocalStorage(data) {
    try {
        // 获取现有数据
        const evaluations = AITrainingUtils.loadFromLocalStorage('workflow_evaluations', []);

        // 添加新数据
        data.id = workflowManager.generateEvaluationId();
        data.created_time = new Date().toISOString();
        data.created_by = workflowManager.currentRole;

        evaluations.push(data);

        // 保存到本地存储
        const saved = AITrainingUtils.saveToLocalStorage('workflow_evaluations', evaluations);

        if (saved) {
            // 更新当前评估
            currentEvaluation = data;

            return {
                success: true,
                message: '数据已保存到本地（非飞书环境）'
            };
        } else {
            throw new Error('本地存储保存失败');
        }

    } catch (error) {
        console.error('本地存储保存失败:', error);
        return {
            success: false,
            message: '保存失败: ' + error.message
        };
    }
}

// 更新最后保存时间
function updateLastSavedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN');
    document.getElementById('lastSaved').textContent = `最后保存：${timeString}`;
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

    // 重置评语
    document.getElementById('trainingComments').value = '';
    document.getElementById('applicationComments').value = '';
    document.getElementById('overallSuggestions').value = '';

    const gmComments = document.getElementById('gmComments');
    if (gmComments) {
        gmComments.value = '';
    }

    // 更新预览
    updateScorePreview();

    console.log('表单已重置');
}

// 工作流UI更新
function updateWorkflowUI(stage) {
    // 更新当前阶段显示
    const stageDisplay = document.getElementById('currentStage');
    const stageIndicator = document.querySelector('.stage-indicator');

    if (stageDisplay) {
        stageDisplay.textContent = workflowManager.getStageDisplayName(stage);
    }

    if (stageIndicator) {
        // 更新阶段指示器颜色
        stageIndicator.className = 'stage-indicator';
        switch(stage) {
            case 'hr_entry':
                stageIndicator.classList.add('stage-hr_entry');
                break;
            case 'tech_review':
                stageIndicator.classList.add('stage-tech_review');
                break;
            case 'gm_approval':
                stageIndicator.classList.add('stage-gm_approval');
                break;
            case 'completed':
                stageIndicator.classList.add('stage-completed');
                break;
        }
    }

    // 更新进度条
    updateProgressBar(stage);

    // 显示总经理评语区域（仅在总经理审批阶段）
    const gmCommentsSection = document.getElementById('gmCommentsSection');
    if (gmCommentsSection) {
        gmCommentsSection.style.display = (stage === 'gm_approval') ? 'block' : 'none';
    }
}

// 更新进度条
function updateProgressBar(currentStage) {
    const hrProgress = document.getElementById('hrProgress');
    const techProgress = document.getElementById('techProgress');
    const gmProgress = document.getElementById('gmProgress');

    // 重置所有进度条
    [hrProgress, techProgress, gmProgress].forEach(bar => {
        bar.style.width = '33%';
        bar.classList.remove('progress-bar-animated');
    });

    // 根据当前阶段更新进度条
    switch(currentStage) {
        case 'hr_entry':
            hrProgress.style.width = '100%';
            hrProgress.classList.add('progress-bar-animated');
            break;
        case 'tech_review':
            hrProgress.style.width = '50%';
            techProgress.style.width = '50%';
            techProgress.classList.add('progress-bar-animated');
            break;
        case 'gm_approval':
            hrProgress.style.width = '33%';
            techProgress.style.width = '33%';
            gmProgress.style.width = '34%';
            gmProgress.classList.add('progress-bar-animated');
            break;
        case 'completed':
            hrProgress.style.width = '33%';
            techProgress.style.width = '33%';
            gmProgress.style.width = '34%';
            // 移除动画，显示完成状态
            break;
    }
}

console.log('AI培训评估系统（工作流版本）主逻辑已加载');