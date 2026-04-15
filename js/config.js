// 系统配置页面 - 集成飞书Base版本
// 使用公共工具库 AITrainingUtils

let isFeishuEnv = false;
let systemConfig = {
    trainingWeights: [0.2, 0.2, 0.2, 0.2, 0.2],
    applicationWeights: [0.5, 0.5],
    trainingWeight: 0.4,
    applicationWeight: 0.6,
    evaluationPeriod: 'monthly',
    scoreThreshold: {
        excellent: 90,
        good: 80,
        average: 70
    }
};

// 初始化配置页
document.addEventListener('DOMContentLoaded', async function() {
    await initConfigPage();
});

async function initConfigPage() {
    console.log('初始化系统配置页面...');

    // 初始化飞书Base
    await initializeFeishuBase();

    // 加载系统配置
    await loadSystemConfig();

    // 加载Base配置（新增）
    loadBaseConfig();

    // 加载员工数据
    await loadConfigEmployees();

    // 加载评分配置
    await loadConfigScores();

    // 绑定事件（包括滑块同步）
    bindConfigEvents();

    // 修复：初始化权重总和显示
    updateWeightTotalDisplay();

    console.log('系统配置页面初始化完成');
}

// 初始化飞书Base
async function initializeFeishuBase() {
    try {
        if (typeof lark !== 'undefined' && typeof FeishuBase !== 'undefined') {
            await FeishuBase.initialize();
            isFeishuEnv = FeishuBase.client.isInitialized;
            
            if (isFeishuEnv) {
                console.log('配置页：飞书Base连接成功');
                document.getElementById('configStatus').innerHTML = '<i class="fas fa-check-circle text-success me-1"></i>飞书Base连接正常';
            } else {
                document.getElementById('configStatus').innerHTML = '<i class="fas fa-exclamation-triangle text-warning me-1"></i>本地模式（无Base连接）';
            }
        } else {
            document.getElementById('configStatus').innerHTML = '<i class="fas fa-exclamation-triangle text-warning me-1"></i>本地模式（非飞书环境）';
        }
    } catch (error) {
        console.error('配置页：飞书Base初始化失败:', error);
        document.getElementById('configStatus').innerHTML = '<i class="fas fa-times-circle text-danger me-1"></i>飞书Base连接失败';
    }
}

// 加载系统配置
async function loadSystemConfig() {
    try {
        // 如果是飞书环境，从Base加载配置
        if (isFeishuEnv) {
            // 这里可以实现从Base加载系统配置
            console.log('从飞书Base加载系统配置');
        }
        
        // 更新界面显示
        updateConfigDisplay();
        
    } catch (error) {
        console.error('加载系统配置失败:', error);
    }
}

// 加载员工数据（用于配置页面）
async function loadConfigEmployees() {
    try {
        const loadingElement = document.getElementById('loadingEmployeesConfig');
        if (loadingElement) loadingElement.style.display = 'block';
        
        let employees = [];
        
        if (isFeishuEnv) {
            // 从飞书Base获取员工数据
            employees = await FeishuBase.loadEmployees();
        } else {
            // 本地模拟数据
            employees = [
                { id: 1, name: '张三', department: '研发部', status: '在职' },
                { id: 2, name: '李四', department: '产品部', status: '在职' },
                { id: 3, name: '王五', department: '销售部', status: '在职' },
                { id: 4, name: '赵六', department: '实施部', status: '在职' }
            ];
        }
        
        // 更新员工表格
        updateEmployeesTable(employees);
        
        if (loadingElement) loadingElement.style.display = 'none';
        
    } catch (error) {
        console.error('加载员工配置失败:', error);
        AITrainingUtils.showAlert('加载员工数据失败: ' + error.message, 'error');
    }
}

// 加载评分配置
async function loadConfigScores() {
    try {
        const loadingElement = document.getElementById('loadingScoresConfig');
        if (loadingElement) loadingElement.style.display = 'block';
        
        let scoreConfigs = null;
        
        if (isFeishuEnv) {
            // 从飞书Base获取评分配置
            scoreConfigs = await FeishuBase.getScoreConfiguration();
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
                ]
            };
        }
        
        // 更新评分配置显示
        updateScoreConfigDisplay(scoreConfigs);
        
        if (loadingElement) loadingElement.style.display = 'none';
        
    } catch (error) {
        console.error('加载评分配置失败:', error);
        AITrainingUtils.showAlert('加载评分配置失败: ' + error.message, 'error');
    }
}

