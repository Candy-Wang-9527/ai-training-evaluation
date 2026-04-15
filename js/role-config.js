/**
 * AI培训评估系统 - 角色配置管理
 * 支持手动配置用户角色，不依赖飞书组织架构
 */

// 角色定义
const SYSTEM_ROLES = {
    HR: 'hr',                       // 人力部门 - 负责录入培训基础信息
    JUDGE: 'judge',                 // 评审员 - 负责对员工进行评分
    INSTRUCTOR: 'instructor',       // 讲师 - 负责培训实施
    GM: 'gm',                       // 总经理 - 负责最终审批
    ADMIN: 'admin'                  // 管理员 - 系统管理
};

// 角色显示名称
const ROLE_DISPLAY_NAMES = {
    'hr': '人力部门',
    'judge': '评审员',
    'instructor': '讲师',
    'gm': '总经理',
    'admin': '管理员'
};

// 角色权限配置
const ROLE_PERMISSIONS = {
    'hr': {
        name: '人力部门',
        description: '负责录入培训基础信息',
        permissions: [
            'create_training',           // 创建培训记录
            'edit_training',             // 编辑培训信息
            'submit_to_review',          // 提交到评审
            'view_statistics',           // 查看统计
            'manage_participants'        // 管理参与人员
        ],
        icon: 'fas fa-users-cog',
        color: 'bg-info'
    },
    'judge': {
        name: '评审员',
        description: '负责对员工进行AI培训应用评分',
        permissions: [
            'view_assigned_evaluations', // 查看分配的评估任务
            'score_evaluation',          // 进行评分
            'submit_review',             // 提交评审结果
            'view_statistics',           // 查看统计
            'add_comments'               // 添加评语
        ],
        icon: 'fas fa-user-tie',
        color: 'bg-warning'
    },
    'instructor': {
        name: '讲师',
        description: '负责培训实施和培训效果评估',
        permissions: [
            'view_own_trainings',        // 查看自己的培训
            'manage_training_content',   // 管理培训内容
            'view_training_statistics',  // 查看培训统计
            'upload_materials'           // 上传培训材料
        ],
        icon: 'fas fa-chalkboard-teacher',
        color: 'bg-success'
    },
    'gm': {
        name: '总经理',
        description: '负责最终审批和决策',
        permissions: [
            'view_all_evaluations',      // 查看所有评估
            'approve_evaluation',        // 批准评估
            'adjust_scores',             // 调整评分
            'final_approval',            // 最终批准
            'view_all_statistics',       // 查看所有统计
            'configure_system'           // 系统配置
        ],
        icon: 'fas fa-user-shield',
        color: 'bg-danger'
    },
    'admin': {
        name: '管理员',
        description: '系统管理和维护',
        permissions: [
            'configure_roles',           // 配置角色
            'configure_system',          // 配置系统
            'manage_users',              // 管理用户
            'view_all_data',             // 查看所有数据
            'export_data'                // 导出数据
        ],
        icon: 'fas fa-cog',
        color: 'bg-dark'
    }
};

/**
 * 角色配置管理器
 */
class RoleConfigManager {
    constructor() {
        this.userRoleMappings = this.loadUserRoleMappings();
        this.currentUser = null;
        this.currentRole = null;
    }

    /**
     * 加载用户角色映射配置
     */
    loadUserRoleMappings() {
        const stored = localStorage.getItem('user_role_mappings');
        if (stored) {
            return JSON.parse(stored);
        }

        // 默认角色映射配置
        const defaultMappings = {
            // 通过飞书用户ID映射
            'by_user_id': {
                // 'ou_xxxxxxxxx': 'hr',
                // 'ou_yyyyyyyyy': 'judge',
                // 'ou_zzzzzzzzz': 'gm'
            },

            // 通过姓名映射
            'by_name': {
                '王浩': 'judge',
                // 可以添加更多用户
                // '张三': 'hr',
                // '李四': 'instructor',
                // '总经理': 'gm'
            },

            // 通过部门映射（作为备选）
            'by_department': {
                '人力部': 'hr',
                '人力资源部': 'hr',
                '技术部': 'judge',
                '培训部': 'instructor'
            }
        };

        return defaultMappings;
    }

