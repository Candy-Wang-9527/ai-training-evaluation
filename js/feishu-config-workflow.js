// 飞书Base集成配置文件 - 多级评审流程版本
// Base链接：https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc
// 支持7个表格的完整业务流程

const FEISHU_BASE_CONFIG = {
    // Base应用信息
    app_token: "GA1QbgqTzaHaVIsIKWDcFI79nuc",
    base_url: "https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc",

    // 7个表格ID配置
    tables: {
        employees: "tblIVqXEzmZdKxjI",           // 1. 员工信息表
        trainings: "tblCfjFzfiZ2yvRr",          // 2. 培训记录表
        judges: "tblYqGszLDdookcH",             // 3. 评委信息表
        training_scores: "tblg3G6KPSAhBHNw",    // 4. 培训打分表
        application_scores: "tblHwmO8RAe9KBIm", // 5. AI应用打分表
        score_configs: "tblaZKWjxym9YnLJ",      // 6. 评分配置表
        evaluation_summary: "tblG0iiVyCRdZj2U"  // 7. 评估汇总表
    },

    // 工作流阶段定义
    workflow_stages: {
        HR_ENTRY: 'hr_entry',           // 人力录入阶段
        TECH_REVIEW: 'tech_review',     // 技术委员会评审阶段
        GM_APPROVAL: 'gm_approval',     // 总经理审批阶段
        COMPLETED: 'completed'          // 完成状态
    },

    // 用户角色定义
    user_roles: {
        HR: 'hr',                       // 人力部门
        TECH_COMMITTEE: 'tech_committee', // 技术架构委员会
        GM: 'gm',                       // 总经理
        ADMIN: 'admin'                  // 管理员
    },

    // 字段映射配置（需要根据实际Base表格字段ID调整）
    field_mappings: {
        // 1. 员工信息表字段
        employees: {
            name: "name",                    // 员工姓名
            department: "department",        // 所属部门
            position: "position",            // 职位
            employee_id: "employee_id",      // 员工编号
            join_date: "join_date",          // 入职日期
            status: "status",                // 在职状态
            email: "email",                  // 邮箱
            phone: "phone"                   // 电话
        },

        // 2. 培训记录表字段
        trainings: {
            training_name: "training_name",   // 培训名称
            training_type: "training_type",   // 培训类型
            start_date: "start_date",         // 开始日期
            end_date: "end_date",             // 结束日期
            participants: "participants",     // 参与人员
            trainer: "trainer",               // 培训师
            location: "location",             // 培训地点
            description: "description"        // 培训描述
        },

        // 3. 评委信息表字段
        judges: {
            judge_name: "judge_name",         // 评委姓名
            judge_dept: "judge_dept",         // 所属部门
            judge_role: "judge_role",         // 评委角色
            judge_level: "judge_level",       // 评委级别
            specialization: "specialization", // 专业领域
            email: "email",                   // 邮箱
            phone: "phone",                   // 电话
            status: "status"                  // 状态
        },

        // 4. 培训打分表字段
        training_scores: {
            record_id: "record_id",           // 记录ID
            employee_name: "employee_name",   // 员工姓名
            evaluation_date: "evaluation_date", // 评估日期
            score1: "score1",                 // 培训维度1评分
            score2: "score2",                 // 培训维度2评分
            score3: "score3",                 // 培训维度3评分
            score4: "score4",                 // 培训维度4评分
            score5: "score5",                 // 培训维度5评分
            total_score: "total_score",       // 总分
            evaluator: "evaluator",           // 评估人
            eval_stage: "eval_stage",         // 评估阶段
            comments: "comments",             // 评语
            workflow_status: "workflow_status", // 工作流状态
            created_time: "created_time",     // 创建时间
            modified_time: "modified_time"    // 修改时间
        },

        // 5. AI应用打分表字段
        application_scores: {
            record_id: "record_id",           // 记录ID
            employee_name: "employee_name",   // 员工姓名
            evaluation_date: "evaluation_date", // 评估日期
            score6: "score6",                 // 应用维度1评分
            score7: "score7",                 // 应用维度2评分
            total_score: "total_score",       // 总分
            evaluator: "evaluator",           // 评估人
            eval_stage: "eval_stage",         // 评估阶段
            comments: "comments",             // 评语
            workflow_status: "workflow_status", // 工作流状态
            created_time: "created_time",     // 创建时间
            modified_time: "modified_time"    // 修改时间
        },

        // 6. 评分配置表字段
        score_configs: {
            config_id: "config_id",           // 配置ID
            category: "category",             // 分类（培训/应用）
            dimension: "dimension",           // 维度名称
            weight: "weight",                 // 权重
            description: "description",       // 描述
            max_score: "max_score",           // 最高分
            min_score: "min_score",           // 最低分
            is_active: "is_active"            // 是否启用
        },

        // 7. 评估汇总表字段（工作流核心表）
        evaluation_summary: {
            summary_id: "summary_id",         // 汇总ID
            employee_name: "employee_name",   // 员工姓名
            evaluation_period: "evaluation_period", // 评估周期
            evaluation_date: "evaluation_date", // 评估日期

            // 工作流字段
            workflow_stage: "workflow_stage", // 当前阶段
            workflow_status: "workflow_status", // 状态
            current_role: "current_role",     // 当前处理角色

            // 分数字段
            training_total: "training_total", // 培训总分
            application_total: "application_total", // 应用总分
            final_score: "final_score",       // 最终得分

            // 评语字段
            training_comments: "training_comments",     // 培训评语
            application_comments: "application_comments", // 应用评语
            overall_suggestions: "overall_suggestions",   // 综合建议
            gm_comments: "gm_comments",                 // 总经理评语

            // 时间戳字段
            hr_submit_time: "hr_submit_time",       // 人力提交时间
            tech_review_time: "tech_review_time",   // 技术评审时间
            gm_approval_time: "gm_approval_time",   // 总经理审批时间
            complete_time: "complete_time",         // 完成时间

            // 人员字段
            created_by: "created_by",           // 创建人
            modified_by: "modified_by",         // 最后修改人
            tech_reviewer: "tech_reviewer",     // 技术评审人
            gm_approver: "gm_approver",         // 总经理审批人

            // 历史记录字段
            workflow_history: "workflow_history", // 工作流历史（JSON）
            modification_history: "modification_history" // 修改历史（JSON）
        }
    },

    // 部门到角色的映射配置
    department_role_mapping: {
        // 人力部门
        '人力部': 'hr',
        '人力资源部': 'hr',
        'HR': 'hr',

        // 技术部门
        '技术部': 'tech_committee',
        '技术架构委员会': 'tech_committee',
        '研发部': 'tech_committee',
        '技术委员会': 'tech_committee',

        // 总经理办公室
        '总经理办公室': 'gm',
        '管理层': 'gm'
    },

    // 总经理用户ID映射（特殊权限）
    gm_user_ids: [
        // 可以在这里添加总经理的飞书用户ID
        // 'ou_xxxxxxxxxxxxxxxx'
    ]
};