// 更新系统配置显示
function updateConfigDisplay() {
    // 培训维度权重
    for (let i = 0; i < systemConfig.trainingWeights.length; i++) {
        const input = document.getElementById(`trainingWeight${i + 1}`);
        if (input) {
            input.value = systemConfig.trainingWeights[i];
        }
    }
    
    // 应用维度权重
    for (let i = 0; i < systemConfig.applicationWeights.length; i++) {
        const input = document.getElementById(`applicationWeight${i + 1}`);
        if (input) {
            input.value = systemConfig.applicationWeights[i];
        }
    }
    
    // 总体权重
    const trainingWeightInput = document.getElementById('trainingWeight');
    const applicationWeightInput = document.getElementById('applicationWeight');
    
    if (trainingWeightInput) trainingWeightInput.value = systemConfig.trainingWeight;
    if (applicationWeightInput) applicationWeightInput.value = systemConfig.applicationWeight;
    
    // 评估周期
    const evaluationPeriodSelect = document.getElementById('evaluationPeriod');
    if (evaluationPeriodSelect) {
        evaluationPeriodSelect.value = systemConfig.evaluationPeriod;
    }
    
    // 分数阈值
    const excellentThreshold = document.getElementById('excellentThreshold');
    const goodThreshold = document.getElementById('goodThreshold');
    const averageThreshold = document.getElementById('averageThreshold');
    
    if (excellentThreshold) excellentThreshold.value = systemConfig.scoreThreshold.excellent;
    if (goodThreshold) goodThreshold.value = systemConfig.scoreThreshold.good;
    if (averageThreshold) averageThreshold.value = systemConfig.scoreThreshold.average;
}

// 更新员工表格
function updateEmployeesTable(employees) {
    const tbody = document.getElementById('employeesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${employee.name}</td>
            <td>${employee.department || '未知部门'}</td>
            <td>
                <span class="badge bg-success">${employee.status || '在职'}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-employee" data-id="${employee.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-employee" data-id="${employee.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// 更新评分配置显示
function updateScoreConfigDisplay(scoreConfigs) {
    // 培训维度配置
    const trainingConfigBody = document.getElementById('trainingConfigBody');
    const applicationConfigBody = document.getElementById('applicationConfigBody');
    
    if (trainingConfigBody && scoreConfigs.training) {
        trainingConfigBody.innerHTML = '';
        
        scoreConfigs.training.forEach((config, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${config.dimension}</td>
                <td>
                    <input type="number" class="form-control form-control-sm weight-input" 
                           value="${config.weight}" min="0" max="1" step="0.1"
                           data-category="training" data-id="${config.id}">
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary update-score-config" 
                            data-category="training" data-id="${config.id}">
                        <i class="fas fa-save"></i>
                    </button>
                </td>
            `;
            
            trainingConfigBody.appendChild(row);
        });
    }
    
    // 应用维度配置
    if (applicationConfigBody && scoreConfigs.application) {
        applicationConfigBody.innerHTML = '';
        
        scoreConfigs.application.forEach((config, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${config.dimension}</td>
                <td>
                    <input type="number" class="form-control form-control-sm weight-input" 
                           value="${config.weight}" min="0" max="1" step="0.1"
                           data-category="application" data-id="${config.id}">
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary update-score-config" 
                            data-category="application" data-id="${config.id}">
                        <i class="fas fa-save"></i>
                    </button>
                </td>
            `;
            
            applicationConfigBody.appendChild(row);
        });
    }
}

// 绑定配置页面事件
function bindConfigEvents() {
    // 修复：绑定权重滑块和输入框同步事件
    bindWeightSliders();

    // 保存权重配置按钮
    const saveWeightsBtn = document.getElementById('saveWeightsBtn');
    if (saveWeightsBtn) {
        saveWeightsBtn.addEventListener('click', saveWeightConfig);
    }

    // 恢复默认权重按钮
    const resetWeightsBtn = document.getElementById('resetWeightsBtn');
    if (resetWeightsBtn) {
        resetWeightsBtn.addEventListener('click', resetWeightConfig);
    }

    // 保存系统配置按钮
    const saveSystemConfigBtn = document.getElementById('saveSystemConfig');
    if (saveSystemConfigBtn) {
        saveSystemConfigBtn.addEventListener('click', saveSystemConfig);
    }

    // 保存Base配置按钮
    const saveBaseConfigBtn = document.getElementById('saveBaseConfigBtn');
    if (saveBaseConfigBtn) {
        saveBaseConfigBtn.addEventListener('click', saveBaseConfig);
    }

    // 清空Base配置按钮
    const clearBaseConfigBtn = document.getElementById('clearBaseConfigBtn');
    if (clearBaseConfigBtn) {
        clearBaseConfigBtn.addEventListener('click', clearBaseConfig);
    }

    // 测试连接按钮
    const testConnectionBtn = document.getElementById('testConnectionBtn');
    if (testConnectionBtn) {
        testConnectionBtn.addEventListener('click', testBaseConnection);
    }

    // App Token显示/隐藏切换
    const toggleAppTokenBtn = document.getElementById('toggleAppToken');
    if (toggleAppTokenBtn) {
        toggleAppTokenBtn.addEventListener('click', toggleAppTokenVisibility);
    }

    // Base配置输入变化时自动生成嵌入代码
    const baseInputs = ['baseAppToken', 'baseUrl', 'embedBlockId'];
    baseInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', generateEmbedCode);
            input.addEventListener('change', generateEmbedCode);
        }
    });

    // 添加新员工按钮
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    if (addEmployeeBtn) {
        addEmployeeBtn.addEventListener('click', showAddEmployeeModal);
    }

    // 保存新员工按钮
    const saveNewEmployeeBtn = document.getElementById('saveNewEmployee');
    if (saveNewEmployeeBtn) {
        saveNewEmployeeBtn.addEventListener('click', saveNewEmployee);
    }

    // 权重输入变化事件
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('weight-input')) {
            // 更新预览
            updateWeightPreview();
        }
    });

    // 更新评分配置按钮
    document.addEventListener('click', function(e) {
        if (e.target.closest('.update-score-config')) {
            const button = e.target.closest('.update-score-config');
            const category = button.dataset.category;
            const id = button.dataset.id;
            updateScoreConfig(category, id);
        }

        // 编辑员工按钮
        if (e.target.closest('.edit-employee')) {
            const button = e.target.closest('.edit-employee');
            const employeeId = button.dataset.id;
            editEmployee(employeeId);
        }

        // 删除员工按钮
        if (e.target.closest('.delete-employee')) {
            const button = e.target.closest('.delete-employee');
            const employeeId = button.dataset.id;
            deleteEmployee(employeeId);
        }
    });

    // 数据备份按钮
    const backupDataBtn = document.getElementById('backupDataBtn');
    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', backupData);
    }

    // 恢复数据按钮
    const restoreDataBtn = document.getElementById('restoreDataBtn');
    if (restoreDataBtn) {
        restoreDataBtn.addEventListener('click', restoreData);
    }

    // 刷新配置按钮
    const refreshConfigBtn = document.getElementById('refreshConfigBtn');
    if (refreshConfigBtn) {
        refreshConfigBtn.addEventListener('click', async function() {
            await loadConfigEmployees();
            await loadConfigScores();
            AITrainingUtils.showAlert('配置已刷新', 'success');
        });
    }
}

