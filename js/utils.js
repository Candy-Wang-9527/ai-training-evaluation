/**
 * AI培训评估系统 - 公共工具函数库
 * 提供统一的工具函数，避免代码重复，提高安全性
 */

// 创建命名空间，避免全局污染
const AITrainingUtils = (function() {
    'use strict';

    // ==================== XSS防护函数 ====================

    /**
     * 转义HTML特殊字符，防止XSS攻击
     * @param {string} str - 需要转义的字符串
     * @returns {string} 转义后的安全字符串
     */
    function escapeHtml(str) {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * 安全地设置元素的HTML内容
     * @param {HTMLElement} element - 目标元素
     * @param {string} content - 要设置的内容
     * @param {boolean} isHTML - 内容是否包含HTML标签
     */
    function safeSetContent(element, content, isHTML = false) {
        if (!element) return;

        if (isHTML) {
            // 如果包含HTML，只允许安全的标签
            const safeHTML = sanitizeHTML(content);
            element.innerHTML = safeHTML;
        } else {
            // 纯文本内容，使用textContent更安全
            element.textContent = content;
        }
    }

    /**
     * 净化HTML，只允许安全的标签和属性
     * @param {string} html - 需要净化的HTML
     * @returns {string} 净化后的HTML
     */
    function sanitizeHTML(html) {
        if (!html || typeof html !== 'string') return '';

        // 移除危险的标签和属性
        const dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
            /<embed\b[^>]*>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi, // 事件处理器
            /<\s*\/?\s*(script|iframe|object|embed|form|input|button)[^>]*>/gi
        ];

        let sanitized = html;
        dangerousPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });

        return sanitized;
    }

    // ==================== 输入验证函数 ====================

    /**
     * 验证评分是否在有效范围内
     * @param {number} score - 需要验证的分数
     * @param {number} min - 最小值（默认0）
     * @param {number} max - 最大值（默认100）
     * @returns {boolean} 是否有效
     */
    function isValidScore(score, min = 0, max = 100) {
        const numScore = parseFloat(score);
        return !isNaN(numScore) && numScore >= min && numScore <= max;
    }

    /**
     * 验证日期格式
     * @param {string} dateString - 日期字符串
     * @returns {boolean} 是否有效
     */
    function isValidDate(dateString) {
        if (!dateString || typeof dateString !== 'string') return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * 验证员工姓名
     * @param {string} name - 员工姓名
     * @returns {boolean} 是否有效
     */
    function isValidEmployeeName(name) {
        if (!name || typeof name !== 'string') return false;

        // 去除首尾空格
        const trimmedName = name.trim();

        // 长度限制：1-50个字符
        if (trimmedName.length < 1 || trimmedName.length > 50) return false;

        // 不允许特殊字符（只允许中文、英文、空格）
        const namePattern = /^[\u4e00-\u9fa5a-zA-Z\s]+$/;
        return namePattern.test(trimmedName);
    }

    /**
     * 验证权重值
     * @param {number} weight - 权重值
     * @returns {boolean} 是否有效
     */
    function isValidWeight(weight) {
        const numWeight = parseFloat(weight);
        return !isNaN(numWeight) && numWeight >= 0 && numWeight <= 1;
    }

    /**
     * 验证权重总和是否为1
     * @param {Array<number>} weights - 权重数组
     * @param {number} tolerance - 容差范围（默认0.01）
     * @returns {boolean} 是否有效
     */
    function isValidWeightSum(weights, tolerance = 0.01) {
        if (!Array.isArray(weights)) return false;

        const sum = weights.reduce((acc, weight) => acc + (parseFloat(weight) || 0), 0);
        return Math.abs(sum - 1) <= tolerance;
    }

    // ==================== UI显示函数 ====================

    /**
     * 显示提示消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, error, warning, info)
     * @param {number} duration - 显示时长（毫秒）
     */
    function showAlert(message, type = 'info', duration = 5000) {
        // 转义消息内容，防止XSS
        const safeMessage = escapeHtml(message);

        // 创建提示元素
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';

        // 根据类型设置图标
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        const icon = icons[type] || 'info-circle';

        alertDiv.innerHTML = `
            <i class="fas fa-${icon} me-2"></i>${safeMessage}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // 添加到页面
        let container = document.getElementById('alertContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'alertContainer';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
            document.body.appendChild(container);
        }

        container.innerHTML = '';
        container.appendChild(alertDiv);

        // 自动消失
        if (duration > 0) {
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.classList.remove('show');
                    setTimeout(() => {
                        if (alertDiv.parentNode) {
                            alertDiv.parentNode.removeChild(alertDiv);
                        }
                    }, 500);
                }
            }, duration);
        }
    }

    /**
     * 根据分数获取颜色类名
     * @param {number} score - 分数
     * @returns {string} CSS类名
     */
    function getScoreColorClass(score) {
        if (score < 70) return 'text-danger';
        if (score < 80) return 'text-warning';
        if (score < 90) return 'text-info';
        return 'text-success';
    }

    /**
     * 根据分数值获取颜色（用于图表）
     * @param {number} score - 分数
     * @param {boolean} isBackground - 是否为背景色
     * @returns {string} RGBA颜色值
     */
    function getScoreColorByValue(score, isBackground = true) {
        const alpha = isBackground ? '0.6' : '1';

        if (score < 70) return `rgba(220, 53, 69, ${alpha})`; // 红色
        if (score < 80) return `rgba(255, 193, 7, ${alpha})`; // 黄色
        if (score < 90) return `rgba(13, 110, 253, ${alpha})`; // 蓝色
        return `rgba(25, 135, 84, ${alpha})`; // 绿色
    }

    /**
     * 设置分数颜色
     * @param {number} score - 分数
     * @param {string} elementId - 元素ID
     */
    function setScoreColor(score, elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // 移除之前的颜色类
        element.classList.remove('text-danger', 'text-warning', 'text-info', 'text-success');

        // 添加新的颜色类
        element.classList.add(getScoreColorClass(score));
    }

    // ==================== 日期和时间函数 ====================

    /**
     * 格式化日期为中文格式
     * @param {string|Date} dateString - 日期字符串或Date对象
     * @returns {string} 格式化后的日期
     */
    function formatDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        if (!(date instanceof Date) || isNaN(date)) return '';

        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    /**
     * 格式化日期时间
     * @param {string|Date} dateString - 日期字符串或Date对象
     * @returns {string} 格式化后的日期时间
     */
    function formatDateTime(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        if (!(date instanceof Date) || isNaN(date)) return '';

        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * 获取当前时间戳
     * @returns {number} Unix时间戳（秒）
     */
    function getCurrentTimestamp() {
        return Math.floor(Date.now() / 1000);
    }

    /**
     * 获取今天的日期字符串（YYYY-MM-DD格式）
     * @returns {string} 日期字符串
     */
    function getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    // ==================== 本地存储管理函数 ====================

    /**
     * 安全地保存数据到本地存储
     * @param {string} key - 存储键名
     * @param {*} data - 要存储的数据
     * @returns {boolean} 是否成功
     */
    function saveToLocalStorage(key, data) {
        try {
            const jsonString = JSON.stringify(data);

            // 检查数据大小（localStorage通常限制5-10MB）
            if (jsonString.length > 4 * 1024 * 1024) { // 4MB限制
                throw new Error('数据过大，超出本地存储限制');
            }

            localStorage.setItem(key, jsonString);
            return true;
        } catch (error) {
            console.error('保存到本地存储失败:', error);

            // 检查是否是容量限制错误
            if (error.name === 'QuotaExceededError') {
                showAlert('本地存储空间不足，请清理旧数据', 'error');
            } else {
                showAlert('数据保存失败: ' + error.message, 'error');
            }

            return false;
        }
    }

    /**
     * 从本地存储安全地读取数据
     * @param {string} key - 存储键名
     * @param {*} defaultValue - 默认值
     * @returns {*} 存储的数据或默认值
     */
    function loadFromLocalStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('从本地存储读取失败:', error);
            return defaultValue;
        }
    }

    /**
     * 从本地存储删除数据
     * @param {string} key - 存储键名
     * @returns {boolean} 是否成功
     */
    function removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('从本地存储删除失败:', error);
            return false;
        }
    }

    /**
     * 清理过期的本地存储数据
     * @param {string} prefix - 键名前缀
     * @param {number} maxAge - 最大保留时间（毫秒）
     */
    function cleanExpiredLocalStorage(prefix, maxAge) {
        try {
            const now = Date.now();
            const keysToCheck = [];

            // 获取所有匹配前缀的键
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    keysToCheck.push(key);
                }
            }

            // 检查并删除过期数据
            keysToCheck.forEach(key => {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data && data.created_time) {
                        const age = now - new Date(data.created_time).getTime();
                        if (age > maxAge) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (e) {
                    // 如果解析失败，删除该键
                    localStorage.removeItem(key);
                }
            });

            console.log(`清理了${keysToCheck.length}个本地存储项`);
        } catch (error) {
            console.error('清理本地存储失败:', error);
        }
    }

    // ==================== 数据验证函数 ====================

    /**
     * 验证评分数据的完整性
     * @param {Object} scoreData - 评分数据对象
     * @returns {Object} 验证结果 {valid: boolean, errors: Array}
     */
    function validateScoreData(scoreData) {
        const errors = [];

        // 验证员工姓名
        if (!isValidEmployeeName(scoreData.employee_name)) {
            errors.push('员工姓名无效（1-50个字符，只允许中文和英文）');
        }

        // 验证评估日期
        if (!isValidDate(scoreData.evaluation_date)) {
            errors.push('评估日期格式无效');
        }

        // 验证评分字段
        const scoreFields = ['score1', 'score2', 'score3', 'score4', 'score5', 'score6', 'score7'];
        scoreFields.forEach(field => {
            if (scoreData[field] !== undefined && !isValidScore(scoreData[field])) {
                errors.push(`${field}必须在0-100之间`);
            }
        });

        // 验证总分
        if (scoreData.total_score !== undefined && !isValidScore(scoreData.total_score)) {
            errors.push('总分必须在0-100之间');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * 计算加权总分
     * @param {Array<number>} scores - 分数数组
     * @param {Array<number>} weights - 权重数组
     * @returns {number} 加权总分
     */
    function calculateWeightedTotal(scores, weights) {
        if (!Array.isArray(scores) || !Array.isArray(weights)) return 0;
        if (scores.length !== weights.length) return 0;

        let total = 0;
        for (let i = 0; i < scores.length; i++) {
            total += (parseFloat(scores[i]) || 0) * (parseFloat(weights[i]) || 0);
        }
        return total;
    }

    // ==================== 错误处理函数 ====================

    /**
     * 统一的错误处理函数
     * @param {Error} error - 错误对象
     * @param {string} context - 错误上下文
     * @param {boolean} showToUser - 是否向用户显示错误
     */
    function handleError(error, context = '操作', showToUser = true) {
        console.error(`${context}失败:`, error);

        if (showToUser) {
            const userMessage = error.message || `${context}失败，请稍后重试`;
            showAlert(userMessage, 'error');
        }
    }

    /**
     * 异步操作的包装器，自动处理错误
     * @param {Promise} promise - 异步操作Promise
     * @param {string} context - 操作上下文
     * @param {boolean} showToUser - 是否向用户显示错误
     * @returns {Promise} 包装后的Promise
     */
    async function withErrorHandling(promise, context = '操作', showToUser = true) {
        try {
            return await promise;
        } catch (error) {
            handleError(error, context, showToUser);
            return null;
        }
    }

    // ==================== 加载状态管理 ====================

    /**
     * 设置按钮加载状态
     * @param {HTMLElement} button - 按钮元素
     * @param {string} loadingText - 加载中显示的文字
     * @param {boolean} isLoading - 是否为加载状态
     */
    function setButtonLoading(button, loadingText = '处理中...', isLoading = true) {
        if (!button) return;

        if (isLoading) {
            button.dataset.originalText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i>${loadingText}`;
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.innerHTML;
        }
    }

    /**
     * 显示/隐藏加载指示器
     * @param {HTMLElement} element - 加载指示器元素
     * @param {boolean} show - 是否显示
     */
    function setLoading(element, show = true) {
        if (!element) return;
        element.style.display = show ? 'block' : 'none';
    }

    // ==================== 导出公共接口 ====================

    return {
        // XSS防护
        escapeHtml,
        safeSetContent,
        sanitizeHTML,

        // 输入验证
        isValidScore,
        isValidDate,
        isValidEmployeeName,
        isValidWeight,
        isValidWeightSum,
        validateScoreData,

        // UI显示
        showAlert,
        getScoreColorClass,
        getScoreColorByValue,
        setScoreColor,

        // 日期时间
        formatDate,
        formatDateTime,
        getCurrentTimestamp,
        getTodayString,

        // 本地存储
        saveToLocalStorage,
        loadFromLocalStorage,
        removeFromLocalStorage,
        cleanExpiredLocalStorage,

        // 数据处理
        calculateWeightedTotal,

        // 错误处理
        handleError,
        withErrorHandling,

        // 加载状态
        setButtonLoading,
        setLoading
    };

})();

// 兼容旧代码，提供全局函数访问
window.escapeHtml = AITrainingUtils.escapeHtml;
window.showAlert = AITrainingUtils.showAlert;
window.setScoreColor = AITrainingUtils.setScoreColor;
window.formatDate = AITrainingUtils.formatDate;
window.calculateWeightedTotal = AITrainingUtils.calculateWeightedTotal;

console.log('AI培训评估系统工具库已加载');