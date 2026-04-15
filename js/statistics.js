// 统计分析页面 - 集成飞书Base版本
// 使用公共工具库 AITrainingUtils

// 图表实例
let departmentChart = null;
let dimensionChart = null;
let trendChart = null;
let isFeishuEnv = false;

// 初始化统计分析页
document.addEventListener('DOMContentLoaded', async function() {
    await initStatisticsPage();
});

async function initStatisticsPage() {
    console.log('初始化统计分析页面...');
    
    // 初始化飞书Base
    await initializeFeishuBase();
    
    // 加载统计数据
    await loadStatisticsData();
    
    // 绑定事件
    bindStatisticsEvents();
    
    console.log('统计分析页面初始化完成');
}

// 初始化飞书Base（与主页面相同逻辑）
async function initializeFeishuBase() {
    try {
        if (typeof lark !== 'undefined' && typeof FeishuBase !== 'undefined') {
            await FeishuBase.initialize();
            isFeishuEnv = FeishuBase.client.isInitialized;
            
            if (isFeishuEnv) {
                console.log('统计分析页：飞书Base连接成功');
            }
        }
    } catch (error) {
        console.error('统计分析页：飞书Base初始化失败:', error);
    }
}

// 加载统计数据
async function loadStatisticsData() {
    try {
        const loadingElement = document.getElementById('loadingStatistics');
        if (loadingElement) loadingElement.style.display = 'block';
        
        let statisticsData = [];
        
        if (isFeishuEnv) {
            // 从飞书Base获取数据
            statisticsData = await getFeishuStatisticsData();
            console.log(`从飞书Base获取${statisticsData.length}条统计数据`);
        } else {
            // 从本地存储获取数据
            statisticsData = getLocalStatisticsData();
            console.log(`从本地存储获取${statisticsData.length}条统计数据`);
        }
        
        // 处理数据并更新界面
        processStatisticsData(statisticsData);
        
        if (loadingElement) loadingElement.style.display = 'none';
        
    } catch (error) {
        console.error('加载统计数据失败:', error);
        AITrainingUtils.showAlert('加载统计数据失败: ' + error.message, 'error');
        loadSampleData(); // 降级到示例数据
    }
}

// 从飞书Base获取统计数据
async function getFeishuStatisticsData() {
    try {
        // 获取培训评分数据
        const trainingScores = await FeishuBase.client.getRecords('training_scores');
        
        // 获取应用评分数据
        const applicationScores = await FeishuBase.client.getRecords('application_scores');
        
        // 获取员工信息
        const employees = await FeishuBase.loadEmployees();
        
        // 合并数据
        const statisticsData = [];
        
        // 创建员工映射
        const employeeMap = {};
        employees.forEach(emp => {
            employeeMap[emp.name] = emp.department;
        });
        
        // 合并培训和应用评分
        const scoreMap = {};
        
        // 处理培训评分
        trainingScores.forEach(score => {
            const employeeName = score.employee_name;
            if (!scoreMap[employeeName]) {
                scoreMap[employeeName] = {};
            }
            scoreMap[employeeName].trainingTotal = score.total_score || 0;
            scoreMap[employeeName].evaluationDate = score.evaluation_date;
            scoreMap[employeeName].judgeName = score.evaluator;
        });
        
        // 处理应用评分
        applicationScores.forEach(score => {
            const employeeName = score.employee_name;
            if (!scoreMap[employeeName]) {
                scoreMap[employeeName] = {};
            }
            scoreMap[employeeName].applicationTotal = score.total_score || 0;
            scoreMap[employeeName].evaluationDate = score.evaluationDate || score.evaluation_date;
            scoreMap[employeeName].judgeName = score.evaluator;
        });
        
        // 转换为统计数据结构
        for (const [employeeName, scores] of Object.entries(scoreMap)) {
            if (scores.trainingTotal !== undefined && scores.applicationTotal !== undefined) {
                const finalScore = (scores.trainingTotal * 0.4 + scores.applicationTotal * 0.6);
                
                statisticsData.push({
                    employeeName: employeeName,
                    employeeDepartment: employeeMap[employeeName] || '未知部门',
                    trainingTotal: scores.trainingTotal,
                    applicationTotal: scores.applicationTotal,
                    finalScore: finalScore,
                    judgeName: scores.judgeName || '匿名评估人',
                    evaluationDate: scores.evaluationDate || new Date().toISOString().split('T')[0]
                });
            }
        }
        
        return statisticsData;
        
    } catch (error) {
        console.error('获取飞书统计数据失败:', error);
        return [];
    }
}

