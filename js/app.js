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

    // 初始化角色系统
    await initializeRoleSystem();

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

// 初始化角色系统
async function initializeRoleSystem() {
    try {
        console.log('🔐 初始化角色系统...');

        if (typeof window.RoleConfig !== 'undefined') {
            const initResult = await window.RoleConfig.initialize();

            // 更新导航栏显示用户信息
            if (initResult.user) {
                const currentUserElement = document.getElementById('currentUser');
                if (currentUserElement) {
                    currentUserElement.textContent = initResult.user.name;
                }

                // 更新评委名称显示
                const judgeNameElement = document.getElementById('judgeName');
                const judgeDeptElement = document.getElementById('judgeDept');
                if (judgeNameElement) {
                    judgeNameElement.textContent = initResult.user.name;
                }
                if (judgeDeptElement && initResult.user.department) {
                    judgeDeptElement.textContent = `(${initResult.user.department})`;
                }
            }

            // 显示用户的所有角色
            if (initResult.role && window.RoleConfig) {
                const roles = window.RoleConfig.getUserRoles(initResult.user);
                const roleBadge = document.getElementById('roleBadge');

                if (roleBadge && roles.length > 0) {
                    // 如果有多个角色，显示所有角色
                    if (roles.length > 1) {
                        const roleNames = roles.map(role => {
                            const config = window.RoleConfig.getRoleConfig(role);
                            return config ? config.name : role;
                        }).join('、');
                        roleBadge.textContent = roleNames;
                        roleBadge.className = 'badge bg-primary ms-2';
                    } else {
                        // 单个角色
                        const roleConfig = window.RoleConfig.getRoleConfig(roles[0]);
                        if (roleConfig) {
                            roleBadge.textContent = roleConfig.name;
                            roleBadge.className = `badge ms-2 ${roleConfig.color}`;
                        }
                    }
                }

                console.log('✅ 角色系统初始化成功');
                console.log('👤 当前用户:', initResult.user);
                console.log('🔑 用户角色:', roles);
            }
        } else {
            console.warn('⚠️ 角色配置模块未加载');
        }
    } catch (error) {
        console.error('❌ 角色系统初始化失败:', error);
    }
}

