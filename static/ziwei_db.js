// 星曜含义数据库管理类
// 修改原有的 StarMeaningDB 类，添加服务端同步
class StarMeaningDB {
    constructor() {
        this.dbName = 'StarMeaningDB';
        this.version = 1;
        this.apiBase = getApiBaseUrl(); // 你的域名
        this.isOnline = true;
        this.pendingChanges = []; // 离线时的待同步更改
    }

     // 初始化 - 检查连接状态
    async init() {
        try {
            // 健康检查
            const response = await fetch(`${this.apiBase}/api/health`, {
                method: 'GET',
                timeout: 5000
            });
            this.isOnline = response.ok;
        } catch (error) {
            console.warn('服务端连接失败，使用离线模式:', error);
            this.isOnline = false;
        }
        
        // 监听网络状态
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        return true;
    }

    // 处理在线状态
    async handleOnline() {
        this.isOnline = true;
        console.log('网络恢复，同步待处理更改...');
        await this.syncPendingChanges();
    }

    // 处理离线状态
    handleOffline() {
        this.isOnline = false;
        console.warn('网络断开，进入离线模式');
    }

    // 同步待处理更改
    async syncPendingChanges() {
        if (!this.isOnline || this.pendingChanges.length === 0) return;
        
        for (const change of [...this.pendingChanges]) {
            try {
                await this.executeApiCall(change);
                // 从待处理列表中移除
                this.pendingChanges = this.pendingChanges.filter(c => c !== change);
            } catch (error) {
                console.error('同步失败:', error);
                break;
            }
        }
    }