// 飞书Base工作流客户端类
class FeishuBaseWorkflowClient {
    constructor() {
        this.config = FEISHU_BASE_CONFIG;
        this.lark = window.lark || null;
        this.isInitialized = false;
        this.currentUser = null;
        this.currentRole = null;
    }

    // 初始化客户端
    async initialize() {
        try {
            if (!this.lark) {
                console.warn('飞书JS SDK未加载，使用本地模式');
                return false;
            }

            // 初始化飞书SDK
            await this.lark.ready({});
            this.isInitialized = true;

            // 获取当前用户信息
            await this.getCurrentUserInfo();

            // 根据部门信息判断角色
            this.assessUserRole();

            console.log('飞书Base工作流客户端初始化成功');
            console.log('当前用户:', this.currentUser);
            console.log('当前角色:', this.currentRole);

            return true;

        } catch (error) {
            console.error('飞书Base客户端初始化失败:', error);
            return false;
        }
    }

    // 获取当前用户信息
    async getCurrentUserInfo() {
        try {
            const response = await this.lark.user.getUserInfo({});
            if (response.code === 0) {
                this.currentUser = {
                    user_id: response.data.user_id,
                    name: response.data.name,
                    avatar_url: response.data.avatar_url,
                    // 可能需要额外请求获取部门信息
                    department: await this.getUserDepartment(response.data.user_id)
                };
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            // 使用模拟用户信息
            this.currentUser = {
                user_id: 'mock_user_id',
                name: '测试用户',
                department: '技术部'
            };
        }
    }

    // 获取用户部门信息（模拟）
    async getUserDepartment(userId) {
        // 这里需要调用飞书API获取用户的部门信息
        // 目前返回模拟数据
        return '技术部';
    }

    // 评估用户角色
    assessUserRole() {
        if (!this.currentUser) {
            this.currentRole = this.config.user_roles.HR;
            return;
        }

        // 检查是否为总经理（通过用户ID）
        if (this.config.gm_user_ids.includes(this.currentUser.user_id)) {
            this.currentRole = this.config.user_roles.GM;
            return;
        }

        // 根据部门映射角色
        const department = this.currentUser.department || '';
        let assignedRole = this.config.user_roles.HR; // 默认为人力角色

        for (const [dept, role] of Object.entries(this.config.department_role_mapping)) {
            if (department.includes(dept)) {
                assignedRole = role;
                break;
            }
        }

        this.currentRole = assignedRole;
    }

    // 获取表格数据
    async getTableData(tableName, options = {}) {
        try {
            const tableId = this.config.tables[tableName];
            if (!tableId) {
                throw new Error(`未找到表配置: ${tableName}`);
            }

            if (this.isInitialized && this.lark) {
                // 使用飞书API获取数据
                const response = await this.lark.bitable.appTableRecord.list({
                    app_token: this.config.app_token,
                    table_id: tableId,
                    ...options
                });

                if (response.code === 0) {
                    return this.formatRecords(response.data.items, tableName);
                } else {
                    throw new Error(`API调用失败: ${response.msg}`);
                }
            } else {
                // 非飞书环境，返回模拟数据
                console.log(`非飞书环境，返回${tableName}模拟数据`);
                return this.getMockData(tableName);
            }
        } catch (error) {
            console.error(`获取${tableName}数据失败:`, error);
            return this.getMockData(tableName);
        }
    }

    // 创建记录
    async createRecord(tableName, data) {
        try {
            const tableId = this.config.tables[tableName];
            if (!tableId) {
                throw new Error(`未找到表配置: ${tableName}`);
            }

            if (this.isInitialized && this.lark) {
                // 映射字段名到字段ID
                const mappedData = this.mapFieldsToIds(tableName, data);

                const response = await this.lark.bitable.appTableRecord.create({
                    app_token: this.config.app_token,
                    table_id: tableId,
                    fields: mappedData
                });

                if (response.code === 0) {
                    return {
                        success: true,
                        record_id: response.data.record.record_id,
                        message: `${tableName}记录创建成功`
                    };
                } else {
                    throw new Error(`API调用失败: ${response.msg}`);
                }
            } else {
                // 本地存储模拟
                return this.saveToLocalMock(tableName, data);
            }
        } catch (error) {
            console.error(`创建${tableName}记录失败:`, error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // 更新记录
    async updateRecord(tableName, recordId, data) {
        try {
            const tableId = this.config.tables[tableName];
            if (!tableId) {
                throw new Error(`未找到表配置: ${tableName}`);
            }

            if (this.isInitialized && this.lark) {
                const mappedData = this.mapFieldsToIds(tableName, data);

                const response = await this.lark.bitable.appTableRecord.update({
                    app_token: this.config.app_token,
                    table_id: tableId,
                    record_id: recordId,
                    fields: mappedData
                });

                if (response.code === 0) {
                    return {
                        success: true,
                        message: `${tableName}记录更新成功`
                    };
                } else {
                    throw new Error(`API调用失败: ${response.msg}`);
                }
            } else {
                // 本地存储模拟更新
                return this.updateLocalMock(tableName, recordId, data);
            }
        } catch (error) {
            console.error(`更新${tableName}记录失败:`, error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // 映射字段名到字段ID
    mapFieldsToIds(tableName, data) {
        const fieldMappings = this.config.field_mappings[tableName];
        const mappedData = {};

        for (const [fieldName, fieldValue] of Object.entries(data)) {
            const fieldId = fieldMappings[fieldName] || fieldName;
            mappedData[fieldId] = fieldValue;
        }

        return mappedData;
    }

    // 格式化记录
    formatRecords(records, tableName) {
        const fieldMap = this.config.field_mappings[tableName] || {};
        const reverseMap = {};

        // 创建反向映射：字段ID -> 字段名
        for (const [fieldName, fieldId] of Object.entries(fieldMap)) {
            reverseMap[fieldId] = fieldName;
        }

        return records.map(record => {
            const formatted = {
                record_id: record.record_id,
                created_time: record.created_time,
                modified_time: record.modified_time
            };

            // 映射字段值
            for (const [fieldId, fieldValue] of Object.entries(record.fields)) {
                const fieldName = reverseMap[fieldId] || fieldId;
                formatted[fieldName] = fieldValue;
            }

            return formatted;
        });
    }

    // 获取模拟数据
    getMockData(tableName) {
        const mockData = {
            employees: [
                { record_id: 'emp_1', name: '张三', department: '研发部', position: '工程师', status: '在职' },
                { record_id: 'emp_2', name: '李四', department: '产品部', position: '产品经理', status: '在职' },
                { record_id: 'emp_3', name: '王五', department: '销售部', position: '销售经理', status: '在职' },
                { record_id: 'emp_4', name: '赵六', department: '实施部', position: '实施工程师', status: '在职' }
            ],
            judges: [
                { record_id: 'judge_1', judge_name: '王浩', judge_dept: '销售与售前部', judge_role: '技术评委', status: '活跃' }
            ],
            score_configs: [
                { record_id: 'cfg_1', category: '培训', dimension: '入门培训/基础使用', weight: 0.2, max_score: 100, min_score: 0 },
                { record_id: 'cfg_2', category: '培训', dimension: '优化使用方法', weight: 0.2, max_score: 100, min_score: 0 },
                { record_id: 'cfg_3', category: '培训', dimension: '质量保障', weight: 0.2, max_score: 100, min_score: 0 },
                { record_id: 'cfg_4', category: '培训', dimension: '团队赋能', weight: 0.2, max_score: 100, min_score: 0 },
                { record_id: 'cfg_5', category: '培训', dimension: 'OKR贡献', weight: 0.2, max_score: 100, min_score: 0 },
                { record_id: 'cfg_6', category: '应用', dimension: 'OKR关联度', weight: 0.5, max_score: 100, min_score: 0 },
                { record_id: 'cfg_7', category: '应用', dimension: 'OKR贡献度', weight: 0.5, max_score: 100, min_score: 0 }
            ],
            training_scores: [],
            application_scores: [],
            evaluation_summary: []
        };

        return mockData[tableName] || [];
    }

    // 本地存储模拟
    saveToLocalMock(tableName, data) {
        const localStorageKey = `feishu_workflow_${tableName}`;
        let mockData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');

        const newRecord = {
            record_id: `local_${Date.now()}`,
            ...data,
            created_time: new Date().toISOString(),
            created_by: this.currentRole
        };

        mockData.push(newRecord);
        localStorage.setItem(localStorageKey, JSON.stringify(mockData));

        return {
            success: true,
            record_id: newRecord.record_id,
            message: `${tableName}记录已保存到本地（非飞书环境）`
        };
    }

    // 本地存储模拟更新
    updateLocalMock(tableName, recordId, data) {
        const localStorageKey = `feishu_workflow_${tableName}`;
        let mockData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');

        const recordIndex = mockData.findIndex(record => record.record_id === recordId);
        if (recordIndex >= 0) {
            mockData[recordIndex] = {
                ...mockData[recordIndex],
                ...data,
                modified_time: new Date().toISOString(),
                modified_by: this.currentRole
            };

            localStorage.setItem(localStorageKey, JSON.stringify(mockData));

            return {
                success: true,
                message: `${tableName}记录已更新（非飞书环境）`
            };
        } else {
            return {
                success: false,
                message: `记录不存在: ${recordId}`
            };
        }
    }

    // 获取评分配置（计算权重）
    async getScoreConfigs() {
        const configs = await this.getTableData('score_configs');

        // 按类别分组
        const trainingConfigs = configs.filter(c => c.category === '培训');
        const applicationConfigs = configs.filter(c => c.category === '应用');

        return {
            training: trainingConfigs,
            application: applicationConfigs,

            // 计算权重数组
            getTrainingWeights() {
                return trainingConfigs.map(c => parseFloat(c.weight) || 0.2);
            },

            getApplicationWeights() {
                return applicationConfigs.map(c => parseFloat(c.weight) || 0.5);
            },

            // 获取维度名称
            getTrainingDimensions() {
                return trainingConfigs.map(c => c.dimension);
            },

            getApplicationDimensions() {
                return applicationConfigs.map(c => c.dimension);
            }
        };
    }

    // 工作流：创建新的评估汇总记录
    async createEvaluationSummary(evaluationData) {
        const summaryData = {
            employee_name: evaluationData.employee_name,
            evaluation_period: evaluationData.evaluation_period,
            evaluation_date: evaluationData.evaluation_date,

            // 工作流初始化
            workflow_stage: this.config.workflow_stages.HR_ENTRY,
            workflow_status: 'draft',
            current_role: this.currentRole,

            // 初始化分数字段
            training_total: 0,
            application_total: 0,
            final_score: 0,

            // 时间戳
            hr_submit_time: new Date().toISOString(),

            // 创建人信息
            created_by: this.currentRole,

            // 初始化历史记录
            workflow_history: JSON.stringify([{
                action: 'create',
                stage: this.config.workflow_stages.HR_ENTRY,
                actor: this.currentRole,
                actor_name: this.currentUser?.name || '未知',
                timestamp: new Date().toISOString(),
                details: '创建评估记录'
            }])
        };

        return await this.createRecord('evaluation_summary', summaryData);
    }

    // 工作流：提交到下一阶段
    async submitToNextStage(summaryRecordId, currentStage, comments = '') {
        const stageFlow = {
            [this.config.workflow_stages.HR_ENTRY]: this.config.workflow_stages.TECH_REVIEW,
            [this.config.workflow_stages.TECH_REVIEW]: this.config.workflow_stages.GM_APPROVAL,
            [this.config.workflow_stages.GM_APPROVAL]: this.config.workflow_stages.COMPLETED
        };

        const nextStage = stageFlow[currentStage];
        if (!nextStage) {
            throw new Error('无法确定下一阶段');
        }

        // 准备更新数据
        const updateData = {
            workflow_stage: nextStage,
            workflow_status: nextStage === this.config.workflow_stages.COMPLETED ? 'completed' : 'in_progress',
            modified_by: this.currentRole,
            modified_time: new Date().toISOString()
        };

        // 添加时间戳
        if (nextStage === this.config.workflow_stages.TECH_REVIEW) {
            updateData.tech_review_time = new Date().toISOString();
            updateData.tech_reviewer = this.currentUser?.name || '未知';
        } else if (nextStage === this.config.workflow_stages.GM_APPROVAL) {
            updateData.gm_approval_time = new Date().toISOString();
            updateData.gm_approver = this.currentUser?.name || '未知';
        } else if (nextStage === this.config.workflow_stages.COMPLETED) {
            updateData.complete_time = new Date().toISOString();
        }

        // 更新工作流历史
        try {
            // 获取当前记录以获取历史记录
            const currentRecord = await this.getRecordById('evaluation_summary', summaryRecordId);
            let history = [];

            if (currentRecord && currentRecord.workflow_history) {
                try {
                    history = JSON.parse(currentRecord.workflow_history);
                } catch (e) {
                    console.warn('解析工作流历史失败:', e);
                }
            }

            // 添加新的历史记录
            history.push({
                action: 'transition',
                from_stage: currentStage,
                to_stage: nextStage,
                actor: this.currentRole,
                actor_name: this.currentUser?.name || '未知',
                timestamp: new Date().toISOString(),
                comments: comments,
                details: `从${currentStage}流转到${nextStage}`
            });

            updateData.workflow_history = JSON.stringify(history);

        } catch (error) {
            console.warn('获取工作流历史失败:', error);
        }

        return await this.updateRecord('evaluation_summary', summaryRecordId, updateData);
    }

    // 获取单条记录
    async getRecordById(tableName, recordId) {
        try {
            const tableId = this.config.tables[tableName];
            if (!tableId) {
                throw new Error(`未找到表配置: ${tableName}`);
            }

            if (this.isInitialized && this.lark) {
                const response = await this.lark.bitable.appTableRecord.get({
                    app_token: this.config.app_token,
                    table_id: tableId,
                    record_id: recordId
                });

                if (response.code === 0) {
                    return this.formatRecords([response.data.record], tableName)[0];
                } else {
                    throw new Error(`API调用失败: ${response.msg}`);
                }
            } else {
                // 从本地存储获取
                return this.getLocalRecordById(tableName, recordId);
            }
        } catch (error) {
            console.error(`获取${tableName}记录失败:`, error);
            return null;
        }
    }

    // 从本地存储获取记录
    getLocalRecordById(tableName, recordId) {
        const localStorageKey = `feishu_workflow_${tableName}`;
        const mockData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        return mockData.find(record => record.record_id === recordId) || null;
    }

    // 获取当前用户的待办任务
    async getMyTasks() {
        try {
            const allSummaries = await this.getTableData('evaluation_summary');

            // 根据当前角色筛选待办任务
            const myTasks = allSummaries.filter(summary => {
                // 只显示非完成状态的任务
                if (summary.workflow_status === 'completed') {
                    return false;
                }

                // 根据角色判断是否有权限处理
                switch (this.currentRole) {
                    case 'hr':
                        return summary.workflow_stage === this.config.workflow_stages.HR_ENTRY;
                    case 'tech_committee':
                        return summary.workflow_stage === this.config.workflow_stages.TECH_REVIEW;
                    case 'gm':
                        return summary.workflow_stage === this.config.workflow_stages.GM_APPROVAL;
                    default:
                        return false;
                }
            });

            return myTasks;
        } catch (error) {
            console.error('获取待办任务失败:', error);
            return [];
        }
    }

    // 检查用户是否有权限执行某个操作
    hasPermission(action, currentStage) {
        const permissions = {
            'hr': {
                allowed_stages: ['hr_entry'],
                allowed_actions: ['create', 'save_draft', 'submit_to_tech']
            },
            'tech_committee': {
                allowed_stages: ['tech_review'],
                allowed_actions: ['score', 'save_draft', 'submit_to_gm', 'request_revision']
            },
            'gm': {
                allowed_stages: ['gm_approval'],
                allowed_actions: ['review', 'adjust_score', 'approve', 'request_revision']
            }
        };

        const rolePermissions = permissions[this.currentRole];
        if (!rolePermissions) {
            return false;
        }

        return rolePermissions.allowed_stages.includes(currentStage) &&
               rolePermissions.allowed_actions.includes(action);
    }
}

// 创建全局实例
const feishuBaseWorkflowClient = new FeishuBaseWorkflowClient();

// 导出API
window.FeishuWorkflow = {
    initialize: async () => await feishuBaseWorkflowClient.initialize(),
    getTableData: async (tableName, options) => await feishuBaseWorkflowClient.getTableData(tableName, options),
    createRecord: async (tableName, data) => await feishuBaseWorkflowClient.createRecord(tableName, data),
    updateRecord: async (tableName, recordId, data) => await feishuBaseWorkflowClient.updateRecord(tableName, recordId, data),
    getRecordById: async (tableName, recordId) => await feishuBaseWorkflowClient.getRecordById(tableName, recordId),
    getScoreConfigs: async () => await feishuBaseWorkflowClient.getScoreConfigs(),
    createEvaluationSummary: async (data) => await feishuBaseWorkflowClient.createEvaluationSummary(data),
    submitToNextStage: async (recordId, currentStage, comments) => await feishuBaseWorkflowClient.submitToNextStage(recordId, currentStage, comments),
    getMyTasks: async () => await feishuBaseWorkflowClient.getMyTasks(),
    hasPermission: (action, currentStage) => feishuBaseWorkflowClient.hasPermission(action, currentStage),

    // 快捷访问
    client: feishuBaseWorkflowClient,
    config: FEISHU_BASE_CONFIG
};

console.log('飞书Base工作流集成配置已加载');
console.log('支持的表格:', Object.keys(FEISHU_BASE_CONFIG.tables));
console.log('工作流阶段:', FEISHU_BASE_CONFIG.workflow_stages);
console.log('用户角色:', FEISHU_BASE_CONFIG.user_roles);