// 修复：绑定权重滑块和输入框同步事件
function bindWeightSliders() {
    console.log('🔧 开始绑定权重滑块同步事件...');

    // 定义所有权重配置项
    const weightConfigs = [
        { slider: 'weightBasic', input: 'weightBasicInput', name: '入门培训' },
        { slider: 'weightOptimization', input: 'weightOptimizationInput', name: '优化使用' },
        { slider: 'weightQuality', input: 'weightQualityInput', name: '质量保障' },
        { slider: 'weightTeam', input: 'weightTeamInput', name: '团队赋能' },
        { slider: 'weightOKR', input: 'weightOKRInput', name: 'OKR贡献' },
        { slider: 'weightRelevance', input: 'weightRelevanceInput', name: 'OKR关联度' },
        { slider: 'weightContribution', input: 'weightContributionInput', name: 'OKR贡献度' }
    ];

    // 为每个权重配置项绑定同步事件
    weightConfigs.forEach(config => {
        const slider = document.getElementById(config.slider);
        const input = document.getElementById(config.input);

        console.log(`检查${config.name}: slider=${!!slider}, input=${!!input}`);

        if (slider && input) {
            // 移除旧的事件监听器(如果存在)
            slider.removeEventListener('input', null);
            input.removeEventListener('input', null);

            // 滑块变化 -> 更新输入框
            slider.addEventListener('input', function() {
                console.log(`🎚️ ${config.name}滑块变化: ${this.value}`);
                const value = parseInt(this.value) || 0;
                input.value = value;
                updateWeightTotalDisplay();
            });

            // 输入框变化 -> 更新滑块
            input.addEventListener('input', function() {
                console.log(`✏️ ${config.name}输入框变化: ${this.value}`);
                let value = parseInt(this.value) || 0;

                // 限制范围0-100
                if (value < 0) value = 0;
                if (value > 100) value = 100;

                this.value = value;
                slider.value = value;
                updateWeightTotalDisplay();
            });

            console.log(`✅ ${config.name}滑块同步事件已绑定`);
        } else {
            console.error(`❌ ${config.name}元素未找到: slider=${!!slider}, input=${!!input}`);
        }
    });

    console.log('✅ 权重滑块同步事件绑定完成');
}

