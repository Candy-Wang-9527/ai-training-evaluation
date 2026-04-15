// 飞书Base集成配置文件
// 用于连接：https://st3m3xa39z.feishu.cn/base/GA1QbgqTzaHaVIsIKWDcFI79nuc

const FEISHU_BASE_CONFIG = {
    // Base应用信息
    app_token: "MiG6bsjMiaEwAEskaSScC7W8nGb",
    base_url: "https://st3m3xa39z.feishu.cn/base/MiG6bsjMiaEwAEskaSScC7W8nGb",

    // 表格ID（根据您的Base结构）
    tables: {
        employees: "tbl0fkpRKGAaCaPy",           // 员工表
        trainings: "tblShvLC5LCYzzfV",          // 培训表
        training_scores: "tblxLgRDWMSz8xZo",    // 培训评分表
        application_scores: "tblNOBTibciFt8EC", // 应用评分表
        score_configs: "tblJuSwhGEr94Pbu"       // 评分配置表
    },
    
    // 字段映射配置（根据Base表格的实际字段）
    field_mappings: {
        employees: {
            name: "fldjZ5ZkUQ",       // 姓名字段ID
            department: "fldGjZ9uQq",  // 部门字段ID
            status: "fldg7f7Ffq",      // 状态字段ID
            join_date: "fldV2qV3tZ",   // 入职日期字段ID
            employee_id: "fldX2qV3tA"  // 员工编号字段ID
        },
        training_scores: {
            employee_name: "fldY2qV3tB",    // 员工姓名字段ID
            evaluation_date: "fldZ2qV3tC",  // 评估日期字段ID
            score1: "flda2qV3tD",          // 培训维度1评分
            score2: "fldb2qV3tE",          // 培训维度2评分
            score3: "fldc2qV3tF",          // 培训维度3评分
            score4: "fldd2qV3tG",          // 培训维度4评分
            score5: "flde2qV3tH",          // 培训维度5评分
            total_score: "fldf2qV3tI",     // 总分
            evaluator: "fldg2qV3tJ"        // 评估人
        },
        application_scores: {
            employee_name: "fldh2qV3tK",    // 员工姓名字段ID
            evaluation_date: "fldi2qV3tL",  // 评估日期字段ID
            score6: "fldj2qV3tM",          // 应用维度1评分
            score7: "fldk2qV3tN",          // 应用维度2评分
            total_score: "fldl2qV3tO",     // 总分
            comments: "fldm2qV3tP",        // 备注
            evaluator: "fldn2qV3tQ"        // 评估人
        },
        score_configs: {
            category: "fldo2qV3tR",        // 分类（培训/应用）
            dimension: "fldp2qV3tS",       // 维度名称
            weight: "fldq2qV3tT",          // 权重
            description: "fldr2qV3tU"      // 描述
        }
    }
};

// 飞书Base数据操作工具类
class FeishuBaseClient {
    constructor() {
        this.config = FEISHU_BASE_CONFIG;
        this.lark = window.lark || null;
        this.isInitialized = false;
    }
    
    // 初始化飞书JS SDK
    async initialize() {
        if (!this.lark) {
            console.warn('飞书JS SDK未加载，尝试加载...');
            await this.loadFeishuSDK();
        }
        
        // 验证飞书环境
        if (typeof this.lark !== 'undefined' && this.lark) {
            this.isInitialized = true;
            console.log('飞书Base客户端已初始化');
        } else {
            console.warn('未在飞书环境中运行，将使用本地模式');
        }
        
        return this.isInitialized;
    }
    
    // 动态加载飞书SDK
    async loadFeishuSDK() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://lf1-cdn-tos.bytegoofy.com/obj/eden-cn/ljhwzqkjuhp/lark/js-sdk/lark-jsapi.min.js';
            script.onload = () => {
                this.lark = window.lark;
                resolve(true);
            };
            script.onerror = () => {
                console.error('飞书JS SDK加载失败');
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }
    
