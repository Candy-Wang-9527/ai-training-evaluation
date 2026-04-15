/**
 * AI培训评估系统 - 工作流管理模块
 * 支持多级评审流程：人力录入 → 技术委员会评审 → 总经理审批
 */

// 工作流配置
const WORKFLOW_CONFIG = {
    // 评审阶段定义
    stages: {
        HR_ENTRY: 'hr_entry',           // 人力录入阶段
        TECH_REVIEW: 'tech_review',     // 技术委员会评审阶段
        GM_APPROVAL: 'gm_approval',     // 总经理审批阶段
        COMPLETED: 'completed'          // 完成状态
    },

    // 用户角色定义
    roles: {
        HR: 'hr',                       // 人力部门
        TECH_COMMITTEE: 'tech_committee', // 技术架构委员会
        GM: 'gm',                       // 总经理
        ADMIN: 'admin'                  // 管理员
    },

    // 阶段权限配置
    stagePermissions: {
        hr_entry: {
            allowedRoles: ['hr', 'admin'],
            editableFields: ['employee_info', 'training_basic_info'],
            readonlyFields: ['scores', 'technical_comments'],
            actions: ['submit_to_tech_review', 'save_draft']
        },
        tech_review: {
            allowedRoles: ['tech_committee', 'admin'],
            editableFields: ['scores', 'technical_comments'],
            readonlyFields: ['employee_info', 'training_basic_info'],
            actions: ['submit_to_gm', 'request_revision', 'save_draft']
        },
        gm_approval: {
            allowedRoles: ['gm', 'admin'],
            editableFields: ['scores', 'final_approval'],
            readonlyFields: [],
            actions: ['approve', 'request_revision', 'adjust_scores']
        },
        completed: {
            allowedRoles: ['hr', 'tech_committee', 'gm', 'admin'],
            editableFields: [],
            readonlyFields: ['all'],
            actions: ['view', 'export']
        }
    }
};

/**
 * 工作流管理器类
 */
class WorkflowManager {
    constructor() {
        this.currentRole = null;
        this.currentStage = null;
        this.evaluationData = null;
    }

    /**
     * 初始化工作流管理器
     */
    async initialize() {
        // 检测飞书环境
        if (typeof lark !== 'undefined' && lark.ready) {
            await this.detectUserRole();
        } else {
            // 非飞书环境，使用模拟角色
            this.currentRole = this.promptForRole();
        }

        console.log('工作流管理器初始化完成，当前角色:', this.currentRole);
        return this.currentRole;
    }

    /**
     * 检测用户角色（飞书环境）
     */
    async detectUserRole() {
        try {
            // 获取用户信息
            const userInfo = await this.getFeishuUserInfo();

            if (!userInfo) {
                throw new Error('无法获取用户信息');
            }

            // 根据部门信息判断角色
            this.currentRole = this.assessUserRole(userInfo);

            // 在UI上显示当前角色
            this.displayUserRole(userInfo);

        } catch (error) {
            console.error('角色检测失败:', error);
            this.currentRole = WORKFLOW_CONFIG.roles.HR; // 默认角色
        }
    }

    /**
     * 获取飞书用户信息
     */
    async getFeishuUserInfo() {
        try {
            // 调用飞书API获取用户信息
            const response = await lark.user.getUserInfo();

            if (response.code === 0) {
                return response.data;
            } else {
                throw new Error(`获取用户信息失败: ${response.msg}`);
            }
        } catch (error) {
            console.error('获取飞书用户信息失败:', error);
            return null;
        }
    }

    /**
     * 根据用户信息评估角色
     */
    assessUserRole(userInfo) {
        // 这里可以根据实际的飞书组织架构来判断
        // 示例逻辑：

        const department = userInfo.department?.name || '';
        const userId = userInfo.user_id || '';
        const name = userInfo.name || '';

        // 特定用户ID映射（可以配置化）
        const GM_USER_IDS = ['ou_1234567890']; // 总经理的用户ID列表
        const HR_DEPARTMENTS = ['人力部', '人力资源部', 'HR']; // 人力部门列表
        const TECH_DEPARTMENTS = ['技术部', '技术架构委员会', '研发部']; // 技术部门列表

        // 判断是否为总经理
        if (GM_USER_IDS.includes(userId) || name.includes('总经理')) {
            return WORKFLOW_CONFIG.roles.GM;
        }

        // 判断部门角色
        if (HR_DEPARTMENTS.some(dept => department.includes(dept))) {
            return WORKFLOW_CONFIG.roles.HR;
        }

        if (TECH_DEPARTMENTS.some(dept => department.includes(dept))) {
            return WORKFLOW_CONFIG.roles.TECH_COMMITTEE;
        }

        // 默认为人力角色
        return WORKFLOW_CONFIG.roles.HR;
    }

