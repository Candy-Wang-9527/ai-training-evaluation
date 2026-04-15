// 飞书组织架构同步工具
// 用于从飞书获取部门、员工信息并同步到系统

(function() {
    'use strict';

    /**
     * 飞书组织架构同步管理器
     */
    class FeishuOrgSyncManager {
        constructor() {
            this.lark = window.lark || null;
            this.isInitialized = false;
            this.departments = [];
            this.employees = [];
            this.syncInProgress = false;
        }

        /**
         * 初始化飞书组织架构同步
         */
        async initialize() {
            try {
                if (!this.lark) {
                    console.warn('飞书JS SDK未加载');
                    return false;
                }

                // 检查飞书权限
                await this.checkPermissions();

                this.isInitialized = true;
                console.log('飞书组织架构同步管理器已初始化');
                return true;

            } catch (error) {
                console.error('初始化飞书组织架构同步失败:', error);
                return false;
            }
        }

        /**
         * 检查飞书API权限
         */
        async checkPermissions() {
            try {
                // 请求获取部门信息的权限
                if (this.lark.permission) {
                    await this.lark.permission.request({
                        scopes: ['contact:department:readonly', 'contact:user:readonly']
                    });
                }
            } catch (error) {
                console.warn('请求飞书权限失败:', error);
            }
        }

        /**
         * 获取所有部门列表
         */
        async getDepartments() {
            try {
                if (!this.isInitialized) {
                    throw new Error('飞书组织架构同步未初始化');
                }

                console.log('正在获取飞书部门列表...');

                // 使用飞书API获取部门列表
                // 注意：这里需要实际的飞书API调用
                const departments = await this.fetchDepartmentsFromAPI();

                this.departments = departments;
                this.saveToLocalStorage('feishu_departments', departments);

                console.log(`成功获取 ${departments.length} 个部门`);
                return departments;

            } catch (error) {
                console.error('获取部门列表失败:', error);
                return [];
            }
        }

        /**
         * 从飞书API获取部门列表
         */
        async fetchDepartmentsFromAPI() {
            // 如果在飞书环境中，使用真实API
            if (this.lark && this.lark.contact) {
                try {
                    const response = await this.lark.contact.department.list({
                        parent_department_id: '0',
                        user_id_type: 'user_id'
                    });

                    if (response.code === 0 && response.data) {
                        return response.data.items.map(dept => ({
                            id: dept.department_id,
                            name: dept.name,
                            parent_id: dept.parent_department_id,
                            leader_id: dept.leader_user_id,
                            status: dept.status,
                            type: this.getDepartmentType(dept)
                        }));
                    }
                } catch (error) {
                    console.warn('飞书API调用失败，使用模拟数据:', error);
                }
            }

            // 使用模拟数据（开发环境）
            return this.getMockDepartments();
        }

        /**
         * 获取部门类型
         */
        getDepartmentType(dept) {
            if (dept.name.includes('部') || dept.name.includes('中心')) {
                return 'department';
            } else if (dept.name.includes('组') || dept.name.includes('团队')) {
                return 'team';
            }
            return 'other';
        }

        /**
         * 获取所有员工列表
         */
        async getEmployees() {
            try {
                if (!this.isInitialized) {
                    throw new Error('飞书组织架构同步未初始化');
                }

                console.log('正在获取飞书员工列表...');

                // 使用飞书API获取员工列表
                const employees = await this.fetchEmployeesFromAPI();

                this.employees = employees;
                this.saveToLocalStorage('feishu_employees', employees);

                console.log(`成功获取 ${employees.length} 名员工`);
                return employees;

            } catch (error) {
                console.error('获取员工列表失败:', error);
                return [];
            }
        }

        /**
         * 从飞书API获取员工列表
         */
        async fetchEmployeesFromAPI() {
            // 如果在飞书环境中，使用真实API
            if (this.lark && this.lark.contact) {
                try {
                    const response = await this.lark.contact.user.list({
                        department_id_type: 'department_id',
                        user_id_type: 'user_id'
                    });

                    if (response.code === 0 && response.data) {
                        return response.data.items.map(user => ({
                            user_id: user.user_id,
                            name: user.name,
                            en_name: user.en_name,
                            email: user.email,
                            mobile: user.mobile,
                            department_ids: user.department_ids || [],
                            avatar: user.avatar?.avatar_72,
                            status: user.status,
                            employee_type: this.getEmployeeType(user)
                        }));
                    }
                } catch (error) {
                    console.warn('飞书API调用失败，使用模拟数据:', error);
                }
            }

            // 使用模拟数据（开发环境）
            return this.getMockEmployees();
        }

        /**
         * 获取员工类型
         */
        getEmployeeType(user) {
            if (user.employee_type === 1) return 'regular';
            if (user.employee_type === 2) return 'intern';
            if (user.employee_type === 4) return 'contractor';
            return 'unknown';
        }

        /**
         * 同步组织架构到系统
         */
        async syncOrganization() {
            if (this.syncInProgress) {
                console.warn('同步正在进行中');
                return { success: false, message: '同步正在进行中' };
            }

            this.syncInProgress = true;

            try {
                console.log('开始同步飞书组织架构...');

                // 并行获取部门和员工数据
                const [departments, employees] = await Promise.all([
                    this.getDepartments(),
                    this.getEmployees()
                ]);

                // 构建部门映射（部门ID -> 部门名称）
                const deptMap = {};
                departments.forEach(dept => {
                    deptMap[dept.id] = dept.name;
                });

                // 为员工添加部门名称
                const enrichedEmployees = employees.map(emp => ({
                    ...emp,
                    department_name: emp.department_ids.map(deptId => deptMap[deptId]).filter(Boolean).join(', ')
                }));

                // 保存完整的组织架构数据
                const orgData = {
                    sync_time: new Date().toISOString(),
                    departments: departments,
                    employees: enrichedEmployees,
                    department_map: deptMap,
                    total_departments: departments.length,
                    total_employees: enrichedEmployees.length
                };

                this.saveToLocalStorage('feishu_org_data', orgData);

                console.log('飞书组织架构同步完成:', {
                    departments: departments.length,
                    employees: enrichedEmployees.length
                });

                this.syncInProgress = false;

                return {
                    success: true,
                    data: orgData,
                    message: `同步成功：${departments.length}个部门，${enrichedEmployees.length}名员工`
                };

            } catch (error) {
                console.error('同步组织架构失败:', error);
                this.syncInProgress = false;

                return {
                    success: false,
                    error: error.message,
                    message: `同步失败: ${error.message}`
                };
            }
        }

        /**
         * 获取同步的组织架构数据
         */
        getCachedOrganizationData() {
            try {
                const data = localStorage.getItem('feishu_org_data');
                if (data) {
                    return JSON.parse(data);
                }
            } catch (error) {
                console.error('读取组织架构缓存失败:', error);
            }
            return null;
        }

        /**
         * 根据部门ID获取部门名称
         */
        getDepartmentName(departmentId) {
            const orgData = this.getCachedOrganizationData();
            if (orgData && orgData.department_map) {
                return orgData.department_map[departmentId] || '未知部门';
            }
            return '未知部门';
        }

        /**
         * 根据用户ID获取用户信息
         */
        getUserInfo(userId) {
            const orgData = this.getCachedOrganizationData();
            if (orgData && orgData.employees) {
                return orgData.employees.find(emp => emp.user_id === userId);
            }
            return null;
        }

        /**
         * 根据姓名搜索用户
         */
        searchUsersByName(name) {
            const orgData = this.getCachedOrganizationData();
            if (orgData && orgData.employees) {
                return orgData.employees.filter(emp =>
                    emp.name.includes(name) || (emp.en_name && emp.en_name.toLowerCase().includes(name.toLowerCase()))
                );
            }
            return [];
        }

        /**
         * 根据部门获取员工列表
         */
        getEmployeesByDepartment(departmentId) {
            const orgData = this.getCachedOrganizationData();
            if (orgData && orgData.employees) {
                return orgData.employees.filter(emp =>
                    emp.department_ids && emp.department_ids.includes(departmentId)
                );
            }
            return [];
        }

        /**
         * 保存到本地存储
         */
        saveToLocalStorage(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (error) {
                console.error('保存到本地存储失败:', error);
            }
        }

        /**
         * 从本地存储读取
         */
        loadFromLocalStorage(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error('从本地存储读取失败:', error);
                return null;
            }
        }

        /**
         * 获取模拟部门数据
         */
        getMockDepartments() {
            return [
                { id: 'dept_001', name: '人力部', parent_id: '0', leader_id: 'user_001', status: 'active', type: 'department' },
                { id: 'dept_002', name: '技术部', parent_id: '0', leader_id: 'user_002', status: 'active', type: 'department' },
                { id: 'dept_003', name: '产品部', parent_id: '0', leader_id: 'user_003', status: 'active', type: 'department' },
                { id: 'dept_004', name: '销售部', parent_id: '0', leader_id: 'user_004', status: 'active', type: 'department' },
                { id: 'dept_005', name: '实施部', parent_id: '0', leader_id: 'user_005', status: 'active', type: 'department' },
                { id: 'dept_006', name: '研发组', parent_id: 'dept_002', leader_id: 'user_006', status: 'active', type: 'team' },
                { id: 'dept_007', name: '测试组', parent_id: 'dept_002', leader_id: 'user_007', status: 'active', type: 'team' }
            ];
        }

        /**
         * 获取模拟员工数据
         */
        getMockEmployees() {
            return [
                { user_id: 'user_001', name: '王浩', en_name: 'Wang Hao', email: 'wanghao@example.com', mobile: '13800138001', department_ids: ['dept_002'], status: 'active', employee_type: 'regular' },
                { user_id: 'user_002', name: '张三', en_name: 'Zhang San', email: 'zhangsan@example.com', mobile: '13800138002', department_ids: ['dept_006'], status: 'active', employee_type: 'regular' },
                { user_id: 'user_003', name: '李四', en_name: 'Li Si', email: 'lisi@example.com', mobile: '13800138003', department_ids: ['dept_003'], status: 'active', employee_type: 'regular' },
                { user_id: 'user_004', name: '王五', en_name: 'Wang Wu', email: 'wangwu@example.com', mobile: '13800138004', department_ids: ['dept_004'], status: 'active', employee_type: 'regular' },
                { user_id: 'user_005', name: '赵六', en_name: 'Zhao Liu', email: 'zhaoliu@example.com', mobile: '13800138005', department_ids: ['dept_005'], status: 'active', employee_type: 'regular' },
                { user_id: 'user_006', name: '孙七', en_name: 'Sun Qi', email: 'sunqi@example.com', mobile: '13800138006', department_ids: ['dept_001'], status: 'active', employee_type: 'regular' },
                { user_id: 'user_007', name: '周八', en_name: 'Zhou Ba', email: 'zhouba@example.com', mobile: '13800138007', department_ids: ['dept_006'], status: 'active', employee_type: 'regular' },
                { user_id: 'user_008', name: '吴九', en_name: 'Wu Jiu', email: 'wujiu@example.com', mobile: '13800138008', department_ids: ['dept_007'], status: 'active', employee_type: 'regular' }
            ];
        }

        /**
         * 清除同步的数据
         */
        clearSyncData() {
            localStorage.removeItem('feishu_org_data');
            localStorage.removeItem('feishu_departments');
            localStorage.removeItem('feishu_employees');
            this.departments = [];
            this.employees = [];
            console.log('已清除飞书组织架构同步数据');
        }

        /**
         * 获取同步状态
         */
        getSyncStatus() {
            const orgData = this.getCachedOrganizationData();
            if (!orgData) {
                return { synced: false, message: '未同步' };
            }

            const syncTime = new Date(orgData.sync_time);
            const now = new Date();
            const hoursDiff = (now - syncTime) / (1000 * 60 * 60);

            return {
                synced: true,
                syncTime: orgData.sync_time,
                hoursAgo: Math.floor(hoursDiff),
                departments: orgData.total_departments,
                employees: orgData.total_employees,
                message: `已同步于 ${syncTime.toLocaleString('zh-CN')} (${Math.floor(hoursDiff)}小时前)`
            };
        }
    }

    // 导出到全局
    const feishuOrgSyncManager = new FeishuOrgSyncManager();
    window.FeishuOrgSync = feishuOrgSyncManager;

    // 页面加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            feishuOrgSyncManager.initialize().catch(error => {
                console.warn('飞书组织架构同步初始化失败:', error);
            });
        });
    } else {
        feishuOrgSyncManager.initialize().catch(error => {
            console.warn('飞书组织架构同步初始化失败:', error);
        });
    }

    console.log('飞书组织架构同步工具已加载');

})();