    /**
     * 保存用户角色映射配置
     */
    saveUserRoleMappings() {
        localStorage.setItem('user_role_mappings', JSON.stringify(this.userRoleMappings));
    }

    /**
     * 添加用户角色映射
     */
    addUserRoleMapping(identifier, role, mappingType = 'by_name') {
        if (!Object.values(SYSTEM_ROLES).includes(role)) {
            throw new Error(`无效的角色: ${role}`);
        }

        this.userRoleMappings[mappingType][identifier] = role;
        this.saveUserRoleMappings();

        return {
            success: true,
            message: `已将 ${identifier} 设置为 ${ROLE_DISPLAY_NAMES[role]}`
        };
    }

    /**
     * 移除用户角色映射
     */
    removeUserRoleMapping(identifier, mappingType = 'by_name') {
        delete this.userRoleMappings[mappingType][identifier];
        this.saveUserRoleMappings();

        return {
            success: true,
            message: `已移除 ${identifier} 的角色配置`
        };
    }

    /**
     * 获取用户角色
     */
    getUserRole(userInfo) {
        if (!userInfo) {
            return SYSTEM_ROLES.JUDGE; // 默认为评审员角色
        }

        // 1. 优先通过用户ID查找
        if (userInfo.user_id && this.userRoleMappings.by_user_id[userInfo.user_id]) {
            return this.userRoleMappings.by_user_id[userInfo.user_id];
        }

        // 2. 通过姓名查找
        if (userInfo.name && this.userRoleMappings.by_name[userInfo.name]) {
            return this.userRoleMappings.by_name[userInfo.name];
        }

        // 3. 通过部门查找（作为备选）
        if (userInfo.department && this.userRoleMappings.by_department[userInfo.department]) {
            return this.userRoleMappings.by_department[userInfo.department];
        }

        // 4. 默认返回评审员角色
        return SYSTEM_ROLES.JUDGE;
    }

    /**
     * 检查用户是否有特定权限
     */
    hasPermission(userRole, permission) {
        const roleConfig = ROLE_PERMISSIONS[userRole];
        if (!roleConfig) {
            return false;
        }

        return roleConfig.permissions.includes(permission);
    }

    /**
     * 获取角色配置
     */
    getRoleConfig(role) {
        return ROLE_PERMISSIONS[role] || null;
    }

    /**
     * 获取所有角色配置
     */
    getAllRoleConfigs() {
        return ROLE_PERMISSIONS;
    }

    /**
     * 获取所有用户角色映射
     */
    getAllUserRoleMappings() {
        return this.userRoleMappings;
    }

    /**
     * 导出角色配置
     */
    exportRoleConfig() {
        return {
            version: '1.0',
            export_date: new Date().toISOString(),
            user_role_mappings: this.userRoleMappings,
            role_definitions: ROLE_PERMISSIONS
        };
    }

    /**
     * 导入角色配置
     */
    importRoleConfig(configData) {
        try {
            if (!configData.user_role_mappings) {
                throw new Error('无效的配置数据格式');
            }

            this.userRoleMappings = configData.user_role_mappings;
            this.saveUserRoleMappings();

            return {
                success: true,
                message: '角色配置导入成功'
            };
        } catch (error) {
            return {
                success: false,
                message: `导入失败: ${error.message}`
            };
        }
    }