    /**
     * 在UI上显示用户角色
     */
    displayUserRole(userInfo) {
        const roleDisplay = document.getElementById('userRole');
        const roleBadge = document.getElementById('roleBadge');

        if (roleDisplay) {
            const roleName = this.getRoleDisplayName(this.currentRole);
            roleDisplay.textContent = roleName;
        }

        if (roleBadge) {
            // 移除旧的角色徽章
            roleBadge.className = 'badge';

            // 添加新的角色徽章样式
            switch(this.currentRole) {
                case WORKFLOW_CONFIG.roles.GM:
                    roleBadge.classList.add('bg-danger');
                    break;
                case WORKFLOW_CONFIG.roles.TECH_COMMITTEE:
                    roleBadge.classList.add('bg-warning');
                    break;
                case WORKFLOW_CONFIG.roles.HR:
                    roleBadge.classList.add('bg-info');
                    break;
                default:
                    roleBadge.classList.add('bg-secondary');
            }

            roleBadge.textContent = this.getRoleDisplayName(this.currentRole);
        }
    }

    /**
     * 获取角色显示名称
     */
    getRoleDisplayName(role) {
        const roleNames = {
            'hr': '人力部门',
            'tech_committee': '技术架构委员会',
            'gm': '总经理',
            'admin': '管理员'
        };
        return roleNames[role] || '未知角色';
    }

    /**
     * 非飞书环境下的角色选择提示
     */
    promptForRole() {
        // 开发/测试环境下使用
        const savedRole = localStorage.getItem('test_user_role');
        return savedRole || WORKFLOW_CONFIG.roles.HR;
    }

    /**
     * 设置当前评估的阶段
     */
    setCurrentStage(stage) {
        this.currentStage = stage;
        this.configureUIForStage(stage);
    }

    /**
     * 配置UI以适应当前阶段
     */
    configureUIForStage(stage) {
        const permissions = WORKFLOW_CONFIG.stagePermissions[stage];

        if (!permissions) {
            console.warn('未找到阶段权限配置:', stage);
            return;
        }

        // 检查当前用户是否有权限访问此阶段
        if (!permissions.allowedRoles.includes(this.currentRole)) {
            this.handleUnauthorizedAccess(stage);
            return;
        }

        // 根据权限配置UI
        this.configureFieldsByPermissions(permissions);
        this.configureActionsByPermissions(permissions);
    }

    /**
     * 处理未授权访问
     */
    handleUnauthorizedAccess(stage) {
        const stageName = this.getStageDisplayName(stage);
        const roleName = this.getRoleDisplayName(this.currentRole);

        AITrainingUtils.showAlert(
            `访问被拒绝：${roleName} 无权访问${stageName}阶段`,
            'error'
        );

        // 禁用表单
        this.disableAllForms();
    }

    /**
     * 根据权限配置字段状态
     */
    configureFieldsByPermissions(permissions) {
        // 可编辑字段
        permissions.editableFields.forEach(field => {
            this.enableField(field);
        });

        // 只读字段
        permissions.readonlyFields.forEach(field => {
            if (field === 'all') {
                this.disableAllFields();
            } else {
                this.disableField(field);
            }
        });
    }