    // 获取表格数据
    async getRecords(tableName, query = '') {
        try {
            const tableId = this.config.tables[tableName];
            if (!tableId) {
                throw new Error(`未找到表配置: ${tableName}`);
            }
            
            if (this.isInitialized && this.lark) {
                // 飞书环境：使用JS SDK
                const response = await this.lark.bitable.batchGetRecord({
                    app_token: this.config.app_token,
                    table_id: tableId,
                    record_ids: [] // 空数组获取所有记录
                });
                
                return this.formatRecords(response.data.records, tableName);
            } else {
                // 非飞书环境：使用模拟数据或提示
                console.log(`非飞书环境，无法获取${tableName}实时数据`);
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

            console.log(`📝 尝试保存数据到表 ${tableName}，table_id: ${tableId}`);
            console.log('数据内容:', data);

            if (this.isInitialized && this.lark) {
                // 飞书环境：使用JS SDK
                console.log('🔍 检测到飞书环境，尝试调用飞书API...');

                // 尝试不同的API调用方式
                try {
                    // 方式1: 使用bitable.appTableRecord.create
                    if (this.lark.bitable && this.lark.bitable.appTableRecord) {
                        console.log('尝试方式1: bitable.appTableRecord.create');
                        const response = await this.lark.bitable.appTableRecord.create({
                            app_token: this.config.app_token,
                            table_id: tableId,
                            fields: data
                        });

                        console.log('飞书API响应:', response);

                        if (response.code === 0) {
                            console.log('✅ 数据保存成功');
                            return {
                                success: true,
                                data: response.data,
                                message: '数据已保存到飞书Base'
                            };
                        } else {
                            throw new Error(`飞书API错误: ${response.msg}`);
                        }
                    }

                    // 方式2: 使用bitable.record.createRecord
                    else if (this.lark.bitable && this.lark.bitable.record) {
                        console.log('尝试方式2: bitable.record.createRecord');
                        const response = await this.lark.bitable.record.createRecord({
                            app_token: this.config.app_token,
                            table_id: tableId,
                            fields: data
                        });

                        console.log('飞书API响应:', response);

                        if (response.code === 0) {
                            console.log('✅ 数据保存成功');
                            return {
                                success: true,
                                data: response.data,
                                message: '数据已保存到飞书Base'
                            };
                        } else {
                            throw new Error(`飞书API错误: ${response.msg}`);
                        }
                    }

                    // 方式3: 使用原始HTTP请求
                    else {
                        console.warn('⚠️ 飞书JS SDK的bitable API不可用，尝试直接API调用');
                        throw new Error('飞书JS SDK的bitable API不可用，请检查权限配置');
                    }

                } catch (apiError) {
                    console.error('❌ 飞书API调用失败:', apiError);
                    console.warn('📝 降级到本地存储模式');

                    // 降级到本地存储
                    const localStorageKey = `feishu_mock_${tableName}`;
                    let mockData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
                    mockData.push({
                        id: Date.now(),
                        fields: data,
                        created_time: new Date().toISOString()
                    });
                    localStorage.setItem(localStorageKey, JSON.stringify(mockData));

                    return {
                        success: true,
                        message: '数据已保存到本地（飞书API不可用）'
                    };
                }
            } else {
                // 非飞书环境：存储到本地
                console.log('📝 非飞书环境，使用本地存储');
                const localStorageKey = `feishu_mock_${tableName}`;
                let mockData = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
                mockData.push({
                    id: Date.now(),
                    fields: data,
                    created_time: new Date().toISOString()
                });
                localStorage.setItem(localStorageKey, JSON.stringify(mockData));
                
                return {
                    success: true,
                    data: { record_ids: [Date.now()] },
                    message: '数据已保存到本地（非飞书环境）'
                };
            }
        } catch (error) {
            console.error(`保存${tableName}数据失败:`, error);
            return {
                success: false,
                message: `保存失败: ${error.message}`
            };
        }
    }
    
    // 格式化记录为简单对象
    formatRecords(records, tableName) {
        const fieldMap = this.config.field_mappings[tableName] || {};
        
        return records.map(record => {
            const formatted = { id: record.record_id };
            
            // 反转映射：字段ID -> 字段名
            const reverseMap = {};
            for (const [fieldName, fieldId] of Object.entries(fieldMap)) {
                reverseMap[fieldId] = fieldName;
            }
            
            // 将字段值映射到友好名称
            for (const [fieldId, value] of Object.entries(record.fields)) {
                const fieldName = reverseMap[fieldId] || fieldId;
                formatted[fieldName] = value;
            }
            
            return formatted;
        });
    }
    
    // 模拟数据（用于开发和测试）
    getMockData(tableName) {
        const mockData = {
            employees: [
                { id: 'mock_1', name: '张三', department: '研发部', status: '在职' },
                { id: 'mock_2', name: '李四', department: '产品部', status: '在职' },
                { id: 'mock_3', name: '王五', department: '销售部', status: '在职' },
                { id: 'mock_4', name: '赵六', department: '实施部', status: '在职' }
            ],
            score_configs: [
                { id: 'config_1', category: '培训', dimension: '技术理解', weight: 0.2 },
                { id: 'config_2', category: '培训', dimension: '应用能力', weight: 0.2 },
                { id: 'config_3', category: '培训', dimension: '创新思维', weight: 0.2 },
                { id: 'config_4', category: '培训', dimension: '团队协作', weight: 0.2 },
                { id: 'config_5', category: '培训', dimension: '学习态度', weight: 0.2 },
                { id: 'config_6', category: '应用', dimension: '业务应用', weight: 0.5 },
                { id: 'config_7', category: '应用', dimension: '效率提升', weight: 0.5 }
            ],
            training_scores: [],
            application_scores: []
        };
        
        return mockData[tableName] || [];
    }
    
    // 获取评分配置（用于计算权重）
    async getScoreConfigs() {
        const configs = await this.getRecords('score_configs');
        
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
}

// 创建全局实例
const feishuBaseClient = new FeishuBaseClient();

// 初始化函数（在页面加载后调用）
async function initializeFeishuBase() {
    await feishuBaseClient.initialize();
    return feishuBaseClient.isInitialized;
}

// 导出常用函数
async function loadEmployees() {
    return await feishuBaseClient.getRecords('employees');
}

async function saveTrainingScore(scoreData) {
    return await feishuBaseClient.createRecord('training_scores', scoreData);
}

async function saveApplicationScore(scoreData) {
    return await feishuBaseClient.createRecord('application_scores', scoreData);
}

async function getScoreConfiguration() {
    return await feishuBaseClient.getScoreConfigs();
}

// 导出到全局
window.FeishuBase = {
    initialize: initializeFeishuBase,
    loadEmployees,
    saveTrainingScore,
    saveApplicationScore,
    getScoreConfiguration,
    client: feishuBaseClient
};

console.log('飞书Base集成配置已加载');