    /**
     * 初始化当前用户角色
     */
    async initializeCurrentUser() {
        try {
            // 如果在飞书环境中，获取用户信息
            if (typeof lark !== 'undefined' && lark.ready) {
                await lark.ready({});
                const response = await lark.user.getUserInfo({});

                if (response.code === 0) {
                    this.currentUser = {
                        user_id: response.data.user_id,
                        name: response.data.name,
                        avatar_url: response.data.avatar_url,
                        department: await this.getUserDepartment(response.data.user_id)
                    };
                }
            }

            // 如果没有飞书环境，使用模拟用户
            if (!this.currentUser) {
                this.currentUser = this.getMockUser();
            }

            // 根据配置确定角色
            this.currentRole = this.getUserRole(this.currentUser);

            console.log('当前用户:', this.currentUser);
            console.log('当前角色:', this.currentRole, ROLE_DISPLAY_NAMES[this.currentRole]);

            return {
                success: true,
                user: this.currentUser,
                role: this.currentRole,
                role_name: ROLE_DISPLAY_NAMES[this.currentRole]
            };

        } catch (error) {
            console.error('初始化用户角色失败:', error);

            // 使用默认模拟用户
            this.currentUser = this.getMockUser();
            this.currentRole = SYSTEM_ROLES.JUDGE;

            return {
                success: false,
                user: this.currentUser,
                role: this.currentRole,
                error: error.message
            };
        }
    }

    /**
     * 获取用户部门（模拟）
     */
    async getUserDepartment(userId) {
        // 这里应该调用飞书API获取用户部门信息
        // 目前返回模拟数据
        return '技术部';
    }

    /**
     * 获取模拟用户（用于测试）
     */
    getMockUser() {
        return {
            user_id: 'mock_user_id',
            name: '测试用户',
            department: '技术部',
            avatar_url: ''
        };
    }

    /**
     * 设置测试角色（用于开发测试）
     */
    setTestRole(role) {
        if (!Object.values(SYSTEM_ROLES).includes(role)) {
            throw new Error(`无效的角色: ${role}`);
        }

        localStorage.setItem('test_user_role', role);
        this.currentRole = role;

        console.log('测试角色已设置为:', role, ROLE_DISPLAY_NAMES[role]);

        return {
            success: true,
            role: role,
            role_name: ROLE_DISPLAY_NAMES[role]
        };
    }

    /**
     * 清除测试角色
     */
    clearTestRole() {
        localStorage.removeItem('test_user_role');
        return {
            success: true,
            message: '测试角色已清除'
        };
    }
}

// 创建全局角色管理器实例
const roleConfigManager = new RoleConfigManager();

// 导出到全局
window.RoleConfig = {
    SYSTEM_ROLES,
    ROLE_DISPLAY_NAMES,
    ROLE_PERMISSIONS,

    // 实例方法
    initialize: async () => await roleConfigManager.initializeCurrentUser(),
    getUserRole: (userInfo) => roleConfigManager.getUserRole(userInfo),
    hasPermission: (role, permission) => roleConfigManager.hasPermission(role, permission),
    getRoleConfig: (role) => roleConfigManager.getRoleConfig(role),
    getAllRoleConfigs: () => roleConfigManager.getAllRoleConfigs(),
    getAllUserRoleMappings: () => roleConfigManager.getAllUserRoleMappings(),

    // 角色映射管理
    addUserRoleMapping: (identifier, role, type) => roleConfigManager.addUserRoleMapping(identifier, role, type),
    removeUserRoleMapping: (identifier, type) => roleConfigManager.removeUserRoleMapping(identifier, type),

    // 配置导入导出
    exportRoleConfig: () => roleConfigManager.exportRoleConfig(),
    importRoleConfig: (data) => roleConfigManager.importRoleConfig(data),

    // 测试相关
    setTestRole: (role) => roleConfigManager.setTestRole(role),
    clearTestRole: () => roleConfigManager.clearTestRole(),

    // 当前状态
    manager: roleConfigManager,
    getCurrentUser: () => roleConfigManager.currentUser,
    getCurrentRole: () => roleConfigManager.currentRole
};

console.log('角色配置管理模块已加载');
console.log('支持的角色:', Object.keys(SYSTEM_ROLES));
console.log('当前角色映射配置:', roleConfigManager.getAllUserRoleMappings());