// 修复：更新权重总和显示
function updateWeightTotalDisplay() {
    // 计算培训部分权重总和
    const trainingWeights = [
        parseInt(document.getElementById('weightBasicInput')?.value) || 0,
        parseInt(document.getElementById('weightOptimizationInput')?.value) || 0,
        parseInt(document.getElementById('weightQualityInput')?.value) || 0,
        parseInt(document.getElementById('weightTeamInput')?.value) || 0,
        parseInt(document.getElementById('weightOKRInput')?.value) || 0
    ];

    // 计算应用部分权重总和
    const applicationWeights = [
        parseInt(document.getElementById('weightRelevanceInput')?.value) || 0,
        parseInt(document.getElementById('weightContributionInput')?.value) || 0
    ];

    const trainingTotal = trainingWeights.reduce((a, b) => a + b, 0);
    const applicationTotal = applicationWeights.reduce((a, b) => a + b, 0);

    // 更新显示
    const trainingTotalElement = document.getElementById('trainingTotalWeight');
    const applicationTotalElement = document.getElementById('applicationTotalWeight');

    if (trainingTotalElement) {
        const color = trainingTotal === 40 ? 'text-success' : 'text-danger';
        trainingTotalElement.innerHTML = `<span class="${color}">${trainingTotal}%</span>`;
        trainingTotalElement.className = trainingTotal === 40 ? '' : 'text-danger';
    }

    if (applicationTotalElement) {
        const color = applicationTotal === 60 ? 'text-success' : 'text-danger';
        applicationTotalElement.innerHTML = `<span class="${color}">${applicationTotal}%</span>`;
        applicationTotalElement.className = applicationTotal === 60 ? '' : 'text-danger';
    }

    console.log('权重总和更新:', { trainingTotal, applicationTotal });
}

// 保存权重配置
async function saveWeightConfig() {
    try {
        // 验证权重总和
        const trainingWeights = [
            parseInt(document.getElementById('weightBasicInput')?.value) || 0,
            parseInt(document.getElementById('weightOptimizationInput')?.value) || 0,
            parseInt(document.getElementById('weightQualityInput')?.value) || 0,
            parseInt(document.getElementById('weightTeamInput')?.value) || 0,
            parseInt(document.getElementById('weightOKRInput')?.value) || 0
        ];

        const applicationWeights = [
            parseInt(document.getElementById('weightRelevanceInput')?.value) || 0,
            parseInt(document.getElementById('weightContributionInput')?.value) || 0
        ];

        const trainingTotal = trainingWeights.reduce((a, b) => a + b, 0);
        const applicationTotal = applicationWeights.reduce((a, b) => a + b, 0);

        if (trainingTotal !== 40) {
            AITrainingUtils.showAlert(`培训部分权重总和必须为40%（当前为${trainingTotal}%）`, 'warning');
            return;
        }

        if (applicationTotal !== 60) {
            AITrainingUtils.showAlert(`应用部分权重总和必须为60%（当前为${applicationTotal}%）`, 'warning');
            return;
        }

        // 保存权重配置
        const weightConfig = {
            training: {
                basic: trainingWeights[0],
                optimization: trainingWeights[1],
                quality: trainingWeights[2],
                team: trainingWeights[3],
                okr: trainingWeights[4]
            },
            application: {
                relevance: applicationWeights[0],
                contribution: applicationWeights[1]
            }
        };

        // 保存到本地存储
        AITrainingUtils.saveToLocalStorage('weightConfig', weightConfig);

        AITrainingUtils.showAlert('权重配置已保存成功', 'success');
        console.log('权重配置已保存:', weightConfig);

    } catch (error) {
        console.error('保存权重配置失败:', error);
        AITrainingUtils.showAlert('保存失败: ' + error.message, 'error');
    }
}

// 恢复默认权重配置
function resetWeightConfig() {
    // 重置为默认值
    const defaults = {
        weightBasic: 20, weightOptimization: 20, weightQuality: 20,
        weightTeam: 20, weightOKR: 20,
        weightRelevance: 50, weightContribution: 50
    };

    // 重置滑块和输入框
    Object.keys(defaults).forEach(key => {
        const slider = document.getElementById(key);
        const input = document.getElementById(key + 'Input');

        if (slider) slider.value = defaults[key];
        if (input) input.value = defaults[key];
    });

    // 更新显示
    updateWeightTotalDisplay();

    AITrainingUtils.showAlert('权重配置已恢复为默认值', 'success');
}