// 从本地存储获取统计数据
function getLocalStatisticsData() {
    try {
        const trainingScores = AITrainingUtils.loadFromLocalStorage('local_training_scores', []);
        const applicationScores = AITrainingUtils.loadFromLocalStorage('local_application_scores', []);
        
        const statisticsData = [];
        const scoreMap = {};
        
        // 处理培训评分
        trainingScores.forEach(score => {
            const employeeName = score.employee_name;
            if (!scoreMap[employeeName]) {
                scoreMap[employeeName] = {};
            }
            scoreMap[employeeName].trainingTotal = score.total_score || 0;
            scoreMap[employeeName].evaluationDate = score.evaluation_date;
            scoreMap[employeeName].judgeName = score.evaluator;
        });
        
        // 处理应用评分
        applicationScores.forEach(score => {
            const employeeName = score.employee_name;
            if (!scoreMap[employeeName]) {
                scoreMap[employeeName] = {};
            }
            scoreMap[employeeName].applicationTotal = score.total_score || 0;
        });
        
        // 转换为统计数据结构
        for (const [employeeName, scores] of Object.entries(scoreMap)) {
            if (scores.trainingTotal !== undefined && scores.applicationTotal !== undefined) {
                const finalScore = (scores.trainingTotal * 0.4 + scores.applicationTotal * 0.6);
                
                statisticsData.push({
                    employeeName: employeeName,
                    employeeDepartment: '本地部门', // 本地数据没有部门信息
                    trainingTotal: scores.trainingTotal,
                    applicationTotal: scores.applicationTotal,
                    finalScore: finalScore,
                    judgeName: scores.judgeName || '匿名评估人',
                    evaluationDate: scores.evaluationDate || new Date().toISOString().split('T')[0]
                });
            }
        }
        
        return statisticsData;
        
    } catch (error) {
        console.error('获取本地统计数据失败:', error);
        return [];
    }
}

// 处理统计数据
function processStatisticsData(data) {
    if (data.length === 0) {
        AITrainingUtils.showAlert('暂无统计数据，请先进行评分', 'info');
        loadSampleData(); // 加载示例数据演示
        return;
    }
    
    console.log('处理统计数据:', data.length, '条记录');
    
    // 更新统计摘要
    updateStatisticsSummary(data);
    
    // 更新表格
    updateStatisticsTable(data);
    
    // 创建图表
    createCharts(data);
    
    // 更新数据源信息
    updateDataSourceInfo(data.length);
}

// 更新统计摘要
function updateStatisticsSummary(data) {
    if (data.length === 0) return;
    
    // 计算平均分
    const avgFinalScore = data.reduce((sum, item) => sum + item.finalScore, 0) / data.length;
    const avgTrainingScore = data.reduce((sum, item) => sum + item.trainingTotal, 0) / data.length;
    const avgApplicationScore = data.reduce((sum, item) => sum + item.applicationTotal, 0) / data.length;
    
    // 计算最高分
    const maxFinalScore = Math.max(...data.map(item => item.finalScore));
    const maxTrainingScore = Math.max(...data.map(item => item.trainingTotal));
    const maxApplicationScore = Math.max(...data.map(item => item.applicationTotal));
    
    // 计算最低分
    const minFinalScore = Math.min(...data.map(item => item.finalScore));
    const minTrainingScore = Math.min(...data.map(item => item.trainingTotal));
    const minApplicationScore = Math.min(...data.map(item => item.applicationTotal));
    
    // 更新显示
    document.getElementById('avgFinalScore').textContent = avgFinalScore.toFixed(1);
    document.getElementById('avgTrainingScore').textContent = avgTrainingScore.toFixed(1);
    document.getElementById('avgApplicationScore').textContent = avgApplicationScore.toFixed(1);
    
    document.getElementById('maxFinalScore').textContent = maxFinalScore.toFixed(1);
    document.getElementById('minFinalScore').textContent = minFinalScore.toFixed(1);
    
    // 统计参与人数
    const uniqueEmployees = [...new Set(data.map(item => item.employeeName))];
    document.getElementById('totalParticipants').textContent = uniqueEmployees.length;
    document.getElementById('totalEvaluations').textContent = data.length;
    
    // 设置颜色
    AITrainingUtils.setScoreColor(avgFinalScore, 'avgFinalScore');
    AITrainingUtils.setScoreColor(avgTrainingScore, 'avgTrainingScore');
    AITrainingUtils.setScoreColor(avgApplicationScore, 'avgApplicationScore');
}