// 初始化飞书Base
async function initializeFeishuBase() {
    try {
        console.log('🔗 初始化飞书Base...');

        // 检查是否有飞书JS SDK
        if (typeof lark === 'undefined' || !lark.ready) {
            console.warn('⚠️ 未检测到飞书JS SDK，使用后端API模式');
            isFeishuEnv = false;
            AITrainingUtils.safeSetContent(document.getElementById('envStatus'), '<i class="fas fa-server text-info me-1"></i>后端API模式', true);
            return;
        }

        // 初始化飞书Base管理器
        if (typeof FeishuBase !== 'undefined') {
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

// 加载员工数据（修复版本 - 使用飞书组织架构同步）
async function loadEmployees() {
    const select = document.getElementById('employeeSelect');
    const loadingElement = document.getElementById('loadingEmployees');

    try {
        // 显示加载状态
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }

        let employees = [];

        // 优先使用飞书组织架构同步
        if (window.FeishuOrgSync) {
            console.log('📋 从飞书组织架构同步加载员工...');

            // 获取缓存的组织架构数据
            const orgData = window.FeishuOrgSync.getCachedOrganizationData();

            if (orgData && orgData.employees && orgData.employees.length > 0) {
                employees = orgData.employees.map(emp => ({
                    id: emp.user_id,
                    name: emp.name,
                    department: emp.department_name || emp.department_ids?.join(', ') || '未知部门'
                }));
                console.log(`✅ 从组织架构缓存加载 ${employees.length} 名员工`);
            } else {
                // 如果没有缓存，尝试同步
                console.log('⚠️ 未找到组织架构缓存，尝试同步...');
                const syncResult = await window.FeishuOrgSync.syncOrganization();

                if (syncResult.success && syncResult.data.employees) {
                    employees = syncResult.data.employees.map(emp => ({
                        id: emp.user_id,
                        name: emp.name,
                        department: emp.department_name || emp.department_ids?.join(', ') || '未知部门'
                    }));
                    console.log(`✅ 同步并加载 ${employees.length} 名员工`);
                } else {
                    console.warn('⚠️ 组织架构同步失败，使用空列表');
                    employees = [];
                }
            }
        } else if (isFeishuEnv && typeof FeishuBase !== 'undefined') {
            // 从飞书Base获取员工数据
            employees = await FeishuBase.loadEmployees();
            console.log(`从飞书Base获取${employees.length}名员工数据`);
        } else {
            // 本地模拟数据（仅在开发时使用）
            console.warn('⚠️ 未找到飞书组织架构同步数据，请先同步组织架构');
            employees = [];
        }

        // 存储员工列表
        employeesList = employees;

        // 清空现有选项
        select.innerHTML = '<option value="">请选择员工</option>';

        // 添加员工选项
        if (employees.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '-- 暂无员工数据，请先同步组织架构 --';
            option.disabled = true;
            select.appendChild(option);
        } else {
            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.name;
                option.textContent = `${emp.name} - ${emp.department}`;
                option.dataset.department = emp.department;
                select.appendChild(option);
            });
        }

        console.log(`✅ 员工列表加载完成，共 ${employees.length} 人`);

    } catch (error) {
        console.error('❌ 加载员工数据失败:', error);

        // 显示错误状态
        select.innerHTML = '<option value="">加载失败</option>';
        const option = document.createElement('option');
        option.value = '';
        option.textContent = '-- 员工数据加载失败，请刷新页面重试 --';
        option.disabled = true;
        select.appendChild(option);

    } finally {
        // 隐藏加载状态
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// 加载评分配置
async function loadScoreConfig() {
    try {
        // 这里可以从飞书Base或本地存储加载评分配置
        // 目前使用默认配置
        scoreConfigs = {
            training: {
                weights: {
                    understanding: 30,
                    practice: 30,
                    interaction: 20,
                    completion: 20
                }
            },
            application: {
                weights: {
                    toolUsage: 25,
                    efficiency: 25,
                    quality: 25,
                    innovation: 25
                }
            }
        };

        console.log('评分配置加载完成:', scoreConfigs);
    } catch (error) {
        console.error('加载评分配置失败:', error);
    }
}

// 初始化滑块和输入框同步
function initializeScoreInputs() {
    const scoreInputs = document.querySelectorAll('.score-input');

    scoreInputs.forEach(input => {
        const sliderId = input.dataset.slider;
        const numberId = input.dataset.number;

        if (sliderId && numberId) {
            const slider = document.getElementById(sliderId);
            const number = document.getElementById(numberId);

            if (slider && number) {
                // 滑块变化时更新数字输入框
                slider.addEventListener('input', function() {
                    number.value = this.value;
                    updateScorePreview();
                });

                // 数字输入框变化时更新滑块
                number.addEventListener('input', function() {
                    let value = parseInt(this.value);
                    if (isNaN(value)) value = 0;
                    if (value < 0) value = 0;
                    if (value > 100) value = 100;
                    slider.value = value;
                    updateScorePreview();
                });

                console.log(`✅ 初始化评分输入: ${sliderId} ↔ ${numberId}`);
            }
        }
    });
}

// 绑定事件监听器
function bindEventListeners() {
    // 员工选择变化
    const employeeSelect = document.getElementById('employeeSelect');
    if (employeeSelect) {
        employeeSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const department = selectedOption.dataset.department || '';

            const employeeDept = document.getElementById('employeeDept');
            if (employeeDept) {
                employeeDept.value = department;
            }

            console.log(`选择员工: ${this.value}, 部门: ${department}`);
        });
    }

    // 保存按钮
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveEvaluation);
    }

    // 重置按钮
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }

    console.log('事件监听器绑定完成');
}