    /**
     * 启用字段
     */
    enableField(field) {
        // 根据字段ID启用相关元素
        const fieldMappings = {
            'employee_info': ['#employeeSelect', '#evaluationDate'],
            'scores': ['[id^="score"][id$="Slider"]', '[id^="score"][id$="Input"]'],
            'technical_comments': ['#trainingComments', '#applicationComments'],
            'final_approval': ['#gmComments', '#finalScoreAdjustment']
        };

        const selectors = fieldMappings[field] || [];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.disabled = false;
            });
        });
    }

    /**
     * 禁用字段
     */
    disableField(field) {
        const fieldMappings = {
            'employee_info': ['#employeeSelect', '#evaluationDate'],
            'scores': ['[id^="score"][id$="Slider"]', '[id^="score"][id$="Input"]'],
            'technical_comments': ['#trainingComments', '#applicationComments']
        };

        const selectors = fieldMappings[field] || [];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.disabled = true;
            });
        });
    }

    /**
     * 禁用所有字段
     */
    disableAllFields() {
        const allInputs = document.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.disabled = true;
            }
        });
    }

    /**
     * 禁用所有表单
     */
    disableAllForms() {
        this.disableAllFields();

        // 禁用操作按钮
        const actionButtons = document.querySelectorAll('#saveBtn, #submitBtn, #resetBtn');
        actionButtons.forEach(btn => {
            btn.disabled = true;
        });
    }

    /**
     * 根据权限配置操作按钮
     */
    configureActionsByPermissions(permissions) {
        // 隐藏所有操作按钮
        this.hideAllActionButtons();

        // 显示有权限的操作按钮
        permissions.actions.forEach(action => {
            this.showActionButton(action);
        });
    }

    /**
     * 隐藏所有操作按钮
     */
    hideAllActionButtons() {
        const buttons = {
            'save_draft': '#saveBtn',
            'submit_to_tech_review': '#submitToTechBtn',
            'submit_to_gm': '#submitToGMBtn',
            'approve': '#approveBtn',
            'request_revision': '#requestRevisionBtn',
            'adjust_scores': '#adjustScoresBtn'
        };

        Object.values(buttons).forEach(selector => {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.style.display = 'none';
            }
        });
    }

    /**
     * 显示操作按钮
     */
    showActionButton(action) {
        const buttonMappings = {
            'save_draft': '#saveBtn',
            'submit_to_tech_review': '#submitToTechBtn',
            'submit_to_gm': '#submitToGMBtn',
            'approve': '#approveBtn',
            'request_revision': '#requestRevisionBtn'
        };

        const selector = buttonMappings[action];
        if (selector) {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.style.display = 'block';
            }
        }
    }

    /**
     * 获取阶段显示名称
     */
    getStageDisplayName(stage) {
        const stageNames = {
            'hr_entry': '人力录入',
            'tech_review': '技术评审',
            'gm_approval': '总经理审批',
            'completed': '已完成'
        };
        return stageNames[stage] || stage;
    }

    /**
     * 检查权限
     */
    hasPermission(action) {
        if (!this.currentStage) return false;

        const permissions = WORKFLOW_CONFIG.stagePermissions[this.currentStage];
        return permissions && permissions.actions.includes(action);
    }

    /**
     * 创建新的评估记录
     */
    async createEvaluation(employeeData) {
        const evaluation = {
            id: this.generateEvaluationId(),
            employee_id: employeeData.employee_id,
            employee_name: employeeData.employee_name,
            department: employeeData.department,
            evaluation_period: employeeData.evaluation_period,

            // 工作流状态
            status: 'draft',
            current_stage: WORKFLOW_CONFIG.stages.HR_ENTRY,

            // 时间戳
            created_time: new Date().toISOString(),
            created_by: this.currentRole,

            // 历史记录
            workflow_history: [{
                action: 'create',
                stage: WORKFLOW_CONFIG.stages.HR_ENTRY,
                actor: this.currentRole,
                timestamp: new Date().toISOString()
            }]
        };

        return evaluation;
    }

    /**
     * 生成评估ID
     */
    generateEvaluationId() {
        return `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 提交到下一阶段
     */
    async submitToNextStage(currentEvaluation) {
        const stageFlow = {
            [WORKFLOW_CONFIG.stages.HR_ENTRY]: WORKFLOW_CONFIG.stages.TECH_REVIEW,
            [WORKFLOW_CONFIG.stages.TECH_REVIEW]: WORKFLOW_CONFIG.stages.GM_APPROVAL,
            [WORKFLOW_CONFIG.stages.GM_APPROVAL]: WORKFLOW_CONFIG.stages.COMPLETED
        };

        const nextStage = stageFlow[currentEvaluation.current_stage];

        if (!nextStage) {
            throw new Error('无法确定下一阶段');
        }

        // 更新评估状态
        currentEvaluation.current_stage = nextStage;
        currentEvaluation.workflow_history.push({
            action: 'transition',
            from_stage: currentEvaluation.current_stage,
            to_stage: nextStage,
            actor: this.currentRole,
            timestamp: new Date().toISOString()
        });

        return currentEvaluation;
    }
}

// 创建全局工作流管理器实例
const workflowManager = new WorkflowManager();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WorkflowManager, WORKFLOW_CONFIG, workflowManager };
}