// 保存系统配置
async function saveSystemConfig() {
    try {
        // 收集培训维度权重
        const trainingWeights = [];
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`trainingWeight${i}`);
            if (input) {
                const weight = parseFloat(input.value) || 0;
                if (weight < 0 || weight > 1) {
                    AITrainingUtils.showAlert(`培训维度${i}的权重必须在0-1之间`, 'warning');
                    return;
                }
                trainingWeights.push(weight);
            }
        }
        
        // 验证培训权重总和
        const trainingSum = trainingWeights.reduce((a, b) => a + b, 0);
        if (Math.abs(trainingSum - 1) > 0.01) {
            AITrainingUtils.showAlert(`培训维度权重总和必须为1（当前为${trainingSum.toFixed(2)}）`, 'warning');
            return;
        }
        
        // 收集应用维度权重
        const applicationWeights = [];
        for (let i = 1; i <= 2; i++) {
            const input = document.getElementById(`applicationWeight${i}`);
            if (input) {
                const weight = parseFloat(input.value) || 0;
                if (weight < 0 || weight > 1) {
                    AITrainingUtils.showAlert(`应用维度${i}的权重必须在0-1之间`, 'warning');
                    return;
                }
                applicationWeights.push(weight);
            }
        }
        
        // 验证应用权重总和
        const applicationSum = applicationWeights.reduce((a, b) => a + b, 0);
        if (Math.abs(applicationSum - 1) > 0.01) {
            AITrainingUtils.showAlert(`应用维度权重总和必须为1（当前为${applicationSum.toFixed(2)}）`, 'warning');
            return;
        }
        
        // 收集总体权重
        const trainingWeight = parseFloat(document.getElementById('trainingWeight').value) || 0;
        const applicationWeight = parseFloat(document.getElementById('applicationWeight').value) || 0;
        
        if (Math.abs(trainingWeight + applicationWeight - 1) > 0.01) {
            AITrainingUtils.showAlert(`培训和应用总权重之和必须为1（当前为${(trainingWeight + applicationWeight).toFixed(2)}）`, 'warning');
            return;
        }
        
        // 收集评估周期
        const evaluationPeriod = document.getElementById('evaluationPeriod').value;
        
        // 收集分数阈值
        const excellentThreshold = parseInt(document.getElementById('excellentThreshold').value) || 90;
        const goodThreshold = parseInt(document.getElementById('goodThreshold').value) || 80;
        const averageThreshold = parseInt(document.getElementById('averageThreshold').value) || 70;
        
        // 验证阈值合理性
        if (excellentThreshold <= goodThreshold || goodThreshold <= averageThreshold) {
            AITrainingUtils.showAlert('分数阈值必须满足：优秀 > 良好 > 一般', 'warning');
            return;
        }
        
        // 更新系统配置
        systemConfig.trainingWeights = trainingWeights;
        systemConfig.applicationWeights = applicationWeights;
        systemConfig.trainingWeight = trainingWeight;
        systemConfig.applicationWeight = applicationWeight;
        systemConfig.evaluationPeriod = evaluationPeriod;
        systemConfig.scoreThreshold = {
            excellent: excellentThreshold,
            good: goodThreshold,
            average: averageThreshold
        };
        
        // 保存到飞书Base（如果是飞书环境）
        if (isFeishuEnv) {
            // 这里可以实现保存到Base的功能
            console.log('保存系统配置到飞书Base');
        }
        
        // 保存到本地存储
        AITrainingUtils.saveToLocalStorage('systemConfig', systemConfig);
        
        AITrainingUtils.showAlert('系统配置已保存成功', 'success');
        console.log('系统配置已保存:', systemConfig);
        
    } catch (error) {
        console.error('保存系统配置失败:', error);
        AITrainingUtils.showAlert('保存失败: ' + error.message, 'error');
    }
}

// 更新权重预览
function updateWeightPreview() {
    // 计算培训权重总和
    let trainingSum = 0;
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`trainingWeight${i}`);
        if (input) {
            trainingSum += parseFloat(input.value) || 0;
        }
    }
    
    // 计算应用权重总和
    let applicationSum = 0;
    for (let i = 1; i <= 2; i++) {
        const input = document.getElementById(`applicationWeight${i}`);
        if (input) {
            applicationSum += parseFloat(input.value) || 0;
        }
    }
    
    // 更新显示
    const trainingPreview = document.getElementById('trainingWeightsPreview');
    const applicationPreview = document.getElementById('applicationWeightsPreview');
    
    if (trainingPreview) {
        const color = Math.abs(trainingSum - 1) < 0.01 ? 'text-success' : 'text-danger';
        trainingPreview.innerHTML = `<span class="${color}">${trainingSum.toFixed(2)}</span>`;
    }
    
    if (applicationPreview) {
        const color = Math.abs(applicationSum - 1) < 0.01 ? 'text-success' : 'text-danger';
        applicationPreview.innerHTML = `<span class="${color}">${applicationSum.toFixed(2)}</span>`;
    }
}

// 显示添加员工模态框
function showAddEmployeeModal() {
    // 重置表单
    document.getElementById('newEmployeeName').value = '';
    document.getElementById('newEmployeeDepartment').value = '';
    document.getElementById('newEmployeeStatus').value = '在职';
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('addEmployeeModal'));
    modal.show();
}

// 保存新员工
async function saveNewEmployee() {
    const name = document.getElementById('newEmployeeName').value.trim();
    const department = document.getElementById('newEmployeeDepartment').value.trim();
    const status = document.getElementById('newEmployeeStatus').value;
    
    if (!name) {
        AITrainingUtils.showAlert('请输入员工姓名', 'warning');
        return;
    }
    
    try {
        // 如果是飞书环境，保存到Base
        if (isFeishuEnv) {
            // 这里可以实现保存到Base的功能
            console.log('添加新员工到飞书Base:', { name, department, status });
        }
        
        // 更新本地数据
        await loadConfigEmployees();
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
        modal.hide();
        
        AITrainingUtils.showAlert('员工添加成功', 'success');
        
    } catch (error) {
        console.error('添加员工失败:', error);
        AITrainingUtils.showAlert('添加失败: ' + error.message, 'error');
    }
}

// 编辑员工
function editEmployee(employeeId) {
    alert(`编辑员工功能开发中，员工ID: ${employeeId}`);
    // 这里可以实现编辑员工的功能
}

