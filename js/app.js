// AI培训评估系统 - 主JavaScript文件（集成飞书Base版本）

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
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('evaluationDate').value = today;
    
    // 初始化飞书Base
    await initializeFeishuBase();
    
    // 加载员工数据
    await loadEmployees();
    
    // 加载评分配置
    await loadScoreConfig();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化滑块和输入框同步
    initializeScoreInputs();
    
    // 更新预览
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
                document.getElementById('envStatus').innerHTML = '<i class="fas fa-check-circle text-success me-1"></i>飞书Base连接正常';
            } else {
                console.warn('飞书Base连接失败，使用本地模式');
                document.getElementById('envStatus').innerHTML = '<i class="fas fa-exclamation-triangle text-warning me-1"></i>本地模式（无Base连接）';
            }
        } else {
            console.warn('非飞书环境，使用本地模式');
            document.getElementById('envStatus').innerHTML = '<i class="fas fa-exclamation-triangle text-warning me-1"></i>本地模式（非飞书环境）';
        }
    } catch (error) {
        console.error('飞书Base初始化失败:', error);
        document.getElementById('envStatus').innerHTML = '<i class="fas fa-times-circle text-danger me-1"></i>飞书Base连接失败';
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
        showAlert('加载员工数据失败，请检查网络连接', 'error');
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
        showAlert('加载评分配置失败，使用默认配置', 'warning');
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
        
        if (slider && input && display) {
            // 滑块变化
            slider.addEventListener('input', function() {
                const value = parseInt(this.value);
                input.value = value;
                display.textContent = value;
                updateScorePreview();
            });
            
            // 输入框变化
            input.addEventListener('input', function() {
                let value = parseInt(this.value) || 0;
                
                // 限制范围0-100
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                
                this.value = value;
                slider.value = value;
                display.textContent = value;
                updateScorePreview();
            });
        }
    }
}

// 初始化评分输入
function initializeScoreInputs() {
    // 设置所有评分输入框的初始值和范围
    for (let i = 1; i <= 7; i++) {
        const slider = document.getElementById(`score${i}Slider`);
        const input = document.getElementById(`score${i}Input`);
        const display = document.getElementById(`score${i}Display`);
        
        if (slider && input && display) {
            // 设置初始值
            const initialValue = 75; // 默认75分
            slider.value = initialValue;
            input.value = initialValue;
            display.textContent = initialValue;
        }
    }
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
        
        const trainingTotal = calculateWeightedTotal(trainingScores, trainingWeights);
        const applicationTotal = calculateWeightedTotal(applicationScores, applicationWeights);
        const finalScore = trainingTotal * trainingWeight + applicationTotal * applicationWeight;
        
        // 更新显示
        document.getElementById('trainingTotalPreview').textContent = trainingTotal.toFixed(1);
        document.getElementById('applicationTotalPreview').textContent = applicationTotal.toFixed(1);
        document.getElementById('finalScorePreview').textContent = finalScore.toFixed(1);
        
        // 根据分数设置颜色
        setScoreColor(finalScore, 'finalScorePreview');
        setScoreColor(trainingTotal, 'trainingTotalPreview');
        setScoreColor(applicationTotal, 'applicationTotalPreview');
        
    } catch (error) {
        console.error('更新分数预览失败:', error);
    }
}

// 计算加权总分
function calculateWeightedTotal(scores, weights) {
    let total = 0;
    for (let i = 0; i < scores.length; i++) {
        total += scores[i] * weights[i];
    }
    return total;
}

// 根据分数设置颜色
function setScoreColor(score, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // 移除之前的颜色类
    element.classList.remove('text-danger', 'text-warning', 'text-info', 'text-success');
    
    // 根据分数设置颜色
    if (score < 70) {
        element.classList.add('text-danger'); // 红色：待改进
    } else if (score < 80) {
        element.classList.add('text-warning'); // 黄色：一般
    } else if (score < 90) {
        element.classList.add('text-info'); // 蓝色：良好
    } else {
        element.classList.add('text-success'); // 绿色：优秀
    }
}

