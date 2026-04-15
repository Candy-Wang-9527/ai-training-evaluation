// 飞书Base嵌入管理工具
// 用于在各个页面动态加载飞书Base嵌入iframe

(function() {
    'use strict';

    // Base嵌入管理器
    const BaseEmbedManager = {
        /**
         * 初始化Base嵌入
         * @param {string} containerId - 嵌入容器的ID
         * @param {Object} options - 配置选项
         */
        init: function(containerId, options = {}) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Base嵌入容器未找到: ${containerId}`);
                return;
            }

            console.log(`初始化Base嵌入: ${containerId}`);

            // 加载保存的嵌入配置
            const savedConfig = this.loadEmbedConfig();

            if (savedConfig && savedConfig.embedUrl) {
                // 使用保存的配置
                this.renderEmbed(container, savedConfig.embedUrl, options);
            } else {
                // 使用默认配置
                const defaultUrl = 'https://st3m3xa39z.feishu.cn/base/MiG6bsjMiaEwAEskaSScC7W8nGb/embed';
                this.renderEmbed(container, defaultUrl, options);
            }
        },

        /**
         * 渲染Base嵌入iframe
         * @param {HTMLElement} container - 容器元素
         * @param {string} embedUrl - 嵌入URL
         * @param {Object} options - 配置选项
         */
        renderEmbed: function(container, embedUrl, options = {}) {
            const height = options.height || '600';
            const width = options.width || '100%';

            container.innerHTML = `
                <iframe
                    src="${embedUrl}"
                    width="${width}"
                    height="${height}"
                    frameborder="0"
                    scrolling="auto"
                    allowfullscreen
                    style="border: 1px solid #e0e0e0; border-radius: 4px;">
                </iframe>
                <div class="mt-2 text-end">
                    <small class="text-muted">
                        <i class="fas fa-external-link-alt me-1"></i>
                        嵌入自飞书Base
                    </small>
                </div>
            `;

            console.log(`Base嵌入已渲染: ${embedUrl}`);
        },

        /**
         * 加载嵌入配置
         * @returns {Object|null} 配置对象或null
         */
        loadEmbedConfig: function() {
            try {
                const configStr = localStorage.getItem('feishuBaseEmbed');
                if (configStr) {
                    return JSON.parse(configStr);
                }
            } catch (error) {
                console.error('加载Base嵌入配置失败:', error);
            }
            return null;
        },

        /**
         * 手动刷新嵌入
         * @param {string} containerId - 容器ID
         */
        refresh: function(containerId) {
            console.log(`刷新Base嵌入: ${containerId}`);
            this.init(containerId);
        },

        /**
         * 打开飞书Base新页面
         * @param {string} baseUrl - Base URL（可选）
         */
        openBase: function(baseUrl) {
            const url = baseUrl || 'https://st3m3xa39z.feishu.cn/base/MiG6bsjMiaEwAEskaSScC7W8nGb';
            window.open(url, '_blank');
        }
    };

    // 导出到全局
    window.BaseEmbedManager = BaseEmbedManager;

    // 页面加载完成后自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // 自动初始化所有baseContainer
            const containers = document.querySelectorAll('[id^="baseContainer"]');
            containers.forEach(function(container) {
                BaseEmbedManager.init(container.id);
            });
        });
    } else {
        // DOM已经加载完成
        const containers = document.querySelectorAll('[id^="baseContainer"]');
        containers.forEach(function(container) {
            BaseEmbedManager.init(container.id);
        });
    }

    console.log('Base嵌入管理器已加载');
})();