// 更新统计表格
function updateStatisticsTable(data) {
    const tbody = document.getElementById('statisticsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // 按最终分数排序（从高到低）
    const sortedData = [...data].sort((a, b) => b.finalScore - a.finalScore);
    
    sortedData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // 设置排名颜色
        let rankClass = '';
        if (index === 0) rankClass = 'table-warning'; // 第一名
        else if (index === 1) rankClass = 'table-secondary'; // 第二名
        else if (index === 2) rankClass = 'table-info'; // 第三名
        
        row.className = rankClass;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.employeeName}</td>
            <td>${item.employeeDepartment}</td>
            <td class="${AITrainingUtils.getScoreColorClass(item.trainingTotal)}">${item.trainingTotal.toFixed(1)}</td>
            <td class="${AITrainingUtils.getScoreColorClass(item.applicationTotal)}">${item.applicationTotal.toFixed(1)}</td>
            <td class="fw-bold ${AITrainingUtils.getScoreColorClass(item.finalScore)}">${item.finalScore.toFixed(1)}</td>
            <td>${AITrainingUtils.formatDate(item.evaluationDate)}</td>
            <td>${item.judgeName}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// 创建图表
function createCharts(data) {
    // 销毁之前的图表
    if (departmentChart) departmentChart.destroy();
    if (dimensionChart) dimensionChart.destroy();
    if (trendChart) trendChart.destroy();
    
    // 1. 部门对比图表
    createDepartmentChart(data);
    
    // 2. 维度分析图表
    createDimensionChart(data);
    
    // 3. 趋势分析图表
    createTrendChart(data);
}

// 创建部门对比图表
function createDepartmentChart(data) {
    const ctx = document.getElementById('departmentChart');
    if (!ctx) return;
    
    // 按部门分组计算平均分
    const departments = {};
    const departmentCounts = {};
    
    data.forEach(item => {
        const dept = item.employeeDepartment || '未知部门';
        if (!departments[dept]) {
            departments[dept] = 0;
            departmentCounts[dept] = 0;
        }
        departments[dept] += item.finalScore;
        departmentCounts[dept]++;
    });
    
    // 计算部门平均分
    const departmentNames = Object.keys(departments);
    const departmentAverages = departmentNames.map(dept => departments[dept] / departmentCounts[dept]);
    
    // 按平均分排序
    const sortedIndices = departmentAverages.map((_, i) => i)
        .sort((a, b) => departmentAverages[b] - departmentAverages[a]);
    
    const sortedDepartments = sortedIndices.map(i => departmentNames[i]);
    const sortedAverages = sortedIndices.map(i => departmentAverages[i]);
    
    // 创建图表
    departmentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedDepartments,
            datasets: [{
                label: '部门平均分',
                data: sortedAverages,
                backgroundColor: sortedAverages.map(score => AITrainingUtils.getScoreColorByValue(score, true)),
                borderColor: sortedAverages.map(score => AITrainingUtils.getScoreColorByValue(score, false)),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}分`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '平均分数'
                    }
                }
            }
        }
    });
}

// 创建维度分析图表
function createDimensionChart(data) {
    const ctx = document.getElementById('dimensionChart');
    if (!ctx) return;
    
    // 计算培训和应用的总体平均分
    const avgTraining = data.reduce((sum, item) => sum + item.trainingTotal, 0) / data.length;
    const avgApplication = data.reduce((sum, item) => sum + item.applicationTotal, 0) / data.length;
    
    dimensionChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['培训维度', '应用维度'],
            datasets: [{
                label: '平均分对比',
                data: [avgTraining, avgApplication],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: [AITrainingUtils.getScoreColorByValue(avgTraining, false), AITrainingUtils.getScoreColorByValue(avgApplication, false)],
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

// 创建趋势分析图表
function createTrendChart(data) {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    // 按日期分组
    const dates = {};
    data.forEach(item => {
        const date = item.evaluationDate.split('T')[0];
        if (!dates[date]) {
            dates[date] = { total: 0, count: 0 };
        }
        dates[date].total += item.finalScore;
        dates[date].count++;
    });
    
    // 转换为数组并排序
    const dateArray = Object.entries(dates)
        .map(([date, stats]) => ({
            date,
            average: stats.total / stats.count
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 取最近10天的数据
    const recentData = dateArray.slice(-10);
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: recentData.map(item => AITrainingUtils.formatDate(item.date)),
            datasets: [{
                label: '平均分趋势',
                data: recentData.map(item => item.average),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '平均分数'
                    }
                }
            }
        }
    });
}

// 绑定事件
function bindStatisticsEvents() {
    // 刷新按钮
    const refreshBtn = document.getElementById('refreshStatistics');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async function() {
            await loadStatisticsData();
            AITrainingUtils.showAlert('统计数据已刷新', 'success');
        });
    }
    
    // 导出按钮
    const exportBtn = document.getElementById('exportStatistics');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportStatistics);
    }
    
    // 时间筛选
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            // 这里可以实现按时间筛选的功能
            console.log('时间筛选:', this.value);
        });
    }
}

// 导出统计数据
function exportStatistics() {
    try {
        // 获取当前表格数据
        const table = document.getElementById('statisticsTable');
        if (!table) return;
        
        // 创建CSV内容
        let csvContent = "排名,员工姓名,部门,培训得分,应用得分,最终得分,评估日期,评估人\n";
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = Array.from(cells).map(cell => cell.textContent);
            csvContent += rowData.join(',') + '\n';
        });
        
        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AI培训评估统计_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        AITrainingUtils.showAlert('统计数据已导出为CSV文件', 'success');
        
    } catch (error) {
        console.error('导出统计数据失败:', error);
        AITrainingUtils.showAlert('导出失败: ' + error.message, 'error');
    }
}

// 加载示例数据（用于演示）
function loadSampleData() {
    const sampleData = [
        {
            employeeName: '张三',
            employeeDepartment: '研发部',
            trainingTotal: 85.2,
            applicationTotal: 88.5,
            finalScore: 87.0,
            judgeName: '王浩',
            evaluationDate: '2026-04-10'
        },
        {
            employeeName: '李四',
            employeeDepartment: '产品部',
            trainingTotal: 78.5,
            applicationTotal: 82.3,
            finalScore: 80.7,
            judgeName: '王浩',
            evaluationDate: '2026-04-11'
        },
        {
            employeeName: '王五',
            employeeDepartment: '销售部',
            trainingTotal: 92.0,
            applicationTotal: 88.0,
            finalScore: 89.6,
            judgeName: '王浩',
            evaluationDate: '2026-04-12'
        },
        {
            employeeName: '赵六',
            employeeDepartment: '实施部',
            trainingTotal: 76.8,
            applicationTotal: 79.2,
            finalScore: 78.2,
            judgeName: '王浩',
            evaluationDate: '2026-04-13'
        }
    ];
    
    processStatisticsData(sampleData);
    updateDataSourceInfo(sampleData.length, true);
}

// 更新数据源信息
function updateDataSourceInfo(count, isSample = false) {
    const infoElement = document.getElementById('dataSourceInfo');
    if (!infoElement) return;

    let htmlContent = '';
    if (isSample) {
        htmlContent = `<i class="fas fa-exclamation-triangle text-warning me-1"></i>当前显示示例数据（${count}条记录）`;
    } else if (isFeishuEnv) {
        htmlContent = `<i class="fas fa-database text-success me-1"></i>数据来源：飞书Base（${count}条记录）`;
    } else {
        htmlContent = `<i class="fas fa-laptop text-info me-1"></i>数据来源：本地存储（${count}条记录）`;
    }

    AITrainingUtils.safeSetContent(infoElement, htmlContent, true);
}



// 检查Chart.js是否已加载
if (typeof Chart === 'undefined') {
    console.warn('Chart.js未加载，正在动态加载...');
    
    // 动态加载Chart.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = function() {
        console.log('Chart.js已加载');
        // 重新初始化图表
        if (typeof initStatisticsPage === 'function') {
            initStatisticsPage();
        }
    };
    document.head.appendChild(script);
}

console.log('统计分析逻辑已加载');