// 删除员工
async function deleteEmployee(employeeId) {
    const confirmResult = confirm('确定要删除此员工吗？此操作不可撤销。');
    
    if (!confirmResult) return;
    
    try {
        // 如果是飞书环境，从Base删除
        if (isFeishuEnv) {
            // 这里可以实现从Base删除的功能
            console.log('从飞书Base删除员工:', employeeId);
        }
        
        // 更新本地数据
        await loadConfigEmployees();
        
        AITrainingUtils.showAlert('员工删除成功', 'success');
        
    } catch (error) {
        console.error('删除员工失败:', error);
        AITrainingUtils.showAlert('删除失败: ' + error.message, 'error');
    }
}

// 更新评分配置
async function updateScoreConfig(category, id) {
    const input = document.querySelector(`.weight-input[data-category="${category}"][data-id="${id}"]`);
    if (!input) return;
    
    const newWeight = parseFloat(input.value) || 0;
    
    if (newWeight < 0 || newWeight > 1) {
        AITrainingUtils.showAlert('权重必须在0-1之间', 'warning');
        return;
    }
    
    try {
        // 如果是飞书环境，更新到Base
        if (isFeishuEnv) {
            // 这里可以实现更新到Base的功能
            console.log(`更新${category}评分配置:`, { id, weight: newWeight });
        }
        
        AITrainingUtils.showAlert('评分配置已更新', 'success');
        
    } catch (error) {
        console.error('更新评分配置失败:', error);
        AITrainingUtils.showAlert('更新失败: ' + error.message, 'error');
    }
}

