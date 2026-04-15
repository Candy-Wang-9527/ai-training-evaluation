# AI培训评估系统 - 文档目录结构设计

**设计日期：** 2026年4月15日  
**设计目标：** 规范化项目文档管理，提高可维护性  

---

## 📁 Docs目录结构

```
docs/
├── README.md                           # 文档导航主文件
├── guides/                             # 用户指南和操作指南
│   ├── README.md                       # 指南导航
│   ├── feishu-base-setup.md           # 飞书Base配置指南
│   ├── feishu-permission-setup.md     # 飞书权限配置指南
│   ├── multi-role-org-sync.md         # 多角色和组织架构同步指南
│   ├── slider-fix.md                  # 滑块修复指南
│   └── uat-testing.md                 # UAT测试指南
├── technical/                          # 技术文档
│   ├── README.md                       # 技术文档导航
│   ├── base-table-schema.md           # Base表格结构定义
│   ├── feishu-base-deployment.md      # 飞书Base部署技术文档
│   ├── system-architecture.md         # 系统架构设计（待创建）
│   ├── api-reference.md               # API接口文档（待创建）
│   └── database-schema.md             # 数据库结构（待创建）
├── reports/                            # 项目报告和总结
│   ├── README.md                       # 报告导航
│   ├── config-slider-fix.md           # Config页面滑块修复报告
│   ├── system-improvements.md         # 系统改进总结
│   ├── feature-updates.md             # 功能更新总结
│   ├── page-sync-update.md            # 页面同步更新完成报告
│   └── business-process-analysis.md   # 业务流程分析报告
├── maintenance/                        # 维护和更新日志
│   ├── README.md                       # 维护文档导航
│   ├── base-config-update-log.md      # Base配置更新日志
│   └── changelog.md                   # 变更日志（待创建）
└── archives/                           # 归档文件
    ├── README.md                       # 归档说明
    └── old-files/                      # 旧版本文件归档
        ├── 待删除文件清单.md            # 旧版清理指南
        └── legacy-guides/              # 过时的指南文档
```

---

## 📋 文件分类和移动计划

### 🎯 核心文档（保留在根目录）
```
├── README.md                          # 项目主文档
├── base_ids_config.json               # Base配置文件
└── deploy.sh                          # 部署脚本
```

### 📚 用户指南（guides/）
```
guides/
├── feishu-base-setup.md              ← FEISHU_BASE_CONFIG_GUIDE.md
├── feishu-permission-setup.md        ← FEISHU_PERMISSION_SETUP_GUIDE.md
├── multi-role-org-sync.md            ← MULTI_ROLE_ORG_SYNC_GUIDE.md
├── slider-fix.md                     ← SLIDER_FIX_GUIDE.md
└── uat-testing.md                    ← UAT_TEST_GUIDE.md
```

### 🔧 技术文档（technical/）
```
technical/
├── base-table-schema.md              ← FEISHU_BASE_TABLE_SCHEMA.md
└── feishu-base-deployment.md         ← 飞书Base部署指南.md
```

### 📊 项目报告（reports/）
```
reports/
├── config-slider-fix.md              ← Config页面滑块修复报告.md
├── system-improvements.md            ← 系统改进总结.md
├── feature-updates.md                ← 功能更新总结.md
├── page-sync-update.md               ← 页面同步更新完成报告.md
└── business-process-analysis.md      ← 业务流程分析报告.md
```

### 🔄 维护日志（maintenance/）
```
maintenance/
└── base-config-update-log.md         ← BASE_CONFIG_UPDATE_LOG.md
```

### 📦 归档文件（archives/）
```
archives/
├── 待删除文件清单.md                  ← 移动旧清单
└── ai-training-multi-dimensional.md  ← AI培训评估多维表格.md（已归档）
```

---

## 🗑️ 可以删除的文件

### 临时文件
- `test_utils.html` - 移到根目录外的test目录或删除

### 重复文件
- 如果有功能相同的新旧版本，保留最新版本

### 过时文件
- 已被新文档替代的旧版本文档

---

## 📝 迁移步骤

### 第一步：创建目录结构
```bash
mkdir -p docs/{guides,technical,reports,maintenance,archives/old-files}
```

### 第二步：创建README文件
为每个子目录创建导航README

### 第三步：移动文件
按照上述分类移动相关文件

### 第四步：更新链接
更新所有文档中的相互引用链接

### 第五步：清理文件
删除临时和过时文件

---

## 🎯 迁移后的项目结构

```
ai_training_evaluation/
├── README.md                          # 项目主文档
├── base_ids_config.json               # Base配置
├── deploy.sh                          # 部署脚本
├── index.html                         # 主页面
├── config.html                        # 配置页面
├── role-config.html                   # 角色配置页面
├── training-input.html                # 培训录入页面
├── statistics.html                    # 统计页面
├── feishu-config.html                 # 飞书配置页面
├── docs/                              # 📁 文档目录
│   ├── README.md                      # 文档导航
│   ├── guides/                        # 用户指南
│   ├── technical/                     # 技术文档
│   ├── reports/                       # 项目报告
│   ├── maintenance/                   # 维护日志
│   └── archives/                      # 归档文件
├── js/                                # JavaScript文件
├── css/                               # 样式文件
├── assets/                            # 资源文件
└── .claude/                           # Claude配置
```

---

## 🔗 文档引用更新

### 更新规则
1. **相对路径：** 使用相对于docs目录的路径
2. **绝对路径：** 对于GitHub页面，使用绝对URL
3. **交叉引用：** 使用Markdown标准的链接格式

### 链接示例
```markdown
# 旧链接
[查看配置指南](FEISHU_BASE_CONFIG_GUIDE.md)

# 新链接
[查看配置指南](docs/guides/feishu-base-setup.md)
```

---

## 📊 文档分类标准

### 📚 guides/ - 用户指南
- **目标读者：** 最终用户、系统管理员
- **内容类型：** 操作步骤、配置说明、使用指南
- **更新频率：** 随功能更新而更新

### 🔧 technical/ - 技术文档
- **目标读者：** 开发人员、技术维护人员
- **内容类型：** 架构设计、API文档、数据结构
- **更新频率：** 随技术架构变化而更新

### 📊 reports/ - 项目报告
- **目标读者：** 项目管理者、利益相关者
- **内容类型：** 进度报告、总结报告、分析报告
- **更新频率：** 项目里程碑时创建

### 🔄 maintenance/ - 维护日志
- **目标读者：** 维护人员、开发者
- **内容类型：** 更新日志、配置变更、问题修复
- **更新频率：** 每次更新时记录

### 📦 archives/ - 归档文件
- **目标读者：** 需要历史信息的任何人
- **内容类型：** 旧版本文档、过时指南
- **更新频率：** 仅添加，不修改

---

## 🎯 预期效果

### 整理前
- 根目录下有15+个文档文件
- 文档分类不清晰
- 难以找到特定信息

### 整理后
- 根目录只保留核心文件
- 文档按类型和用途清晰分类
- 易于导航和维护
- 专业化项目管理结构

---

## 📞 维护建议

1. **定期清理：** 每月检查一次是否有新的临时文件
2. **文档更新：** 功能变更时同步更新相关文档
3. **索引维护：** 保持各README文件的索引是最新的
4. **版本控制：** 所有文档变更都纳入Git版本控制

---

*文档结构设计完成日期：2026年4月15日*  
*设计者：AI助手 + 王浩*  
*版本：v1.0*