// 更新分数预览
function updateScorePreview() {
    try {
        // 培训评分
        const trainingScores = {
            understanding: parseInt(document.getElementById('understandingScore')?.value || 0),
            practice: parseInt(document.getElementById('practiceScore')?.value || 0),
            interaction: parseInt(document.getElementById('interactionScore')?.value || 0),
            completion: parseInt(document.getElementById('completionScore')?.value || 0)
        };

        // 应用评分
        const applicationScores = {
            toolUsage: parseInt(document.getElementById('toolUsageScore')?.value || 0),
            efficiency: parseInt(document.getElementById('efficiencyScore')?.value || 0),
            quality: parseInt(document.getElementById('qualityScore')?.value || 0),
            innovation: parseInt(document.getElementById('innovationScore')?.value || 0)
        };

        // 计算培训总分
        const trainingTotal = Math.round(
            trainingScores.understanding * 0.3 +
            trainingScores.practice * 0.3 +
            trainingScores.interaction * 0.2 +
            trainingScores.completion * 0.2
        );

        // 计算应用总分
        const applicationTotal = Math.round(
            applicationScores.toolUsage * 0.25 +
            applicationScores.efficiency * 0.25 +
            applicationScores.quality * 0.25 +
            applicationScores.innovation * 0.25
        );

        // 计算最终得分
        const finalScore = Math.round((trainingTotal + applicationTotal) / 2);

        // 更新显示
        const finalScoreElement = document.getElementById('finalScorePreview');
        const trainingTotalElement = document.getElementById('trainingTotalPreview');
        const applicationTotalElement = document.getElementById('applicationTotalPreview');

        if (finalScoreElement) finalScoreElement.textContent = finalScore;
        if (trainingTotalElement) trainingTotalElement.textContent = trainingTotal;
        if (applicationTotalElement) applicationTotalElement.textContent = applicationTotal;

    } catch (error) {
        console.error('更新分数预览失败:', error);
    }
}

// 保存评估
async function saveEvaluation() {
    try {
        const employee = document.getElementById('employeeSelect').value;
        const department = document.getElementById('employeeDept').value;
        const date = document.getElementById('evaluationDate').value;

        if (!employee) {
            alert('请选择被评估员工');
            return;
        }

        // 收集评分数据
        const evaluationData = {
            employee,
            department,
            date,
            judge: document.getElementById('judgeName')?.textContent || '未知',
            training_scores: {
                understanding: parseInt(document.getElementById('understandingScore')?.value || 0),
                practice: parseInt(document.getElementById('practiceScore')?.value || 0),
                interaction: parseInt(document.getElementById('interactionScore')?.value || 0),
                completion: parseInt(document.getElementById('completionScore')?.value || 0)
            },
            application_scores: {
                toolUsage: parseInt(document.getElementById('toolUsageScore')?.value || 0),
                efficiency: parseInt(document.getElementById('efficiencyScore')?.value || 0),
                quality: parseInt(document.getElementById('qualityScore')?.value || 0),
                innovation: parseInt(document.getElementById('innovationScore')?.value || 0)
            },
            final_score: parseInt(document.getElementById('finalScorePreview')?.textContent || 0)
        };

        console.log('保存评估数据:', evaluationData);

        // 如果有飞书Base，保存到Base
        if (isFeishuEnv && typeof FeishuBase !== 'undefined') {
            await FeishuBase.saveEvaluation(evaluationData);
            alert('评估数据已保存到飞书Base');
        } else if (window.APIClient) {
            // 使用后端API保存
            await window.APIClient.saveTrainingScore(evaluationData);
            alert('评估数据已保存');
        } else {
            // 保存到本地存储
            const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
            evaluations.push(evaluationData);
            localStorage.setItem('evaluations', JSON.stringify(evaluations));
            alert('评估数据已保存到本地');
        }

    } catch (error) {
        console.error('保存评估失败:', error);
        alert('保存失败: ' + error.message);
    }
}

// 重置表单
function resetForm() {
    document.getElementById('employeeSelect').value = '';
    document.getElementById('employeeDept').value = '';

    // 重置所有评分为0
    const scores = document.querySelectorAll('[id$="Score"]');
    scores.forEach(score => {
        if (score.type === 'range') {
            score.value = 0;
        } else {
            score.value = '0';
        }
    });

    updateScorePreview();
}

console.log('AI培训评估系统主模块已加载');