// 备份数据
function backupData() {
    try {
        // 收集所有数据
        const backupData = {
            timestamp: new Date().toISOString(),
            systemConfig: systemConfig,
            trainingScores: AITrainingUtils.loadFromLocalStorage('local_training_scores', []),
            applicationScores: AITrainingUtils.loadFromLocalStorage('local_application_scores', [])
        };
        
        // 创建JSON文件
        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // 创建下载链接
        const link = document.createElement('a');
        link.href = url;
        link.download = `AI培训评估系统备份_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        AITrainingUtils.showAlert('数据备份成功，已下载到本地', 'success');
        
    } catch (error) {
        console.error('数据备份失败:', error);
        AITrainingUtils.showAlert('备份失败: ' + error.message, 'error');
    }
}

// 恢复数据
function restoreData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const backupData = JSON.parse(event.target.result);
                    
                    // 验证备份数据格式
                    if (!backupData.systemConfig || !backupData.timestamp) {
                        throw new Error('备份文件格式不正确');
                    }
                    
                    // 确认恢复
                    const confirmResult = confirm(
                        `确定要恢复 ${new Date(backupData.timestamp).toLocaleString()} 的数据吗？\n当前数据将被覆盖。`
                    );
                    
                    if (!confirmResult) return;
                    
                    // 恢复系统配置
                    systemConfig = backupData.systemConfig;
                    AITrainingUtils.saveToLocalStorage('systemConfig', systemConfig);

                    // 恢复评分数据
                    if (backupData.trainingScores) {
                        AITrainingUtils.saveToLocalStorage('local_training_scores', backupData.trainingScores);
                    }

                    if (backupData.applicationScores) {
                        AITrainingUtils.saveToLocalStorage('local_application_scores', backupData.applicationScores);
                    }
                    
                    // 更新显示
                    updateConfigDisplay();
                    AITrainingUtils.showAlert('数据恢复成功', 'success');
                    console.log('数据已从备份恢复:', backupData.timestamp);
                    
                } catch (error) {
                    console.error('解析备份文件失败:', error);
                    AITrainingUtils.showAlert('恢复失败: ' + error.message, 'error');
                }
            };
            
            reader.readAsText(file);
            
        } catch (error) {
            console.error('读取备份文件失败:', error);
            AITrainingUtils.showAlert('读取备份文件失败: ' + error.message, 'error');
        }
    };
    
    fileInput.click();
}


// 工具函数：验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 工具函数：验证手机号格式
function isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// ========== 飞书Base配置相关函数 ==========

// 保存Base配置
function saveBaseConfig() {
    try {
        const baseConfig = {
            appToken: document.getElementById('baseAppToken')?.value || '',
            baseUrl: document.getElementById('baseUrl')?.value || '',
            employeeTableId: document.getElementById('employeeTableId')?.value || '',
            trainingTableId: document.getElementById('trainingTableId')?.value || '',
            trainingScoreTableId: document.getElementById('trainingScoreTableId')?.value || '',
            applicationScoreTableId: document.getElementById('applicationScoreTableId')?.value || '',
            scoreConfigTableId: document.getElementById('scoreConfigTableId')?.value || '',
            embedBlockId: document.getElementById('embedBlockId')?.value || '',
            updatedAt: new Date().toISOString()
        };

        // 验证必填字段
        if (!baseConfig.appToken) {
            AITrainingUtils.showAlert('请输入App Token', 'warning');
            return;
        }

        if (!baseConfig.baseUrl) {
            AITrainingUtils.showAlert('请输入Base URL', 'warning');
            return;
        }

        // 保存到本地存储
        AITrainingUtils.saveToLocalStorage('feishuBaseConfig', baseConfig);

        // 更新全局配置
        if (typeof FEISHU_BASE_CONFIG !== 'undefined') {
            FEISHU_BASE_CONFIG.app_token = baseConfig.appToken;
            if (baseConfig.employeeTableId) {
                FEISHU_BASE_CONFIG.tables.employees = baseConfig.employeeTableId;
            }
            if (baseConfig.trainingTableId) {
                FEISHU_BASE_CONFIG.tables.trainings = baseConfig.trainingTableId;
            }
            if (baseConfig.trainingScoreTableId) {
                FEISHU_BASE_CONFIG.tables.training_scores = baseConfig.trainingScoreTableId;
            }
            if (baseConfig.applicationScoreTableId) {
                FEISHU_BASE_CONFIG.tables.application_scores = baseConfig.applicationScoreTableId;
            }
            if (baseConfig.scoreConfigTableId) {
                FEISHU_BASE_CONFIG.tables.score_configs = baseConfig.scoreConfigTableId;
            }
        }

        // 生成嵌入代码
        generateEmbedCode();

        AITrainingUtils.showAlert('Base配置已保存成功！', 'success');
        console.log('Base配置已保存:', baseConfig);

        // 更新配置状态
        updateBaseConfigStatus(true);

    } catch (error) {
        console.error('保存Base配置失败:', error);
        AITrainingUtils.showAlert('保存失败: ' + error.message, 'error');
    }
}

// 清空Base配置
function clearBaseConfig() {
    if (!confirm('确定要清空Base配置吗？')) return;

    try {
        // 清空输入框
        document.getElementById('baseAppToken').value = '';
        document.getElementById('baseUrl').value = '';
        document.getElementById('employeeTableId').value = '';
        document.getElementById('trainingTableId').value = '';
        document.getElementById('trainingScoreTableId').value = '';
        document.getElementById('applicationScoreTableId').value = '';
        document.getElementById('scoreConfigTableId').value = '';
        document.getElementById('embedBlockId').value = '';

        // 清空本地存储
        localStorage.removeItem('feishuBaseConfig');

        // 重置嵌入代码
        document.getElementById('embedCode').value = getDefaultEmbedCode();

        AITrainingUtils.showAlert('Base配置已清空', 'success');
        updateBaseConfigStatus(false);

    } catch (error) {
        console.error('清空Base配置失败:', error);
        AITrainingUtils.showAlert('清空失败: ' + error.message, 'error');
    }
}

// 加载Base配置
function loadBaseConfig() {
    try {
        const savedConfig = AITrainingUtils.loadFromLocalStorage('feishuBaseConfig', null);

        if (savedConfig) {
            // 填充表单
            if (document.getElementById('baseAppToken')) {
                document.getElementById('baseAppToken').value = savedConfig.appToken || '';
            }
            if (document.getElementById('baseUrl')) {
                document.getElementById('baseUrl').value = savedConfig.baseUrl || '';
            }
            if (document.getElementById('employeeTableId')) {
                document.getElementById('employeeTableId').value = savedConfig.employeeTableId || '';
            }
            if (document.getElementById('trainingTableId')) {
                document.getElementById('trainingTableId').value = savedConfig.trainingTableId || '';
            }
            if (document.getElementById('trainingScoreTableId')) {
                document.getElementById('trainingScoreTableId').value = savedConfig.trainingScoreTableId || '';
            }
            if (document.getElementById('applicationScoreTableId')) {
                document.getElementById('applicationScoreTableId').value = savedConfig.applicationScoreTableId || '';
            }
            if (document.getElementById('scoreConfigTableId')) {
                document.getElementById('scoreConfigTableId').value = savedConfig.scoreConfigTableId || '';
            }
            if (document.getElementById('embedBlockId')) {
                document.getElementById('embedBlockId').value = savedConfig.embedBlockId || '';
            }

            console.log('Base配置已加载:', savedConfig);
            updateBaseConfigStatus(true);

            // 生成嵌入代码
            generateEmbedCode();

            return savedConfig;
        } else {
            // 使用默认配置
            console.log('未找到保存的Base配置，使用默认值');
            generateEmbedCode();
            return null;
        }
    } catch (error) {
        console.error('加载Base配置失败:', error);
        return null;
    }
}

// 生成嵌入代码
function generateEmbedCode() {
    try {
        const baseUrl = document.getElementById('baseUrl')?.value || 'https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc';
        const embedBlockId = document.getElementById('embedBlockId')?.value || '';

        let embedUrl = '';
        if (embedBlockId) {
            // 使用指定的Block ID
            embedUrl = `${baseUrl}/embed?blockId=${embedBlockId}`;
        } else {
            // 使用默认的嵌入格式
            embedUrl = `${baseUrl}/embed`;
        }

        const embedCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  scrolling="auto">
</iframe>`;

        const embedCodeElement = document.getElementById('embedCode');
        if (embedCodeElement) {
            embedCodeElement.value = embedCode;
        }

        console.log('嵌入代码已生成:', embedCode);

        // 同时保存到本地存储，供其他页面使用
        const baseConfig = {
            embedUrl: embedUrl,
            embedCode: embedCode,
            baseUrl: baseUrl,
            updatedAt: new Date().toISOString()
        };
        AITrainingUtils.saveToLocalStorage('feishuBaseEmbed', baseConfig);

        return embedCode;

    } catch (error) {
        console.error('生成嵌入代码失败:', error);
        return '';
    }
}

