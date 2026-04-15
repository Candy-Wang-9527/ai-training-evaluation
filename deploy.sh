#!/bin/bash

# AI培训评估系统部署脚本
# 作者：王浩
# 日期：2026-04-14

set -e  # 遇到错误立即退出

echo "🚀 AI培训评估系统部署脚本"
echo "=========================="
echo ""

# 检查目录结构
echo "📁 检查应用目录结构..."
if [ ! -f "index.html" ]; then
    echo "❌ 错误：找不到 index.html"
    exit 1
fi

if [ ! -f "js/feishu-config.js" ]; then
    echo "❌ 错误：找不到 js/feishu-config.js"
    exit 1
fi

echo "✅ 目录结构检查通过"
echo ""

# 显示系统信息
echo "📊 系统信息："
echo "  - 应用名称：AI培训评估系统"
echo "  - 版本：v1.0"
echo "  - 开发人员：王浩"
echo "  - 公司：兆原数通（北京）数据科技有限公司"
echo "  - 飞书Base Token：GA1QbgqTzaHaVIsIKWDcFI79nuc"
echo ""

# 部署选项
echo "🌐 请选择部署方式："
echo "  1) 本地测试（直接打开浏览器）"
echo "  2) GitHub Pages（免费托管）"
echo "  3) Vercel（推荐，最简单）"
echo "  4) 自定义服务器"
echo ""

read -p "请输入选项编号 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🖥️ 本地测试模式"
        echo "--------------"
        echo "请用浏览器打开以下文件："
        echo ""
        echo "  1. 主评分页面：file://$(pwd)/index.html"
        echo "  2. 统计分析：file://$(pwd)/statistics.html"
        echo "  3. 配置管理：file://$(pwd)/config.html"
        echo "  4. 集成测试：file://$(pwd)/test.html"
        echo ""
        echo "💡 提示："
        echo "  - Chrome/Edge浏览器按 F12 打开开发者工具"
        echo "  - 查看Console标签检查是否有错误"
        echo "  - 测试所有功能是否正常"
        ;;
    2)
        echo ""
        echo "🐙 GitHub Pages部署"
        echo "------------------"
        echo "步骤："
        echo "  1. 访问 https://github.com 并登录"
        echo "  2. 创建新仓库（如：ai-training-evaluation）"
        echo "  3. 上传当前目录所有文件到仓库"
        echo "  4. 仓库设置 → Pages → 选择 main 分支"
        echo "  5. 保存后访问：https://用户名.github.io/ai-training-evaluation"
        echo ""
        echo "📋 快速命令："
        echo "  git init"
        echo "  git add ."
        echo "  git commit -m '部署AI培训评估系统'"
        echo "  git branch -M main"
        echo "  git remote add origin https://github.com/用户名/ai-training-evaluation.git"
        echo "  git push -u origin main"
        ;;
    3)
        echo ""
        echo "▲ Vercel部署（推荐）"
        echo "-------------------"
        echo "步骤："
        echo "  1. 访问 https://vercel.com"
        echo "  2. 用GitHub账号登录"
        echo "  3. 点击 'Add New...' → 'Project'"
        echo "  4. 导入您的仓库"
        echo "  5. 点击 'Deploy' 等待完成"
        echo "  6. 获得访问链接，如：https://ai-training-evaluation.vercel.app"
        echo ""
        echo "✅ 优势："
        echo "  - 完全免费"
        echo "  - 自动HTTPS"
        echo "  - 全球CDN加速"
        echo "  - 自动部署更新"
        ;;
    4)
        echo ""
        echo "🖥️ 自定义服务器部署"
        echo "------------------"
        echo "步骤："
        echo "  1. 将当前目录上传到服务器："
        echo "     scp -r . user@yourserver:/var/www/ai-training-evaluation"
        echo ""
        echo "  2. 配置Web服务器（Nginx示例）："
cat << 'EOF'
     server {
         listen 80;
         server_name yourdomain.com;
         root /var/www/ai-training-evaluation;
         index index.html;
         
         location / {
             try_files $uri $uri/ =404;
         }
         
         # 启用Gzip压缩
         gzip on;
         gzip_types text/html text/css application/javascript;
     }
EOF
        echo ""
        echo "  3. 配置HTTPS（推荐）："
        echo "     certbot --nginx -d yourdomain.com"
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "🎯 部署后验证步骤："
echo "  1. 打开应用首页"
echo "  2. 检查飞书环境检测状态"
echo "  3. 测试员工选择功能"
echo "  4. 测试评分和保存功能"
echo "  5. 在飞书中打开验证集成功能"
echo ""
echo "📞 技术支持：王浩 (wanghao@joyadata.com)"
echo ""

# 创建部署完成标记
date > .deployed
echo "✅ 部署指南生成完成！"