// 保存评分
async function saveScore() {
    const selectedEmployee = document.getElementById('employeeSelect').value;
    const evaluationDate = document.getElementById('evaluationDate').value;
    
    if (!selectedEmployee || selectedEmployee === '') {
        showAlert('请先选择被评估员工', 'warning');
        return;
    }
    
    // 验证评分数据
    const scores = [];
    let isValid = true;
    
    for (let i = 1; i <= 7; i++) {
        const input = document.getElementById(`score${i}Input`);
        const value = parseInt(input?.value) || 0;
        
        if (value < 0 || value > 100) {
            isValid = false;
            showAlert(`第${i}个评分必须在0-100之间`, 'warning');
            return;
        }
        
        scores.push(value);
    }
    
    if (!isValid) return;
    
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
        total_score: calculateWeightedTotal(
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
        total_score: calculateWeightedTotal(
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
            showAlert(saveResult.message, 'success');
            console.log('评分保存成功:', { selectedEmployee, scores });
        } else {
            showAlert(saveResult.message, 'error');
        }
        
    } catch (error) {
        console.error('保存评分失败:', error);
        
        // 恢复按钮状态
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.innerHTML = '<i class="fas fa-save me-1"></i>保存评分';
        saveBtn.disabled = false;
        
        showAlert('保存失败: ' + error.message, 'error');
    }
}

// 保存到本地存储（非飞书环境）
function saveToLocalStorage(trainingData, applicationData) {
    try {
        // 获取现有数据
        const trainingScores = JSON.parse(localStorage.getItem('local_training_scores') || '[]');
        const applicationScores = JSON.parse(localStorage.getItem('local_application_scores') || '[]');
        
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
        
        // 保存回本地存储
        localStorage.setItem('local_training_scores', JSON.stringify(trainingScores));
        localStorage.setItem('local_application_scores', JSON.stringify(applicationScores));
        
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
    showAlert('评估已成功提交！系统将自动计算统计结果。', 'success');
    
    // 重置表单
    setTimeout(() => {
        resetForm();
        window.location.href = 'statistics.html';
    }, 2000);
}

// 刷新Base数据
async function refreshBaseData() {
    try {
        showAlert('正在刷新数据...', 'info');
        
        // 重新加载员工数据
        await loadEmployees();
        
        // 重新加载评分配置
        await loadScoreConfig();
        
        showAlert('数据刷新完成！', 'success');
        
    } catch (error) {
        console.error('刷新数据失败:', error);
        showAlert('刷新数据失败: ' + error.message, 'error');
    }
}

// 重置表单
function resetForm() {
    // 重置员工选择
    document.getElementById('employeeSelect').selectedIndex = 0;
    document.getElementById('employeeDept').value = '';
    
    // 重置日期为今天
    const today = new Date().toISOString().split('T')[0];
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

// 显示提示消息
function showAlert(message, type = 'info') {
    // 创建一个提示元素
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    
    // 根据类型设置图标
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'error') icon = 'times-circle';
    if (type === 'info') icon = 'info-circle';
    
    alertDiv.innerHTML = `
        <i class="fas fa-${icon} me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // 添加到页面
    const container = document.getElementById('alertContainer');
    if (container) {
        container.innerHTML = '';
        container.appendChild(alertDiv);
    } else {
        // 如果容器不存在，创建一个
        const newContainer = document.createElement('div');
        newContainer.id = 'alertContainer';
        newContainer.appendChild(alertDiv);
        document.querySelector('.container').insertBefore(newContainer, document.querySelector('.container').firstChild);
    }
    
    // 5秒后自动消失
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.classList.remove('show');
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 500);
        }
    }, 5000);
}

// 工具函数：获取当前时间戳
function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
}

// 工具函数：格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

console.log('AI培训评估系统主逻辑已加载');