// 获取默认嵌入代码
function getDefaultEmbedCode() {
    return `<iframe
  src="https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc/embed"
  width="100%"
  height="600"
  frameborder="0"
  scrolling="auto">
</iframe>`;
}

// 测试Base连接
async function testBaseConnection() {
    const testResultDiv = document.getElementById('testResult');
    const syncDataBtn = document.getElementById('syncDataBtn');

    if (!testResultDiv) {
        console.error('找不到测试结果显示区域');
        return;
    }

    // 显示测试中状态
    testResultDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-spinner fa-spin me-2"></i>正在测试连接...</div>';

    try {
        const appToken = document.getElementById('baseAppToken')?.value || '';
        const baseUrl = document.getElementById('baseUrl')?.value || '';

        if (!appToken || !baseUrl) {
            throw new Error('请先填写App Token和Base URL');
        }

        // 检查是否在飞书环境中
        if (typeof lark !== 'undefined' && lark) {
            // 飞书环境：尝试使用SDK
            try {
                if (typeof FeishuBase !== 'undefined') {
                    await FeishuBase.initialize();

                    if (FeishuBase.client.isInitialized) {
                        // 测试加载员工数据
                        const employees = await FeishuBase.loadEmployees();

                        testResultDiv.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>连接成功！Base: ${appToken}，加载了 ${employees.length} 条员工记录</div>`;

                        // 启用同步数据按钮
                        if (syncDataBtn) {
                            syncDataBtn.disabled = false;
                        }

                        console.log('飞书Base连接测试成功');
                    } else {
                        throw new Error('飞书Base客户端初始化失败');
                    }
                } else {
                    throw new Error('FeishuBase对象未找到');
                }
            } catch (sdkError) {
                console.warn('飞书SDK测试失败:', sdkError);
                throw new Error(`飞书环境检测正常，但Base连接失败: ${sdkError.message}`);
            }
        } else {
            // 非飞书环境：使用模拟验证
            console.log('非飞书环境，使用模拟验证');

            // 验证URL格式
            const urlPattern = /feishu\.cn\/base\/([A-Za-z0-9]+)/;
            const match = baseUrl.match(urlPattern);

            if (match && match[1] === appToken) {
                testResultDiv.innerHTML = `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle me-2"></i>本地模式验证通过：Base配置正确（${appToken}），但需要飞书环境才能连接真实数据</div>`;

                // 在本地模式下也启用同步按钮（使用模拟数据）
                if (syncDataBtn) {
                    syncDataBtn.disabled = false;
                }
            } else if (match) {
                testResultDiv.innerHTML = `<div class="alert alert-warning"><i class="fas fa-exclamation-triangle me-2"></i>注意：URL中的Token(${match[1]})与App Token(${appToken})不一致</div>`;
            } else {
                throw new Error('Base URL格式不正确，应该是：https://xxx.feishu.cn/base/APP_TOKEN');
            }
        }

    } catch (error) {
        console.error('Base连接测试失败:', error);
        testResultDiv.innerHTML = `<div class="alert alert-danger"><i class="fas fa-times-circle me-2"></i>连接失败: ${error.message}</div>`;

        // 禁用同步数据按钮
        if (syncDataBtn) {
            syncDataBtn.disabled = true;
        }
    }
}

// 切换App Token显示/隐藏
function toggleAppTokenVisibility() {
    const input = document.getElementById('baseAppToken');
    const button = document.getElementById('toggleAppToken');
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// 更新Base配置状态
function updateBaseConfigStatus(isConfigured) {
    const statusElement = document.getElementById('baseStatusDetail');
    const iconElement = document.getElementById('baseConnectedIcon');
    const disconnectedIcon = document.getElementById('baseDisconnectedIcon');

    if (isConfigured) {
        if (statusElement) {
            statusElement.textContent = 'Base已配置，可以开始数据同步';
        }
        if (iconElement) {
            iconElement.style.display = 'inline-block';
        }
        if (disconnectedIcon) {
            disconnectedIcon.style.display = 'none';
        }
    } else {
        if (statusElement) {
            statusElement.textContent = '请配置Base信息以启用数据同步';
        }
        if (iconElement) {
            iconElement.style.display = 'none';
        }
        if (disconnectedIcon) {
            disconnectedIcon.style.display = 'inline-block';
        }
    }
}

console.log('系统配置逻辑已加载');