    // 执行API调用
    async executeApiCall({ method, endpoint, data }) {
        const response = await fetch(`${this.apiBase}/api${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    // 获取所有星曜含义
    async getAllMeanings() {
        try {
            if (!this.isOnline) {
                throw new Error('离线模式，无法获取数据');
            }

            const response = await this.executeApiCall({
                method: 'GET',
                endpoint: '/stars'
            });

            // 转换为数组格式
            return Object.values(response);
        } catch (error) {
            console.error('获取数据失败:', error);
            throw error;
        }
    }

    // 获取单个星曜含义
    async getMeaning(starName) {
        try {
            if (!this.isOnline) {
                throw new Error('离线模式，无法获取数据');
            }

            const response = await this.executeApiCall({
                method: 'GET',
                endpoint: `/stars/${encodeURIComponent(starName)}`
            });

            return response;
        } catch (error) {
            console.error(`获取星曜 ${starName} 失败:`, error);
            throw error;
        }
    }

    // 保存星曜含义
    async saveMeaning(meaningData) {
        const apiCall = {
            method: 'POST',
            endpoint: '/stars',
            data: meaningData
        };

        try {
            if (!this.isOnline) {
                // 离线模式，加入待处理队列
                this.pendingChanges.push(apiCall);
                console.log('离线模式，更改已加入待同步队列');
                return { success: true, message: '离线保存，待网络恢复后同步' };
            }

            const result = await this.executeApiCall(apiCall);
            return result;
        } catch (error) {
            if (!this.isOnline) {
                // 网络错误，加入待处理队列
                this.pendingChanges.push(apiCall);
                console.log('网络错误，更改已加入待同步队列');
                return { success: true, message: '网络错误，更改已加入待同步队列' };
            }
            throw error;
        }
    }

    // 删除星曜含义
    async deleteMeaning(starName) {
        const apiCall = {
            method: 'DELETE',
            endpoint: `/stars/${encodeURIComponent(starName)}`
        };

        try {
            if (!this.isOnline) {
                this.pendingChanges.push(apiCall);
                console.log('离线模式，删除操作已加入待同步队列');
                return { success: true, message: '离线删除，待网络恢复后同步' };
            }

            const result = await this.executeApiCall(apiCall);
            return result;
        } catch (error) {
            if (!this.isOnline) {
                this.pendingChanges.push(apiCall);
                console.log('网络错误，删除操作已加入待同步队列');
                return { success: true, message: '网络错误，删除操作已加入待同步队列' };
            }
            throw error;
        }
    }

    // 批量导入数据
    async importData(data) {
        try {
            const response = await this.executeApiCall({
                method: 'POST',
                endpoint: '/import/batch',
                data: data
            });

            return response;
        } catch (error) {
            console.error('批量导入失败:', error);
            throw error;
        }
    }

    // 导出数据
    async exportData() {
        try {
            const response = await this.executeApiCall({
                method: 'GET',
                endpoint: '/export'
            });

            return JSON.stringify(response, null, 2);
        } catch (error) {
            console.error('导出失败:', error);
            throw error;
        }
    }

    // 导入默认数据
    async importDefaultData(defaultData) {
        try {
            // 先转换数据格式
            const structuredData = convertStarMeaningsAdvanced(defaultData);
            
            // 批量导入
            const result = await this.importData(structuredData);
            console.log('默认数据导入完成:', result);
            return result;
        } catch (error) {
            console.error('导入默认数据失败:', error);
            throw error;
        }
    }

    // 获取待同步更改数量
    getPendingChangesCount() {
        return this.pendingChanges.length;
    }

    // 获取连接状态
    getConnectionStatus() {
        return {
            isOnline: this.isOnline,
            pendingChanges: this.pendingChanges.length
        };
    }
}
const starMeaningMap = {};
// 全局数据库实例
let starDB = null;

// 初始化数据库
async function initStarMeaningDB() {
    try {
        starDB = new StarMeaningDB();
        await starDB.init();

        // const defaultData=convertStarMeaningsAdvanced(starMeaningMap);
        // 检查是否有数据，如果没有则导入默认数据
        const meanings = await starDB.getAllMeanings();
        if (meanings.length === 0) {
            await starDB.importDefaultData(starMeaningMap);
            console.log('默认星曜数据导入成功');
        }
        
        return true;
    } catch (error) {
        console.error('数据库初始化失败:', error);
        return false;
    }
}

// 打开管理模态框
async function openManagementModal() {
    const modal = document.getElementById('managementModal');
    modal.style.display = 'block';
    
    // 加载星曜列表
    await loadStarsList();
}

// 关闭管理模态框
function closeManagementModal() {
    const modal = document.getElementById('managementModal');
    modal.style.display = 'none';
}

// 切换标签页
function openTab(src,tabName) {
    // 隐藏所有标签页
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 移除所有标签按钮的active类
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    document.getElementById(tabName).classList.add('active');
    
    // 激活对应的标签按钮
    src.classList.add('active');


}

// 加载星曜列表
async function loadStarsList(filter = '') {
    const starsList = document.getElementById('starsList');
    const meanings = await starDB.getAllMeanings();
    
    let html = '';
    meanings.forEach(meaning => {
        if (!filter || meaning.starName.includes(filter)) {
            html += `
                <div class="star-item" onclick="loadMeaning('${meaning.starName}')">
                    <strong>${meaning.starName}</strong>
                    <div style="font-size: 12px; color: #666;">
                        ${meaning.basic ? meaning.basic.substring(0, 50) + '...' : '无内容'}
                    </div>
                </div>
            `;
        }
    });
    starsList.innerHTML = html || '<div>未找到匹配的星曜</div>';
}

// 搜索星曜
function searchStars() {
    const searchTerm = document.getElementById('searchInput').value;
    loadStarsList(searchTerm);
}

// 刷新列表
function refreshList() {
    loadStarsList();
}

// 加载星曜含义到编辑表单
async function loadMeaning(starName) {
    const meaning = await starDB.getMeaning(starName);
    
    if (meaning) {
        // 切换到编辑标签页
        
        openTab(document.querySelectorAll('.tab-btn').item(1),'editTab');
        
        // 填充表单
        document.getElementById('starName').value = meaning.starName || '';
        document.getElementById('basicMeaning').value = meaning.basic || '';
        document.getElementById('combinationMeaning').value = meaning.combination || '';
        document.getElementById('extendedMeaning').value = meaning.extended || '';
        document.getElementById('materialProperty').value = meaning.material || '';
        document.getElementById('healthImpact').value = meaning.health || '';
        document.getElementById('relationshipImpact').value = meaning.relationship || '';
        document.getElementById('careerImpact').value = meaning.career || '';
        document.getElementById('wealthImpact').value = meaning.wealth || '';
        document.getElementById('mindsetImpact').value = meaning.mindset || '';
    }
}

// 保存星曜含义
async function saveMeaning(event) {
    event.preventDefault();
    
    const formData = {
        starName: document.getElementById('starName').value,
        basic: document.getElementById('basicMeaning').value,
        combination: document.getElementById('combinationMeaning').value,
        extended: document.getElementById('extendedMeaning').value,
        material: document.getElementById('materialProperty').value,
        health: document.getElementById('healthImpact').value,
        relationship: document.getElementById('relationshipImpact').value,
        career: document.getElementById('careerImpact').value,
        wealth: document.getElementById('wealthImpact').value,
        mindset: document.getElementById('mindsetImpact').value,
        lastUpdated: new Date().toISOString()
    };
    
    try {
        await starDB.saveMeaning(formData);
        alert('保存成功！');
        
        // 刷新列表
        await loadStarsList();
        
        // 清空表单
        clearForm();
        
    } catch (error) {
        alert('保存失败: ' + error.message);
    }
}

// 清空表单
function clearForm() {
    document.getElementById('meaningForm').reset();
}

// 删除当前星曜含义
async function deleteCurrentMeaning() {
    const starName = document.getElementById('starName').value;
    
    if (!starName) {
        alert('请先选择要删除的星曜');
        return;
    }
    
    if (confirm(`确定要删除"${starName}"的含义吗？`)) {
        try {
            await starDB.deleteMeaning(starName);
            alert('删除成功！');
            
            // 刷新列表并清空表单
            await loadStarsList();
            clearForm();
            
        } catch (error) {
            alert('删除失败: ' + error.message);
        }
    }
}

// 导出数据
async function exportData() {
    try {
        const data = await starDB.exportData();
        document.getElementById('exportDataArea').value = data;
        alert('数据导出成功！');
    } catch (error) {
        alert('导出失败: ' + error.message);
    }
}

// 复制导出数据
function copyExportData() {
    const textarea = document.getElementById('exportDataArea');
    textarea.select();
    document.execCommand('copy');
    alert('数据已复制到剪贴板！');
}

// 导入数据
async function importData() {
    const data = document.getElementById('importDataArea').value;
    
    if (!data) {
        data = starMeaningMap;
    }
    
    if (confirm('导入数据将覆盖现有数据，确定继续吗？')) {
        const data_json=convertStarMeaningsAdvanced(data);
        // const textarea = document.getElementById('exportDataArea');
        // textarea.value=JSON.stringify(output, null, 2);

        try {
            await starDB.importData(data_json);
            alert('数据导入成功！');
            
            // 刷新列表
            await loadStarsList();
            
        } catch (error) {
            alert('导入失败: ' + error.message);
        }
    }
}

// 恢复默认数据
async function resetToDefault() {
    if (confirm('确定要恢复默认数据吗？这将覆盖所有现有数据。')) {
        try {
            await starDB.importDefaultData();
            alert('默认数据恢复成功！');
            
            // 刷新列表
            await loadStarsList();
            
        } catch (error) {
            alert('恢复失败: ' + error.message);
        }
    }
}

// 修改原有的 showStarMeaning 函数，从数据库获取数据
async function showStarMeaning(starName, element) {
    if (!starDB) {
        await initStarMeaningDB();
    }
    
    try {
        const meaning = await starDB.getMeaning(starName);
        
        if (!meaning) {
            showError('未找到该星曜的含义数据');
            return;
        }
        
        const tooltip = document.getElementById('star-tooltip') || createStarTooltip();
        
        const html = `
            <div style="font-weight:bold; color:#8b4513; margin-bottom:8px; border-bottom:1px solid #d2b48c; padding-bottom:5px;text-align: center;">
                ${starName}
            </div>
            
            ${meaning.basic ? `
            <div class="meaning-section">
                <div class="section-title">⚪⚪ 根本属性</div>
                <div class="section-content">${meaning.basic}</div>
            </div>
            ` : ''}
            
            ${meaning.combination ? `
            <div class="meaning-section">
                <div class="section-title">🔗 组合象义</div>
                <div class="section-content">${meaning.combination}</div>
            </div>
            ` : ''}
            
            ${meaning.extended ? `
            <div class="meaning-section">
                <div class="section-title">📖 扩展象义</div>
                <div class="section-content">${meaning.extended}</div>
            </div>
            ` : ''}
            
            ${meaning.material ? `
            <div class="meaning-section">
                <div class="section-title">🏠 物质属性</div>
                <div class="section-content">${meaning.material}</div>
            </div>
            ` : ''}
            
            ${meaning.health ? `
            <div class="meaning-section">
                <div class="section-title">💊 身体健康</div>
                <div class="section-content">${meaning.health}</div>
            </div>
            ` : ''}
            
            ${meaning.relationship ? `
            <div class="meaning-section">
                <div class="section-title">💑 感情关系</div>
                <div class="section-content">${meaning.relationship}</div>
            </div>
            ` : ''}
            
            ${meaning.career ? `
            <div class="meaning-section">
                <div class="section-title">💼 职场事业</div>
                <div class="section-content">${meaning.career}</div>
            </div>
            ` : ''}
            
            ${meaning.wealth ? `
            <div class="meaning-section">
                <div class="section-title">💰 财富资产</div>
                <div class="section-content">${meaning.wealth}</div>
            </div>
            ` : ''}
            
            ${meaning.mindset ? `
            <div class="meaning-section">
                <div class="section-title">🧠 精神思维</div>
                <div class="section-content">${meaning.mindset}</div>
            </div>
            ` : ''}
            
            <div style="text-align:center; margin-top:10px; font-size:10px; color:#666;">
                最后更新: ${new Date(meaning.lastUpdated).toLocaleString()}
            </div>
        `;
        
        tooltip.innerHTML = html;
        tooltip.style.display = 'block';
        
        // 定位逻辑保持不变...
        
    } catch (error) {
        console.error('获取星曜含义失败:', error);
        showError('获取星曜含义失败');
    }
}

// 添加CSS样式
const managementStyles = `
.meaning-section {
    margin-bottom: 15px;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 5px;
    border-left: 3px solid #8b4513;
}

.section-title {
    font-weight: bold;
    color: #8b4513;
    margin-bottom: 5px;
    font-size: 12px;
}

.section-content {
    font-size: 11px;
    line-height: 1.4;
    color: #333;
}
`;

// 注入样式
const styleSheet = document.createElement('style');
styleSheet.textContent = managementStyles;
document.head.appendChild(styleSheet);

// 在页面加载时初始化数据库
document.addEventListener('DOMContentLoaded', async function() {
    setTimeout(() => {
        initStarMeaningDB().then(() => {
            console.log('星曜含义数据初始化完成');
        });
    }, 2000);
});

// -----------------------------------------------------------------------------------------------------------------------

// 改进的数据转换函数 - 更精确的解析
function convertStarMeaningsAdvanced(starMeaningMap) {
    const structuredData = {};
    
    Object.entries(starMeaningMap).forEach(([starName, htmlContent]) => {
        // 使用更精确的解析方法
        const sections = htmlContent.split(/<div class="label">⚪⚪? [^<]+<\/div>/);
        
        let basic = '';
        let combination = '';
        let extended = '';
        let material = '';
        let health = '';
        let relationship = '';
        let career = '';
        let wealth = '';
        let mindset = '';
        
        if (sections.length >= 2) {
            // 根本属性
            const basicSection = sections[1].split('</div>')[0];
            basic = cleanHtmlContent(basicSection);
            
            // 组合象义（第二个div）
            const combinationMatch = sections[1].match(/<div>([\s\S]*?)<\/div>\s*<div>([\s\S]*?)<\/div>/);
            if (combinationMatch && combinationMatch[2]) {
                combination = cleanHtmlContent(combinationMatch[2]);
            }
        }
        
        if (sections.length >= 3) {
            // 场景扩展部分
            const extendedSections = sections[2].split(/(?=<div>)/g);
            
            extendedSections.forEach((section, index) => {
                const content = cleanHtmlContent(section);
                if (content) {
                    // 根据内容关键词分配
                    if (content.includes('头部') || content.includes('器官') || content.includes('病理')) {
                        health = content;
                    } else if (content.includes('夫妻') || content.includes('感情') || content.includes('婚姻')) {
                        relationship = content;
                    } else if (content.includes('岗位') || content.includes('职业') || content.includes('事业')) {
                        career = content;
                    } else if (content.includes('资金') || content.includes('财富') || content.includes('资产')) {
                        wealth = content;
                    } else if (content.includes('思维') || content.includes('认知') || content.includes('精神')) {
                        mindset = content;
                    } else if (content.includes('物质') || content.includes('属性')) {
                        material = content;
                    } else {
                        extended += content + '\n';
                    }
                }
            });
        }
        
        structuredData[starName] = {
            starName: starName,
            basic: basic,
            combination: combination,
            extended: extended.trim(),
            material: material,
            health: health,
            relationship: relationship,
            career: career,
            wealth: wealth,
            mindset: mindset,
            lastUpdated: new Date().toISOString()
        };
    });
    
    return structuredData;
}
// 清理 HTML 内容
function cleanHtmlContent(html) {
    return html.replace(/<\/?div[^>]*>/g, '')
        .replace(/<br\/?>/g, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
// 增强的数据转换函数 - 处理复杂的HTML结构
// function convertStarMeaningsAdvanced(starMeaningMap) {
//     const structuredData = {};
    
//     Object.entries(starMeaningMap).forEach(([starName, htmlContent]) => {
//         const result = {
//             starName: starName,
//             basic: '',
//             combination: '',
//             extended: '',
//             material: '',
//             health: '',
//             relationship: '',
//             career: '',
//             wealth: '',
//             mindset: '',
//             lastUpdated: new Date().toISOString()
//         };

//         try {
//             // 清理HTML标签，提取纯文本
//             const cleanText = htmlContent
//                 .replace(/<div class="label">⚪⚪? ([^<]+)<\/div>/g, '【$1】')
//                 .replace(/<\/?div[^>]*>/g, '')
//                 .replace(/<br\/?>/g, '\n')
//                 .replace(/&nbsp;/g, ' ')
//                 .replace(/\s+/g, ' ')
//                 .trim();
            
//             // 分割主要部分
//             const sections = cleanText.split(/【根本属性】|【场景扩展】/);
            
//             if (sections.length > 1) {
//                 // 根本属性部分
//                 const basicPart = sections[1];
//                 const basicLines = basicPart.split(/\s{2,}/); // 用多个空格分割
                
//                 if (basicLines.length > 0) {
//                     result.basic = basicLines[0].trim();
//                 }
//                 if (basicLines.length > 1) {
//                     result.combination = basicLines[1].trim();
//                 }
//             }
            
//             if (sections.length > 2) {
//                 // 场景扩展部分
//                 const extendedPart = sections[2];
//                 const extendedLines = extendedPart.split(/\s{2,}/);
                
//                 extendedLines.forEach((line, index) => {
//                     const cleanLine = line.trim();
//                     if (cleanLine) {
//                         switch (index) {
//                             case 0: result.material = cleanLine; break;
//                             case 1: result.health = cleanLine; break;
//                             case 2: result.relationship = cleanLine; break;
//                             case 3: result.career = cleanLine; break;
//                             case 4: result.wealth = cleanLine; break;
//                             case 5: result.mindset = cleanLine; break;
//                             default: 
//                                 if (result.extended) {
//                                     result.extended += ' ' + cleanLine;
//                                 } else {
//                                     result.extended = cleanLine;
//                                 }
//                         }
//                     }
//                 });
//             }
            
//         } catch (error) {
//             console.error(`解析星曜 ${starName} 时出错:`, error);
//         }
        
//         structuredData[starName] = result;
//     });
    
//     return structuredData;
// }



// 批量导入函数
async function batchImportStarMeanings() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 500px;
        text-align: center;
    `;
    
    content.innerHTML = `
        <h3>导入星曜含义数据</h3>
        <p>正在将 ${Object.keys(starMeaningMap).length} 个星曜的含义导入数据库...</p>
        <div id="importProgress" style="margin: 20px 0;">
            <div style="background: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
                <div id="progressBar" style="background: #8b4513; height: 100%; width: 0%; transition: width 0.3s;"></div>
            </div>
            <div id="progressText">准备导入...</div>
        </div>
        <button onclick="closeImportModal()" style="padding: 10px 20px; background: #8b4513; color: white; border: none; border-radius: 5px; cursor: pointer;">取消</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    try {
        const totalStars = Object.keys(starMeaningMap).length;
        let processed = 0;
        
        // 初始化数据库
        if (!starDB) {
            starDB = new StarMeaningDB();
            await starDB.init();
        }
        
        // 转换并导入数据
        const structuredData = convertStarMeaningsAdvanced(starMeaningMap);
        
        for (const [starName, meaningData] of Object.entries(structuredData)) {
            try {
                await starDB.saveMeaning(meaningData);
                processed++;
                
                // 更新进度
                const progress = (processed / totalStars) * 100;
                document.getElementById('progressBar').style.width = progress + '%';
                document.getElementById('progressText').textContent = 
                    `已导入 ${processed}/${totalStars} (${Math.round(progress)}%) - ${starName}`;
                
                // 稍微延迟以便看到进度
                await new Promise(resolve => setTimeout(resolve, 10));
                
            } catch (error) {
                console.error(`导入失败 ${starName}:`, error);
            }
        }
        
        content.innerHTML = `
            <h3>导入完成！</h3>
            <p>成功导入 ${processed} 个星曜的含义数据</p>
            <button onclick="closeImportModalAndRefresh()" style="padding: 10px 20px; background: #8b4513; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">确定</button>
        `;
        
    } catch (error) {
        content.innerHTML = `
            <h3>导入失败</h3>
            <p>错误: ${error.message}</p>
            <button onclick="closeImportModal()" style="padding: 10px 20px; background: #8b4513; color: white; border: none; border-radius: 5px; cursor: pointer;">关闭</button>
        `;
    }
}

// 关闭模态框
function closeImportModal() {
    const modal = document.querySelector('div[style*="position: fixed; top: 0; left: 0;"]');
    if (modal) {
        modal.remove();
    }
}

function closeImportModalAndRefresh() {
    closeImportModal();
    // 刷新管理界面
    if (typeof loadStarsList === 'function') {
        loadStarsList();
    }
}

// 在管理界面添加导入按钮
function addImportButtonToManagement() {
    // 在管理模态框的导入/导出标签页中添加导入按钮
    const importExportTab = document.getElementById('importExportTab');
    if (importExportTab) {
        const importSection = document.createElement('div');
        importSection.className = 'import-export-section';
        importSection.innerHTML = `
            <h3>导入默认数据</h3>
            <p>将内置的星曜含义数据导入到数据库中</p>
            <button onclick="batchImportStarMeanings()" style="padding: 10px 20px; background: #8b4513; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
                导入默认星曜数据
            </button>
            <p style="font-size: 12px; color: #666;">这将导入 ${Object.keys(starMeaningMap).length} 个星曜的含义数据</p>
        `;
        
        importExportTab.insertBefore(importSection, importExportTab.firstChild);
    }
}


// 添加到全局作用域，以便在管理界面调用
window.batchImportStarMeanings = batchImportStarMeanings;
window.closeImportModal = closeImportModal;
window.closeImportModalAndRefresh = closeImportModalAndRefresh;

// 在管理界面初始化时添加导入按钮
if (typeof initManagementInterface === 'function') {
    const originalInit = initManagementInterface;
    initManagementInterface = function() {
        originalInit();
        setTimeout(addImportButtonToManagement, 100);
    };
}

