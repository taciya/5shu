// 地支顺序（从寅宫开始顺时针）
const palaceOrder = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

// 宫位ID映射
const palaceIdMap = {
    '寅': '寅宫', '卯': '卯宫', '辰': '辰宫', '巳': '巳宫',
    '午': '午宫', '未': '未宫', '申': '申宫', '酉': '酉宫',
    '戌': '戌宫', '亥': '亥宫', '子': '子宫', '丑': '丑宫'
};

// 四化映射
const sihuaMap = {
    '化禄': '禄',
    '化权': '权',
    '化科': '科',
    '化忌': '忌',

    'lu': '禄',
    'quan': '权',
    'ke': '科',
    'ji': '忌',

    '禄': 'lu',
    '权': 'quan',
    '科': 'ke',
    '忌': 'ji',
};

// 四化样式类
const sihuaClassMap = {
    '化禄': 'sihua-lu',
    '化权': 'sihua-quan',
    '化科': 'sihua-ke',
    '化忌': 'sihua-ji'
};

// 四化箭头类映射
const sihuaArrowClassMap = {
    '禄': 'lu',
    '权': 'quan',
    '科': 'ke',
    '忌': 'ji'
};

// 月份数字与汉字映射表
const monthMap = {
    // 数字到汉字
    numberToHanzi: {
        1: "一月",
        2: "二月",
        3: "三月",
        4: "四月",
        5: "五月",
        6: "六月",
        7: "七月",
        8: "八月",
        9: "九月",
        10: "十月",
        11: "十一月",
        12: "十二月"
    },

    // 汉字到数字
    hanziToNumber: {
        "一月": 1,
        "二月": 2,
        "三月": 3,
        "四月": 4,
        "五月": 5,
        "六月": 6,
        "七月": 7,
        "八月": 8,
        "九月": 9,
        "十月": 10,
        "十一月": 11,
        "十二月": 12
    }
};

// 日期数字与汉字映射表
const dayMap = {
    // 数字到汉字
    numberToHanzi: {
        1: "初一",
        2: "初二",
        3: "初三",
        4: "初四",
        5: "初五",
        6: "初六",
        7: "初七",
        8: "初八",
        9: "初九",
        10: "初十",
        11: "十一",
        12: "十二",
        13: "十三",
        14: "十四",
        15: "十五",
        16: "十六",
        17: "十七",
        18: "十八",
        19: "十九",
        20: "二十",
        21: "廿一",
        22: "廿二",
        23: "廿三",
        24: "廿四",
        25: "廿五",
        26: "廿六",
        27: "廿七",
        28: "廿八",
        29: "廿九",
        30: "三十",
        31: "三十一"
    },

    // 汉字到数字
    hanziToNumber: {
        "初一": 1,
        "初二": 2,
        "初三": 3,
        "初四": 4,
        "初五": 5,
        "初六": 6,
        "初七": 7,
        "初八": 8,
        "初九": 9,
        "初十": 10,
        "十一": 11,
        "十二": 12,
        "十三": 13,
        "十四": 14,
        "十五": 15,
        "十六": 16,
        "十七": 17,
        "十八": 18,
        "十九": 19,
        "二十": 20,
        "廿一": 21,
        "廿二": 22,
        "廿三": 23,
        "廿四": 24,
        "廿五": 25,
        "廿六": 26,
        "廿七": 27,
        "廿八": 28,
        "廿九": 29,
        "三十": 30,
        "三十一": 31
    }
};
const STAR_BRIGHTNESS_TABLE={
    "禄": {"子":35, "丑":50, "寅":30, "卯":30, "辰":50, "巳":20, "午":10, "未":60, "申":90, "酉":99, "戌":80, "亥":60},
    "权": {"子":5, "丑":10, "寅":90, "卯":95, "辰":95, "巳":95, "午":99, "未":90, "申":20, "酉":10, "戌":30, "亥":20},
    "科": {"子":90, "丑":95, "寅":95, "卯":97, "辰":90, "巳":20, "午":10, "未":15, "申":5, "酉":5, "戌":20, "亥":80},
    "忌": {"子":99, "丑":95, "寅":35, "卯":20, "辰":30, "巳":15, "午":5, "未":30, "申":90, "酉":95, "戌":50, "亥":80},
    "lu": {"子":35, "丑":50, "寅":30, "卯":30, "辰":50, "巳":20, "午":10, "未":60, "申":90, "酉":99, "戌":80, "亥":60},
    "quan": {"子":5, "丑":10, "寅":90, "卯":95, "辰":95, "巳":95, "午":99, "未":90, "申":20, "酉":10, "戌":30, "亥":20},
    "ke": {"子":90, "丑":95, "寅":95, "卯":97, "辰":90, "巳":20, "午":10, "未":15, "申":5, "酉":5, "戌":20, "亥":80},
    "ji": {"子":99, "丑":95, "寅":35, "卯":20, "辰":30, "巳":15, "午":5, "未":30, "申":90, "酉":95, "戌":50, "亥":80},
}
// 显示错误消息
function showError(message) {
    // 创建错误消息元素
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.className = 'error-message';
        document.querySelector('.container').appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // 5秒后自动隐藏错误消息
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}
// 命盘信息
feigong_str=''
// 初始化占卜功能
function initDivination() {
    const divinationBtn = document.getElementById('divinationBtn');
    const divinationContent = document.getElementById('divinationContent');

    divinationBtn.addEventListener('click', function() {
        const question = divinationContent.value.trim();
        if (!question) {
            alert('请输入问卦内容');
            return;
        }

        // 获取命主信息
        const name = document.getElementById('name').value || '命主';
        const gender = document.getElementById('gender').value === 'male' ? '男' : '女';
        const birthYear = document.getElementById('birthYear').value;

        // 生成提示内容
        // const promptText = `${name}${gender}，${birthYear}年生，请问：${question}？`;

        // 更新导出文本
        // const exportText = document.getElementById('exportText');
        queryKnowledgeBase(`问卦内容：${question}\n${feigong_str}`);

    });
}
// Markdown渲染函数
function renderMarkdown(content) {
    if (!content) return '';

    try {
        // 安全过滤，防止XSS攻击
        const safeContent = content
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');

        return marked.parse(safeContent);
    } catch (error) {
        console.error('Markdown渲染错误:', error);
        // 如果Markdown解析失败，返回原始文本
        return `<div class="markdown-content"><pre>${content}</pre></div>`;
    }
}
async function queryKnowledgeBase(question) {
    const aiResponse = document.getElementById('aiResponse');
    const responseArea = document.getElementById('responseArea');
    try {

        const response = await fetch('https://shu-service-437366723887.us-central1.run.app/api/v1/query/kb-001', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                top_k: 3,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '查询知识库失败');
        }

        const data = await response.json();
        const aiResponseContent = data.choices[0].message.content;

        // 使用Markdown渲染AI回答
        aiResponse.innerHTML = renderMarkdown(aiResponseContent);
        responseArea.style.display = 'block';


        // 添加复制按钮
        addCopyButton(aiResponseContent);

    } catch (error) {
        console.error('查询知识库失败:', error);
        showError('查询知识库失败: ' + error.message);

        // 添加错误消息到聊天历史
        addMessageToChat('抱歉，查询知识库时出现错误: ' + error.message, 'ai');
    }
}
// 修改添加消息到聊天历史的函数
function addMessageToChat(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    if (sender === 'ai') {
        // AI消息使用Markdown渲染
        const markdownContent = document.createElement('div');
        markdownContent.className = 'markdown-content';
        markdownContent.innerHTML = renderMarkdown(message);
        messageDiv.appendChild(markdownContent);

        // 添加复制按钮
        addCopyButtonToMessage(messageDiv, message);
    } else {
        // 用户消息保持纯文本
        messageDiv.textContent = message;
    }


}
// 添加复制按钮函数
function addCopyButton(content) {
    // 移除已存在的复制按钮
    const existingButton = document.getElementById('copyResponseButton');
    if (existingButton) {
        existingButton.remove();
    }

    const copyButton = document.createElement('button');
    copyButton.id = 'copyResponseButton';
    copyButton.innerHTML = '📋 复制回答';
    copyButton.style.marginTop = '10px';
    copyButton.style.padding = '8px 12px';
    copyButton.style.fontSize = '14px';
    copyButton.style.background = 'var(--success-color)';

    copyButton.onclick = function() {
        copyToClipboard(content);
    };

    aiResponse.parentNode.insertBefore(copyButton, aiResponse.nextSibling);
}
function addCopyButtonToMessage(messageDiv, content) {
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '📋';
    copyButton.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        font-size: 12px;
        opacity: 0.7;
        margin-left: 10px;
        padding: 2px 5px;
    `;

    copyButton.onclick = function(e) {
        e.stopPropagation();
        copyToClipboard(content);

        // 临时显示复制成功提示
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '✅';
        setTimeout(() => {
            copyButton.innerHTML = originalText;
        }, 1000);
    };

    // 将复制按钮添加到消息右下角
    messageDiv.style.position = 'relative';
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        position: absolute;
        bottom: 5px;
        right: 5px;
    `;
    buttonContainer.appendChild(copyButton);
    messageDiv.appendChild(buttonContainer);
}

// 复制到剪贴板函数
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('内容已复制到剪贴板');
    }).catch(err => {
        console.error('复制失败:', err);
        showError('复制失败，请手动选择文本复制');
    });
}
// 渲染命盘
function renderChart(data) {

    // 清空现有宫位
    const chartGrid = document.getElementById('chartGrid');
    if (!chartGrid) {
        showError('找不到命盘网格容器');
        return;
    }
    chartGrid.innerHTML = '';

    // 创建中心区域
    const centerCell = document.createElement('div');
    centerCell.className = 'center-cell';
    const birth = data.birth_info;
    const genderText = birth.gender === 'male' ? '男' : '女';

    // feigong_str=generateFeigongString(); // 生成飞宫字符串

    centerCell.innerHTML = `
        <div class="center-content">
            <div class="center-title">${data.name?data.name:'未命名'}</div>
            <div class="center-title">${data.yin_yang}${genderText} ${data.wuxingju}</div>
            <div class="center-content">            
                <div class="center-info">真太阳时：${birth.true_solar_time}</div>
                <div class="center-info">农历时间：${birth.gan_zhi}年${monthMap.numberToHanzi[birth.month]}${dayMap.numberToHanzi[birth.day]} ${data.shichen}</div>
            </div>            
            <div class="center-info center">
                <span class="sizhu">${data.sizhu_bagua['年柱']}</span>
                <span class="sizhu" >${data.sizhu_bagua['月柱']} </span>
                <span class="sizhu" >${data.sizhu_bagua['日柱']} </span>
                <span class="sizhu" >${data.sizhu_bagua['时柱']} </span>
                <span class="sizhu" >${data.sizhu_bagua['八卦']} </span>
            </div>
            <div class="center-info center">
                命    主：${data.mingzhu} 身    主：${data.shenzhu}
            </div>
            <div class="center-info center">
                对宫化入<span class="xiangxin-sihua-arrow"></span>
                本宫自化 <span class="lixin-sihua-arrow"></span>
            </div>

            <div class="control-group dayun-group" style="position: absolute; bottom: 10px; left: 5px;">
                <label for="dayunSelector">大运</label>
                <select id="dayunSelector" class="control-select"></select>
            </div>

            <div class="control-group liunian-group" style="position: absolute; bottom: 10px; right: 5px;">
                <label for="liunianSelector">流年</label>
                <select id="liunianSelector" class="control-select" disabled></select>
            </div>

        </div>

    `;

    chartGrid.appendChild(centerCell);

    // 创建十二宫
    if (data.palaces && Array.isArray(data.palaces)) {
        data.palaces.forEach(palace => {
            const palaceElement = createPalaceElement(palace,data.three_level_hexagram);
            if (palaceElement) {
                chartGrid.appendChild(palaceElement);
            }
        });
        // data.palaces.forEach(palace => {
        //     findSihuaTracking(palace);
        // });

    } else {
        showError('数据格式错误：缺少宫位信息');
    }
    
    initFlySihua(data.feigong_map);

    // 添加大运/流年选择器
    const dayunSelector = document.getElementById('dayunSelector');
    const liunianSelector = document.getElementById('liunianSelector');
    
    // 收集所有age_range（去重排序）
    const ageRanges = [...new Set(data.palaces.map(p => p.age_range))]
        .filter(Boolean)
        .sort((a, b) => parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]));
    
    // 填充大运选项
    dayunSelector.innerHTML = '<option value="">大运</option>';
    ageRanges.forEach(range => {
        const option = document.createElement('option');
        option.value = range;
        option.textContent = range;
        dayunSelector.appendChild(option);
    });
    
    // 大运选择事件
    dayunSelector.addEventListener('change', function() {
        const selectedRange = this.value;
        // 核心改进：选中默认选项（value=""）时，清空所有大运信息与显示
        if (!selectedRange) {
            clearDayunDisplays();   // 清空大运名称与四化星曜
            clearLiunianDisplays(); // 清空流年选项与名称
            return;
        }
        clearLiunianDisplays(); // 清空流年选项与名称
        // 1. 找到对应大运宫位
        const dayunPalace = data.palaces.find(p => p.age_range === selectedRange);
        if (!dayunPalace) return;
        
        // 2. 在宫位名称上方显示"大X"名
        updatePalaceDayunName(data, dayunPalace);
        // console.log('选中的大运宫位:', dayunPalace);
        // 3. 生成大运四化（根据宫位天干）
        generateDayunSihua(data,dayunPalace);
        
        // 4. 生成流年选项（10年范围）
        generateLiunianOptions(dayunPalace, data.birth_info.year);
    });
    
    // 流年选择事件
    liunianSelector.addEventListener('change', function() {
        const selectedYear = parseInt(this.value);
        
        // 核心改进：选中空白时清空流年所有信息
        if (!selectedYear) {
            clearLiunianDisplays(); // 调用清空函数（见下文）
            return;
        }
        
        // 原有逻辑：选中有效流年时生成流年信息
        const liunianPalace = calculateLiunianPalace(data, selectedYear);
        if (!liunianPalace) return;
        
        updatePalaceLiunianName(data, liunianPalace); // 更新流年名称
        generateLiunianSihua(data, selectedYear, liunianPalace); // 生成流年四化（新增selectedYear参数）
    });    

}

function generateFeigongString() {

    // 1. 获取DOM元素（天地显化层）
    const neirong = document.querySelector('.center-title'); // 获取命主名称元素
    const dayunSelector = document.getElementById('dayunSelector');
    const liunianSelector = document.getElementById('liunianSelector');
    const palaces = document.querySelectorAll('.palace'); // 所有宫位元素

    // 2. 提取大运信息（若选中）
    let dayunInfo = '未选';
    if (dayunSelector.value) {
        const selectedRange = dayunSelector.value;
        // 遍历宫位元素，找到age_range匹配的宫位
        const dayunPalace = Array.from(palaces).find(p => {
            const ageRangeEl = p.querySelector('.age-range'); // 假设年龄范围元素有.age-range类
            return ageRangeEl && ageRangeEl.textContent === selectedRange;
        });
        if (dayunPalace) {
            const name = dayunPalace.querySelector('.palace-name').textContent.trim();
            const dizhi = dayunPalace.id.replace('宫', ''); // 假设宫位id为“寅宫”格式
            const ganzhi = dayunPalace.querySelector('.ganzhi').textContent.trim();
            dayunInfo = `${name}宫（${ganzhi}）<${selectedRange}>`;
        }
    }

    // 3. 提取流年信息（若选中）
    let liunianStr = '未选';
    if (liunianSelector.value) {
        const selectedYear = liunianSelector.value;
        // 遍历宫位元素，找到地支匹配的宫位（流年地支=宫位id地支）
        const liunianPalace = Array.from(palaces).find(p => {
            const dizhi = p.id.replace('宫', '');
            return getLiunianGZ(selectedYear).zhi === dizhi; // 用流年地支匹配宫位
        });
        if (liunianPalace) {
            const name = liunianPalace.querySelector('.palace-name').textContent.trim();
            const dizhi = liunianPalace.id.replace('宫', '');
            const ganzhi = liunianPalace.querySelector('.ganzhi').textContent.trim();
            liunianStr = `${name}宫（${ganzhi}）`;
        }
    }

    // 4. 生成fullContent（完全基于DOM显化内容）
    let fullContent = "";
    if (dayunInfo !== '未选') {
        fullContent += `问卦占命：${neirong.textContent.trim()}\n`;
        fullContent += `基本信息：来因宫=${getLaiyinPalace(palaces).isLaiyin.trim()} , 大运=${dayunInfo || '未找到'} , 流年=${liunianStr || '未找到'} , 当前年份=${new Date().getFullYear()}\n`;
    } else {
        fullContent += `问卦占事：${neirong.textContent.trim()}\n`;
        fullContent += `三层卦象：主卦(${getLaiyinPalace(palaces).isLaiyin.trim()})，十分卦(${getShifenPalace(palaces).isShifen.trim()})，分钟卦(${getFenzhongPalace(palaces).isFenzhong.trim()})\n`;
    }
    fullContent += `命盘信息：\n`;
    return fullContent;
}
function getLaiyinPalace(palaces) {
    // 1. 遍历宫位集合，查找isLaiyin属性不为空的宫位（天地显化层）
    const laiyinPalace = Array.from(palaces).find(palace => {
        // 检查isLaiyin属性是否存在且不为空（来因宫的标记）
        return palace.isLaiyin && palace.isLaiyin !== "";
    });

    // 2. 裁断结论（天地规则）：
    //    - 若找到标记为来因宫的宫位，返回其DOM元素（来源：palace.isLaiyin属性）
    //    - 若未找到，返回第一个宫位（默认来因宫，来源：palaces[0]）或null（无宫位时）
    return laiyinPalace || (palaces.length > 0 ? palaces[0] : null);
}
function getShifenPalace(palaces) {
    // 1. 遍历宫位集合，查找isLaiyin属性不为空的宫位（天地显化层）
    const laiyinPalace = Array.from(palaces).find(palace => {
        // 检查isLaiyin属性是否存在且不为空（来因宫的标记）
        return palace.isShifen && palace.isShifen !== "";
    });

    // 2. 裁断结论（天地规则）：
    //    - 若找到标记为来因宫的宫位，返回其DOM元素（来源：palace.isLaiyin属性）
    //    - 若未找到，返回第一个宫位（默认来因宫，来源：palaces[0]）或null（无宫位时）
    return laiyinPalace || (palaces.length > 0 ? palaces[0] : null);
}
function getFenzhongPalace(palaces) {
    // 1. 遍历宫位集合，查找isLaiyin属性不为空的宫位（天地显化层）
    const laiyinPalace = Array.from(palaces).find(palace => {
        // 检查isLaiyin属性是否存在且不为空（来因宫的标记）
        return palace.isFenzhong && palace.isFenzhong !== "";
    });

    // 2. 裁断结论（天地规则）：
    //    - 若找到标记为来因宫的宫位，返回其DOM元素（来源：palace.isLaiyin属性）
    //    - 若未找到，返回第一个宫位（默认来因宫，来源：palaces[0]）或null（无宫位时）
    return laiyinPalace || (palaces.length > 0 ? palaces[0] : null);
}
function getDayunPalace(palaces) {
    const laiyinPalace = Array.from(palaces).find(palace => {
        return palace.dayunName=="大运命宫"  && palace.dayunName  !== "";
    });
    return laiyinPalace || (palaces.length > 0 ? palaces[0] : null);
}
function getLiunianPalace(palaces) {
    const laiyinPalace = Array.from(palaces).find(palace => {
        return palace.liunianName=="流年命宫"  && palace.liunianName  !== "";
    });
    return laiyinPalace || (palaces.length > 0 ? palaces[0] : null);
}
/**
 * 精确计算流年干支
 * 基准：2026年为丙午年
 */
function getLiunianGZ(targetYear) {
    const gans = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const zhis = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

    // 2026年是丙午年
    // 天干：丙在 gans 索引为 2
    // 地支：午在 zhis 索引为 6
    
    // 计算天干索引：(targetYear - 2026 + 2) % 10，考虑负数加10
    let ganIdx = (targetYear - 2026 + 2) % 10;
    if (ganIdx < 0) ganIdx += 10;

    // 计算地支索引：(targetYear - 2026 + 6) % 12，考虑负数加12
    let zhiIdx = (targetYear - 2026 + 6) % 12;
    if (zhiIdx < 0) zhiIdx += 12;

    return {
        gan: gans[ganIdx],
        zhi: zhis[zhiIdx],
        gz: gans[ganIdx] + zhis[zhiIdx]
    };
}
// 查找星曜
function findStarByName(palaces, starName) {
    if (!palaces || !Array.isArray(palaces)) return null;

    for (const palace of palaces) {
        if (palace.minor_stars && Array.isArray(palace.minor_stars)) {
            for (const star of palace.minor_stars) {
                if (star.includes(starName)) {
                    return star.replace(/\(.*?\)/g, '').trim();
                }
            }
        }

        if (palace.xiaoxing_stars && Array.isArray(palace.xiaoxing_stars)) {
            for (const star of palace.xiaoxing_stars) {
                if (star.includes(starName)) {
                    return star.replace(/\(.*?\)/g, '').trim();
                }
            }
        }

        if (palace.shensha_stars && Array.isArray(palace.shensha_stars)) {
            for (const star of palace.shensha_stars) {
                if (star.includes(starName)) {
                    return star.replace(/\(.*?\)/g, '').trim();
                }
            }
        }
    }
    return null;
}

// 创建宫位元素
function createPalaceElement(palace,three_level_hexagram) {
    if (!palace) return null;

    const palaceElement = document.createElement('div');
    palaceElement.className = 'palace';
    palaceElement.id = palaceIdMap[palace.dizhi] || '';
    // 初始化CSS变量
    palaceElement.style.setProperty('--main-stars-width', '0px');
    palaceElement.style.setProperty('--minor-stars-width', '0px');
    // 主星
    const mainStarsContainer = document.createElement('div');
    init_ResizeObserver(mainStarsContainer);
    mainStarsContainer.className = 'main-stars-container';
    mainStarsContainer.id=palace.dizhi+'mainStars';
    if (palace.main_stars && Array.isArray(palace.main_stars)) {
        palace.main_stars.forEach(star => {
            const starUnit = document.createElement('div');
            starUnit.className = 'star-unit';

            const mainStar = document.createElement('span');
            mainStar.className = 'main-star';
            mainStar.textContent = star;
            starUnit.appendChild(mainStar);

            // 添加亮度显示
            addBrightnessToStar(starUnit, star, palace, 'main');
            // 添加四化标记
            addSihuaToStar(starUnit, star, palace);

            mainStarsContainer.appendChild(starUnit);
        });
    }
    palaceElement.appendChild(mainStarsContainer);

    const jixing=['文昌','文曲','左辅','右弼','天魁','天钺','禄存','天马']
    const xiongxing=['地空','地劫','火星','铃星','擎羊','陀罗']
    // 辅星 - 紧贴主星右侧显示
    const minorStarsContainer = document.createElement('div');
    minorStarsContainer.className = 'minor-stars-container';
    minorStarsContainer.id=palace.dizhi+'minorStars';
    if (palace.minor_stars && Array.isArray(palace.minor_stars)) {
        palace.minor_stars.forEach(star => {
            const minorStar = document.createElement('div');
            minorStar.className = 'star-unit'; //minor-star
            // 添加文本包装
            const starText = document.createElement('span');

            if(jixing.includes(star)){
                starText.className = 'minor-star lucky';
            }else if(xiongxing.includes(star)){
                starText.className = 'minor-star unlucky';
            }else{
                starText.className = 'minor-star';
            }
            starText.textContent = star.replace(/\(.*?\)/g, '').trim();
            minorStar.appendChild(starText);

            // 添加亮度显示
            addBrightnessToStar(minorStar, star.replace(/\(.*?\)/g, '').trim(), palace, 'minor');
            // 添加四化标记
            addSihuaToStar(minorStar, star, palace);

            minorStarsContainer.appendChild(minorStar);
        });
    }
    palaceElement.appendChild(minorStarsContainer);

    // 小星 - 使用原来minor_stars的样式
    const xiaoxingStarsContainer = document.createElement('div');
    xiaoxingStarsContainer.className = 'xiaoxing-stars-container';
    if (palace.xiaoxing_stars && Array.isArray(palace.xiaoxing_stars)) {
        palace.xiaoxing_stars.forEach(star => {
            const xiaoxingStar = document.createElement('div');
            xiaoxingStar.className = 'xiaoxing-star';
            xiaoxingStar.textContent = star.replace(/\(.*?\)/g, '').trim();
            xiaoxingStarsContainer.appendChild(xiaoxingStar);
        });
    }
    palaceElement.appendChild(xiaoxingStarsContainer);

    // 神煞星
    const shenshaContainer = document.createElement('div');
    shenshaContainer.className = 'shensha-container';
    if (palace.shensha_stars && Array.isArray(palace.shensha_stars)) {
        palace.shensha_stars.forEach(star => {
            const shenshaStar = document.createElement('div');
            shenshaStar.className = 'shensha-star';
            shenshaStar.textContent = star;
            shenshaContainer.appendChild(shenshaStar);
        });
    }
    palaceElement.appendChild(shenshaContainer);

    // 长生十二神
    const changshengContainer = document.createElement('div');
    changshengContainer.className = 'changsheng-container';
    if (palace.changsheng_stars && Array.isArray(palace.changsheng_stars)) {
        palace.changsheng_stars.forEach(star => {
            const changshengStar = document.createElement('div');
            changshengStar.className = 'changsheng-star';
            changshengStar.textContent = star;
            changshengContainer.appendChild(changshengStar);
        });
    }
    palaceElement.appendChild(changshengContainer);

    // 创建身宫标记
    if (palace.shengong_flg) {
        const shenggongMark = document.createElement('div');
        shenggongMark.className = 'shengong-mark';
        shenggongMark.textContent = '身';
        palaceElement.appendChild(shenggongMark);
    }

    // 创建卦象标记
    palaceElement.isLaiyin = ""; // 标记来因宫
    palaceElement.isShifen = ""; // 标记十分卦
    palaceElement.isFenzhong = ""; // 标记分钟卦
    palaceElement.dayunName = ""; // 标记大运名称
    palaceElement.liunianName = ""; // 标记流年名称
    if (palace.name === three_level_hexagram['main_hexagram']) {

        const laiyinMark = document.createElement('div');
        laiyinMark.className = 'laiyin-mark zhu';
        laiyinMark.textContent = '因';
        palaceElement.isLaiyin = palace.name; // 标记来因宫
        palaceElement.appendChild(laiyinMark);

    }
    if (palace.name === three_level_hexagram['second_hexagram']) {

        const laiyinMark = document.createElement('div');
        laiyinMark.className = 'laiyin-mark ci';
        laiyinMark.textContent = '2';
        palaceElement.isShifen = palace.name; // 标记十分卦
        palaceElement.appendChild(laiyinMark);

    }
    if (palace.name === three_level_hexagram['third_hexagram']) {

        const laiyinMark = document.createElement('div');
        laiyinMark.className = 'laiyin-mark san';
        laiyinMark.textContent = '3';
        palaceElement.isFenzhong = palace.name; // 标记分钟卦
        palaceElement.appendChild(laiyinMark);

    }


    const ages = document.createElement('div');
    ages.className = 'ages';
    ages.textContent = palace.ages;
    palaceElement.appendChild(ages);

    // 宫位底部信息
    const palaceFooter = document.createElement('div');
    palaceFooter.className = 'palace-footer';

    const ganzhi = document.createElement('div');
    ganzhi.className = 'ganzhi';
    const ganzhiSpan = document.createElement('span');
    ganzhiSpan.textContent = palace.gan + palace.dizhi;
    ganzhi.appendChild(ganzhiSpan);

    const palaceName = document.createElement('div');
    palaceName.className = 'palace-name';
    palaceName.textContent = palace.name.replace ('宫', '');

    const ageRange = document.createElement('div');
    ageRange.className = 'age-range';
    ageRange.textContent = palace.age_range;



    palaceFooter.appendChild(ganzhi);
    palaceFooter.appendChild(palaceName);
    palaceFooter.appendChild(ageRange);


    palaceElement.appendChild(palaceFooter);


    return palaceElement;
}

// 添加星曜亮度的方法
    //   "main_stars_brightness": {
    //     "天机": "庙"
    //   },
    //   "minor_stars_brightness": {}
// 添加星曜亮度显示
function addBrightnessToStar(starElement, starName, palace, starType) {
    // 确定亮度映射
    const brightnessMap = starType === 'main' ? palace.main_stars_brightness : palace.minor_stars_brightness;

    if (brightnessMap && brightnessMap[starName]) {
        const brightness = brightnessMap[starName];

        // 创建亮度容器
        const brightnessContainer = document.createElement('div');
        brightnessContainer.className = 'brightness-container';
        brightnessContainer.textContent = brightness;

        // 添加到星曜元素
        starElement.appendChild(brightnessContainer);
    }
}

// 添加四化标记到星曜
function addSihuaToStar(starUnit, starName, palace) {
    if (!palace) return;

    // 创建一个容器用于存放所有四化标记（包括箭头）
    const sihuaContainer = document.createElement('div');
    sihuaContainer.className = 'sihua-container';

    // 处理普通四化
    if (palace.sihua && Array.isArray(palace.sihua)) {
        palace.sihua.forEach(sihua => {
            if (sihua.includes(starName)) {
                const sihuaType = sihua.replace(starName, '');
                const sihuaMark = document.createElement('span');
                sihuaMark.className = `sihua ${sihuaClassMap[sihuaType]}`;
                sihuaMark.textContent = sihuaMap[sihuaType];
                sihuaContainer.appendChild(sihuaMark);
            }
        });
    }

    // 处理向心四化
    if (palace.xiangxin_sihua && Array.isArray(palace.xiangxin_sihua)) {
        palace.xiangxin_sihua.forEach(sihua => {
            // 从四化字符串中提取星曜名和四化类型
            const matches = sihua.match(/(.*?)<(禄|权|科|忌).+%>/);
            if (matches && matches.length === 3 && matches[1] === starName) {
                const sihuaType = matches[2];
                const arrow = document.createElement('div');
                arrow.className = `sihua-arrow xiangxin-sihua-arrow ${sihuaArrowClassMap[sihuaType]}`;
                arrow.title = `${starName}${sihuaType}`;
                sihuaContainer.appendChild(arrow);
            }
        });
    }

    // 处理离心四化
    if (palace.lixin_sihua && Array.isArray(palace.lixin_sihua)) {
        palace.lixin_sihua.forEach(sihua => {
            // 从四化字符串中提取星曜名和四化类型
            const matches = sihua.match(/(.*?)<(禄|权|科|忌).+%>/);
            if (matches && matches.length === 3 && matches[1] === starName) {
                const sihuaType = matches[2];
                const arrow = document.createElement('div');
                arrow.className = `sihua-arrow lixin-sihua-arrow ${sihuaArrowClassMap[sihuaType]}`;
                arrow.title = `${starName}${sihuaType}`;
                sihuaContainer.appendChild(arrow);
            }
        });
    }

    // 将四化容器添加到星曜单元
    if (sihuaContainer.children.length > 0) {
        starUnit.appendChild(sihuaContainer);
    }

}


document.addEventListener('DOMContentLoaded', function() {
    // 获取按钮元素
    const toggleLuBtn = document.getElementById('toggleLu');
    const toggleQuanBtn = document.getElementById('toggleQuan');
    const toggleKeBtn = document.getElementById('toggleKe');
    const toggleJiBtn = document.getElementById('toggleJi');
    const toggleSihuaBtn = document.getElementById('toggleSihua'); // 新增总切换按钮

    const toggleBtns = ['toggleLu', 'toggleQuan', 'toggleKe', 'toggleJi'];

    // 初始化状态
    let luVisible = true;
    let quanVisible = true;
    let keVisible = true;
    let jiVisible = true;
    let allSihuaVisible = true; // 新增总状态

    // 辅助函数：切换单个四化类型的显示状态
    function toggleSihuaType(type, visible) {
        const selectorMap = {
            'lu': '.sihua-lu, .xiangxin-sihua-arrow.lu, .lixin-sihua-arrow.lu',
            'quan': '.sihua-quan, .xiangxin-sihua-arrow.quan, .lixin-sihua-arrow.quan',
            'ke': '.sihua-ke, .xiangxin-sihua-arrow.ke, .lixin-sihua-arrow.ke',
            'ji': '.sihua-ji, .xiangxin-sihua-arrow.ji, .lixin-sihua-arrow.ji'
        };

        const elements = document.querySelectorAll(selectorMap[type]);
        const button = document.getElementById(`toggle${type.charAt(0).toUpperCase() + type.slice(1)}`);

        elements.forEach(el => {
            if (toggleBtns.includes(el.parentElement?.id)) {
                if (visible) {
                    button.classList.remove('sihua-gray');
                } else {
                    button.classList.add('sihua-gray');
                }
                return;
            }

            if (visible) {
                el.classList.remove('sihua-hidden');
            } else {
                el.classList.add('sihua-hidden');
            }
        });
        // 新增：切换四化符号文本颜色
        const sihuaTexts = document.querySelectorAll(`.sihua-symbols text`);
        sihuaTexts.forEach(text => {
            if (text.textContent === sihuaMap[type]) {
                if (visible) {
                    text.classList.remove('gray-text');
                    text.classList.add('white-text');
                } else {
                    text.classList.remove('white-text');
                    text.classList.add('gray-text');
                }
            }
        });
    }

    // 辅助函数：切换所有四化类型的显示状态
    function toggleAllSihua(visible) {
        luVisible = visible;
        quanVisible = visible;
        keVisible = visible;
        jiVisible = visible;
        allSihuaVisible = visible;

        // 更新所有按钮状态
        toggleSihuaType('lu', visible);
        toggleSihuaType('quan', visible);
        toggleSihuaType('ke', visible);
        toggleSihuaType('ji', visible);

        // 更新总切换按钮状态
        if (visible) {
            toggleSihuaBtn.classList.remove('sihua-gray');
        } else {
            toggleSihuaBtn.classList.add('sihua-gray');
        }

        // 新增：切换所有四化符号文本颜色
        const sihuaTexts = document.querySelectorAll('.sihua-symbols text');
        sihuaTexts.forEach(text => {
            if (visible) {
                text.classList.remove('gray-text');
                text.classList.add('white-text');
            } else {
                text.classList.remove('white-text');
                text.classList.add('gray-text');
            }
        });
    }

    // 单个四化类型切换事件
    toggleLuBtn.addEventListener('click', function() {
        luVisible = !luVisible;
        toggleSihuaType('lu', luVisible);
    });

    toggleQuanBtn.addEventListener('click', function() {
        quanVisible = !quanVisible;
        toggleSihuaType('quan', quanVisible);
    });

    toggleKeBtn.addEventListener('click', function() {
        keVisible = !keVisible;
        toggleSihuaType('ke', keVisible);
    });

    toggleJiBtn.addEventListener('click', function() {
        jiVisible = !jiVisible;
        toggleSihuaType('ji', jiVisible);
    });

    // 总切换按钮事件 - 新增
    toggleSihuaBtn.addEventListener('click', function() {
        allSihuaVisible = !allSihuaVisible;
        toggleAllSihua(allSihuaVisible);
    });

});



// 自动获取容器尺寸并更新辅星位置
// 初始化函数
function init_ResizeObserver(mainStarsContainer) {
    // 创建ResizeObserver实例
    let resizeObserver;
    // 创建ResizeObserver
    resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            // 当主星容器尺寸变化时更新辅星位置
            updateMinorStarsPosition(entry.target);
        }
    });

    // 开始观察主星容器
    resizeObserver.observe(mainStarsContainer);

    // 初始更新
    // updateMinorStarsPosition(mainStarsContainer);
}
// 更新辅星位置
function updateMinorStarsPosition(mainStarsContainer) {
    // 获取主星容器宽度
    const minorStarsID=mainStarsContainer.id.replace('mainStars','minorStars');
    //
    const width = mainStarsContainer.offsetWidth+2;

    // 设置CSS变量
    document.getElementById(minorStarsID).style.setProperty('--main-stars-width', `${width}px`);
}

// 宫位飞四化高亮与连接功能实现

// 当前选中的宫位
let selectedPalace = null;

            // 增加 立太极 以后的12宫相对位置
            // 新宫位名称顺序（逆时针）
            const newPalaceNames = ['命', '兄', '夫', '子', '财', '疾', '迁', '友', '官', '田', '福', '父'];

            // 获取当前选择显示元素
            const currentSelection = document.getElementById('currentSelection');

// 初始化功能
function initFlySihua(feigong_map) {
    // 为所有宫位添加点击事件
    document.querySelectorAll('.palace').forEach(palace => {
        palace.addEventListener('click', function() {
            // 移除之前的高亮
            document.querySelectorAll('.palace.source-highlighted, .palace.target-highlighted').forEach(el => {
                el.classList.remove('source-highlighted', 'target-highlighted');
            });
            // 清除连接线
            clearConnectionLines();
            clearTrackingMarks(); // 新增：清除追踪标记

            // 设置当前高亮（源宫位）
            this.classList.add('source-highlighted');
            if (this === selectedPalace) {
                // 如果点击的是已经选中的宫位，则取消选择
                selectedPalace = null;
                return;
            }
            selectedPalace = this;

            // 获取宫位名称
            const palaceName = this.dataset.palace || this.id.replace('宫', '');

            // 获取飞四化信息
            const flySihua = feigong_map[palaceName];

            if (flySihua) {
                // 绘制飞四化连接线
                drawFlySihuaConnections(palaceName, flySihua);
            }
// ////////////////////////////////////////////// 增加 立太极 以后的12宫相对位置
            // 获取点击宫位的地支
            const dizhi = this.id.replace('宫', '');

            // 更新宫位名称
            // updatePalaceNames(dizhi);

            // 新增：显示四化来源追踪
            showSihuaTracking(palaceName);

        });
    });
}
// 增加 立太极 以后的12宫相对位置
function updatePalaceNames(startDizhi) {
    // 找到起始宫位在顺序中的索引
    const startIndex = palaceOrder.indexOf(startDizhi);
    if (startIndex === -1) return;

    // 移除之前添加的新名称元素
    document.querySelectorAll('.new-palace-name').forEach(el => el.remove());

    // 为每个宫位计算新名称
    palaceOrder.forEach((dizhi, index) => {
        // 计算新名称的索引（逆时针顺序）
        let newIndex = (startIndex-index   + 12) % 12;

        // 获取宫位元素
        const palaceElement = document.getElementById(dizhi + '宫');
        if (!palaceElement) return;

        // 获取宫位名称元素
        const palaceNameElement = palaceElement.querySelector('.ages');
        if (!palaceNameElement) return;

        // 创建新名称元素
        const newNameElement = document.createElement('div');
        newNameElement.className = 'new-palace-name';
        newNameElement.textContent = newPalaceNames[newIndex];

        // 添加到宫位名称元素中
        palaceNameElement.appendChild(newNameElement);
    });
}

// 绘制飞四化连接线
function drawFlySihuaConnections(sourcePalace, flySihua) {
    const svg = document.getElementById('connection-lines');
    const sourceElement = document.getElementById(sourcePalace + '宫');

    // 获取源宫位中心位置
    const sourceRect = sourceElement.getBoundingClientRect();
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const sourceCenterX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2 - containerRect.top;

    // 为每种四化绘制连接线
    for (const [sihuaType, info] of Object.entries(flySihua)) {
        if (sihuaType === 'palace_name') continue; // 跳过宫名属性

        const targetPalace = info.target;
        const targetStar = info.star;
        const targetElement = document.getElementById(targetPalace + '宫');

        if (targetElement) {
            // 获取目标宫位中具体星曜的位置
            const starElement = findStarElement(targetElement, targetStar);
            let targetX, targetY;

            if (starElement) {
                const starRect = starElement.getBoundingClientRect();
                targetX = starRect.left + starRect.width / 2 - containerRect.left;
                targetY = starRect.top + starRect.height / 2 - containerRect.top;
            } else {
                // 如果找不到具体星曜，使用宫位中心
                const targetRect = targetElement.getBoundingClientRect();
                targetX = targetRect.left + targetRect.width / 2 - containerRect.left;
                targetY = targetRect.top + targetRect.height / 2 - containerRect.top ;
            }
            targetY=targetY-21; // 上移18像素以避免遮挡星曜
            // 创建SVG连接线
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'connection-line');
            line.setAttribute('x1', sourceCenterX);
            line.setAttribute('y1', sourceCenterY);
            line.setAttribute('x2', targetX);
            line.setAttribute('y2', targetY);
            line.setAttribute('stroke', getSihuaColor(sihuaType));

            // 创建起点圆点
            const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            startDot.setAttribute('class', 'connection-dot');
            startDot.setAttribute('cx', sourceCenterX);
            startDot.setAttribute('cy', sourceCenterY);

            const taiji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            taiji.setAttribute('class', 'taiji');
            taiji.setAttribute('x', sourceCenterX );
            taiji.setAttribute('y', sourceCenterY+1);
            taiji.textContent = `☯`;
            taiji.setAttribute('fill', '#FFFFFF');

            // 创建终点圆点
            const endDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            endDot.setAttribute('class', `connection-dot end ${sihuaType.toLowerCase()}`);
            endDot.setAttribute('cx', targetX);
            endDot.setAttribute('cy', targetY);

            // console.log(`绘制连接线: connection-dot end ${sihuaType.toLowerCase()}`);
            // 创建标签
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('class', 'connection-label');
            // 标签位置计算 中线
            // const midX = (sourceCenterX + targetX) / 2;
            // const midY = (sourceCenterY + targetY) / 2;
            // const offset = 15; // 标签偏移量
            // 标签位置计算 终点
            const midX = targetX
            const midY = targetY
            const offset = 0; // 标签偏移量
            // 根据连接线角度调整标签位置
            // const angle = Math.atan2(targetY - sourceCenterY, targetX - sourceCenterX);
            // label.setAttribute('x', midX + Math.sin(angle) * offset );
            // label.setAttribute('y', midY - Math.cos(angle) * offset);
            label.setAttribute('x', midX-1 );
            label.setAttribute('y', midY + offset);
            // label.textContent = `${sihuaType}→${targetStar}`;
            label.textContent = `${STAR_BRIGHTNESS_TABLE[sihuaType][targetPalace]}`;
            // label.setAttribute('stroke', getSihuaColor(sihuaType));
            label.setAttribute('fill', '#FFFFFF');

            const labelRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            labelRect.setAttribute('class', 'connection-label-bg');
            const rectWidth = 13;
            const rectHeight = 10;
            labelRect.setAttribute('x', midX - rectWidth / 2-1); // 居中
            labelRect.setAttribute('y', midY + offset - rectHeight / 2-1); // 垂直居中
            labelRect.setAttribute('width', rectWidth);
            labelRect.setAttribute('height', rectHeight);
            labelRect.setAttribute('rx', '2'); // 圆角
            labelRect.setAttribute('fill', getSihuaColor(sihuaType)); //背景颜色 '#f9f3e9'
            // labelRect.setAttribute('stroke', getSihuaColor(sihuaType)); // 深棕色边框
            // labelRect.setAttribute('stroke-width', '1'); // 边框宽度

            // 添加到SVG
            svg.appendChild(line);
            svg.appendChild(startDot);
            svg.appendChild(taiji);
            svg.appendChild(endDot);
            svg.appendChild(labelRect);
            svg.appendChild(label);

            // 高亮目标宫位（目标高亮样式）
            targetElement.classList.add('target-highlighted');
        }
    }
}

// 根据四化类型获取颜色
function getSihuaColor(type) {
    const colors = {
        '禄': '#035a24',
        '权': '#430450',
        '科': '#4169e1',
        '忌': '#ff0a0a'
    };
    return colors[type] || '#8b4513';
}

// 在宫位中查找具体星曜元素
function findStarElement(palaceElement, starName) {
    // 在主星中查找
    const mainStars = palaceElement.querySelectorAll('.main-star');
    for (const star of mainStars) {
        if (star.textContent.includes(starName)) {
            return star;
        }
    }

    // 在辅星中查找
    const minorStars = palaceElement.querySelectorAll('.minor-star');
    for (const star of minorStars) {
        if (star.textContent.includes(starName)) {
            return star;
        }
    }

    // 在四化标记中查找
    const sihuaMarks = palaceElement.querySelectorAll('.sihua');
    for (const mark of sihuaMarks) {
        if (mark.textContent.includes(starName)) {
            return mark;
        }
    }

    return null;
}

// 清除所有连接线
function clearConnectionLines() {
    const svg = document.getElementById('connection-lines');
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
}

// 命盘信息导出
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportBtn');
    const exportModal = document.getElementById('exportModal');
    const closeBtn = document.querySelector('.close-btn');
    const copyBtn = document.getElementById('copyBtn');
    const exportText = document.getElementById('exportText');

    // 导出按钮点击事件
    exportBtn.addEventListener('click', async function() {
        const exportBtn = this;
        const originalText = exportBtn.textContent;
        // 填充文本内容
        // exportText.textContent = feigong_str;
        // 显示模态框
        // exportModal.style.display = 'flex';
        // initDivination(); //todo
        const clipboardHelper = new ClipboardHelper();
        try {
            // 显示加载状态
            exportBtn.textContent = '生成中...';
            exportBtn.disabled = true;

            let passwordInfo;
            
            // 检查今天是否已经验证过
            if (isPasswordVerifiedToday()) {
                // 自动使用当前日期的密码
                passwordInfo = {
                    password: getCurrentMMDDPassword(),
                    remember: true,
                    autoFilled: true
                };
            } else {
                // 显示密码输入模态框
                passwordInfo = await showPasswordModalWithMemory();
                
                if (!passwordInfo) {
                    // 用户取消输入
                    exportBtn.textContent = originalText;
                    exportBtn.disabled = false;
                    return;
                }
            }


            // // 第一步：弹出密码输入框
            // const password = await showPasswordModal();

            // if (!password) {
            //     // 用户取消输入
            //     exportBtn.textContent = originalText;
            //     exportBtn.disabled = false;
            //     return;
            // }
            const year = parseInt(document.getElementById('birthYear').value);
            const month = parseInt(document.getElementById('birthMonth').value);
            const day = parseInt(document.getElementById('birthDay').value);
            const hour = parseInt(document.getElementById('birthHour').value);
            const minute = parseInt(document.getElementById('birthMinute').value);
            const birthPlace = document.getElementById('birthPlace').value;
            
            // // 将小时和分钟合并为小数小时格式，保持向后兼容
            const decimalHour = hour + minute / 60;
            
            // // 计算真太阳时（包含日期）
            const trueSolarTime = calculateTrueSolarTime(year, month, day, hour, minute, birthPlace);            

            // 获取当前命盘参数
            const chartParams = {
                birthYear: trueSolarTime.year,
                birthMonth: trueSolarTime.month,
                birthDay: trueSolarTime.day,
                birthHour: trueSolarTime.hour, 
                birthMinute: trueSolarTime.minute, 
                birthHour_decimal: decimalHour, // 保持小数小时格式
                birthPlace: birthPlace,
                password: passwordInfo.password
            };
            
            // 验证必填参数
            if (!chartParams.birthYear || !chartParams.birthMonth || !chartParams.birthDay) {
                throw new Error('请先输入完整的出生信息');
            }
            
            // 向服务器发送请求获取feigong_str          
            const response=await fetch(getApiBaseUrl()+`/export_feigong`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chartParams)
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || '服务器返回错误');
            }

            // 密码验证成功，如果用户选择了"记住"，则标记今天已验证
            if (passwordInfo.remember && !passwordInfo.autoFilled) {
                markPasswordVerifiedToday(chartParams.password);
            }

            // 添加问卦编号头信息
            const yyyymmddhhmm = "问卦编号：" +
                (chartParams.birthYear+"").padStart(4, '0') + "-" +
                (chartParams.birthMonth+"").padStart(2, '0') + "-" +
                (chartParams.birthDay+"").padStart(2, '0') + " " +
                (chartParams.birthHour+"").padStart(2, '0') + ":" +
                ((chartParams.birthMinute+"") || '00').padStart(2, '0') + "\n";
            
            const fullContent = yyyymmddhhmm + generateFeigongString() + editFeigongstr(data.feigong_str);
            // 使用新的剪贴板助手
            const result = await clipboardHelper.copyText(fullContent);
            
            if (result.success) {
                exportBtn.textContent = '已复制';

            } else {
                // 复制失败，提供手动复制选项
                exportBtn.textContent = '请手动复制';
                setTimeout(() => {
                    exportBtn.textContent = originalText;
                    exportBtn.disabled = false;
                }, 2000);
                
                clipboardHelper.showCopyFallback(fullContent);
            }
            // // 复制到剪贴板
            // const tempTextArea = document.createElement('textarea');
            // tempTextArea.value = fullContent;
            // console.log("复制到剪贴板");
            // document.body.appendChild(tempTextArea);
            // tempTextArea.select();
            // // 复制
            // document.execCommand('copy');
            // document.body.removeChild(tempTextArea);
            // // 显示复制成功提示
            // const originalText = copyBtn.textContent;
            // copyBtn.textContent = '已复制！';

            // // 2秒后恢复原文本
            // setTimeout(() => {
            //     exportBtn.textContent = originalText;
            //     exportBtn.disabled = false;
            // }, 2000);

            // let copySuccess = false;
            // try {
            //     copySuccess = document.execCommand('copy');
            // } catch (err) {
            //     console.warn('复制命令失败:', err);
            // }

            // if (copySuccess) {
            //     exportBtn.textContent = '已复制';
            // } else {
            //     // 如果复制失败，提供手动选择方案
            //     exportBtn.textContent = '请手动选择复制';
            //     setTimeout(() => {
            //         exportBtn.textContent = originalText;
            //         exportBtn.disabled = false;
            //     }, 2000);
            //     // 可以在这里添加文本区域显示内容，让用户手动复制
            //     // showManualCopyDialog(fullContent);
            // }
            
        } catch (error) {
            console.error('导出失败:', error);
            exportBtn.textContent = '导出失败';
            showError('导出失败: ' + error.message);
        } finally {
            // 2秒后恢复按钮状态
            setTimeout(() => {
                if (exportBtn.textContent !== '请手动选择复制') {
                    exportBtn.textContent = originalText;
                    exportBtn.disabled = false;
                }
            }, 2000);
        }

    });

    // 关闭按钮点击事件
    closeBtn.addEventListener('click', function() {
        exportModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    exportModal.addEventListener('click', function(e) {
        if (e.target === exportModal) {
            exportModal.style.display = 'none';
        }
    });

    // 复制按钮点击事件
    // copyBtn.addEventListener('click', function() {
    //     // 创建临时文本区域
    //     const tempTextArea = document.createElement('textarea');
    //     tempTextArea.value = feigong_str;
    //     document.body.appendChild(tempTextArea);

    //     // 选择并复制文本
    //     tempTextArea.select();
    //     document.execCommand('copy');

    //     // 移除临时元素
    //     document.body.removeChild(tempTextArea);

    //     // 显示复制成功提示
    //     const originalText = copyBtn.textContent;
    //     copyBtn.textContent = '已复制！';

    //     // 2秒后恢复原文本
    //     setTimeout(() => {
    //         copyBtn.textContent = originalText;
    //     }, 2000);
    // });
});


// 追踪四化映射表
const zhui4Map = {
    '紫微': {'科':'乙', '权':'壬',name:'紫'},
    '天府': {},
    '天梁': {'权':'乙', '科':'己', '禄':'壬',name:'梁'},
    '武曲': {'科':'甲', '禄':'己', '权':'庚', '忌':'壬',name:'武'},
    '七杀': {},
    '破军': {'权':'甲', '禄':'癸',name:'破'},
    '天相': {},
    '巨门': {'忌':'丁', '禄':'辛', '权':'癸',name:'巨'},
    '贪狼': {'禄':'戊', '权':'己', '忌':'癸',name:'贪'},
    '天机': {'禄':'乙', '权':'丙', '科':'丁', '忌':'戊',name:'机'},
    '太阳': {'忌':'甲', '禄':'庚', '权':'辛',name:'阳'},
    '廉贞': {'禄':'甲', '忌':'丙',name:'廉'},
    '天同': {'禄':'丙', '权':'丁', '忌':'庚',name:'同'},
    '太阴': {'忌':'乙', '禄':'丁', '权':'戊', '科':'庚癸',name:'阴'},
    '左辅': {'科':'壬',name:'左'},
    '右弼': {'科':'戊',name:'右'},
    '文昌': {'科':'丙', '忌':'辛',name:'昌'},
    '文曲': {'忌':'己', '科':'辛',name:'曲'}
};

// 2. 创建星意浮层元素
const createStarTooltip = () => {
    const tooltip = document.createElement('div');
    tooltip.id = 'star-tooltip';

    // const chartSection = document.querySelector('.chart-section');
    const chartSection = document.querySelector('.container');
    if (chartSection) {
        chartSection.appendChild(tooltip);
    }else{
        document.body.appendChild(tooltip);
    }

    return tooltip;
};

// 3. 显示星意说明
// 当前显示的星曜名称
let starMeaningRequestController = null;
let currentDisplayedStar = null;

// 改进的显示星曜含义函数 - 从服务端获取数据
const showStarMeaning = async (starName, element) => {
    const tooltip = document.getElementById('star-tooltip') || createStarTooltip();
    
    // 取消之前的请求（如果存在）
    if (starMeaningRequestController) {
        starMeaningRequestController.abort();
    }
    
    // 显示加载状态
    tooltip.innerHTML = `
        <div style="font-weight:900; color:#8b4513; margin-bottom:8px; border-bottom:1px solid #d2b48c; padding-bottom:5px;text-align: center;">
            ${starName}
        </div>
        <div style="text-align:center; padding:20px; color:#666;">
            <div>加载中...</div>
            <div style="font-size:12px; margin-top:10px;">正在从服务器获取星曜含义</div>
        </div>
    `;
    
    tooltip.style.display = 'block';
    currentDisplayedStar = starName;
    element.style.cursor = 'wait';

    try {
        // 创建新的AbortController用于本次请求
        starMeaningRequestController = new AbortController();
        
        // 从服务端获取星曜含义
        const response = await fetch(getApiBaseUrl()+`/api/stars/${encodeURIComponent(starName)}`, {
            method: 'GET',
            signal: starMeaningRequestController.signal,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const starData = await response.json();
        
        // 检查是否仍然是当前显示的星曜（防止快速切换时的显示错乱）
        if (currentDisplayedStar !== starName) {
            return;
        }

        // 构建详细的星曜含义显示
        tooltip.innerHTML = buildStarMeaningHTML(starName, starData);
        element.style.cursor = 'pointer';

    } catch (error) {
        if (error.name === 'AbortError') {
            // 请求被取消，正常情况
            return;
        }
        
        console.error(`获取星曜 ${starName} 含义失败:`, error);
        
        // 检查是否仍然是当前显示的星曜
        if (currentDisplayedStar !== starName) {
            return;
        }
        
        // 显示错误信息或备用内容
        tooltip.innerHTML = `
            <div style="font-weight:900; color:#8b4513; margin-bottom:8px; border-bottom:1px solid #d2b48c; padding-bottom:5px;text-align: center;">
                ${starName}
            </div>
            <div style="color: #d32f2f; padding: 20px; text-align: center;">
                <div>⚠️ 获取星曜含义失败</div>
                <div style="font-size: 12px; margin-top: 10px; color: #666;">
                    ${error.message || '网络连接错误'}
                </div>
            </div>
        `;
        element.style.cursor = 'pointer';
    }
};

// 构建星曜含义显示的HTML内容
function buildStarMeaningHTML(starName, starData) {
    const sections = [];
    
    // 基本属性
    if (starData.basic && starData.basic.trim()) {
        sections.push(`
            <div class="meaning-section">
                <div class="section-title">⚪ 根本属性</div>
                <div class="section-content">${formatContent(starData.basic)}</div>
            </div>
        `);
    }
    
    // 组合象义
    if (starData.combination && starData.combination.trim()) {
        sections.push(`
            <div class="meaning-section">
                <div class="section-title">🔗 组合象义</div>
                <div class="section-content">${formatContent(starData.combination)}</div>
            </div>
        `);
    }
    
    // 扩展含义
    if (starData.extended && starData.extended.trim()) {
        sections.push(`
            <div class="meaning-section">
                <div class="section-title">📖 扩展象义</div>
                <div class="section-content">${formatContent(starData.extended)}</div>
            </div>
        `);
    }
    
    // 物质属性
    if (starData.material && starData.material.trim()) {
        sections.push(`
            <div class="meaning-section">
                <div class="section-title">🏠 物质属性</div>
                <div class="section-content">${formatContent(starData.material)}</div>
            </div>
        `);
    }
    
    // 健康影响
    if (starData.health && starData.health.trim()) {
        sections.push(`
            <div class="meaning-section">
                <div class="section-title">💊 身体健康</div>
                <div class="section-content">${formatContent(starData.health)}</div>
            </div>
        `);
    }
    
    // 感情关系
    if (starData.relationship && starData.relationship.trim()) {
        sections.push(`
            <div class="meaning-section">
                <div class="section-title">💑 感情关系</div>
                <div class="section-content">${formatContent(starData.relationship)}</div>
            </div>
        `);
    }
    
    // 职场事业
    if (starData.career && starData.career.trim()) {
        sections.push(`
            <div class="meaning-section">
                <div class="section-title">💼 职场事业</div>
                <div class="section-content">${formatContent(starData.career)}</div>
            </div>
        `);
    }
    
    // 财富资产
    if (starData.wealth && starData.wealth.trim()) {
        sections.push(`
            <div class="meaning-section">
                <div class="section-title">💰 财富资产</div>
                <div class="section-content">${formatContent(starData.wealth)}</div>
            </div>
        `);
    }
    
    // 精神思维
    if (starData.mindset && starData.mindset.trim()) {
        sections.push(`
            <div class="meaning-section">
                <div class="section-title">🧠 精神思维</div>
                <div class="section-content">${formatContent(starData.mindset)}</div>
            </div>
        `);
    }
    
    // 如果没有数据，显示提示
    if (sections.length === 0) {
        sections.push(`
            <div style="padding: 20px; text-align: center; color: #666;">
                <div>暂无此星曜的详细说明</div>
                <div style="font-size: 12px; margin-top: 10px;">
                    请联系管理员添加"${starName}"的含义数据
                </div>
            </div>
        `);
    }
    
    // 添加最后更新时间
    let updateInfo = '';
    if (starData.lastUpdated) {
        const updateTime = new Date(starData.lastUpdated).toLocaleString();
        updateInfo = `<div style="text-align:center; margin-top:10px; font-size:10px; color:#666;">
                        最后更新: ${updateTime}
                    </div>`;
    }
    
    return `
        <div style="font-weight:900; color:#8b4513; margin-bottom:8px; border-bottom:1px solid #d2b48c; padding-bottom:5px;text-align: center;">
            ${starName}
        </div>
        ${sections.join('')}
        ${updateInfo}
        <div style="text-align:center; margin-top:10px; font-size:10px; color:#666;">
            点击其他星曜切换显示
        </div>
    `;
}

// 格式化内容文本（处理换行等）
function formatContent(content) {
    return content
        .replace(/\n/g, '<br>')
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(/  /g, '&nbsp;&nbsp;');
}

// 4. 隐藏星意说明
const hideStarMeaning = () => {
    const tooltip = document.getElementById('star-tooltip');
    if (tooltip) {
        return
        // tooltip.style.display = 'none';
        // currentDisplayedStar = null;
    }
};

// 5. 绑定事件处理函数
const bindStarEvents = () => {
    // 获取所有星曜元素
    const starElements = [
        ...document.querySelectorAll('.main-star'),
        ...document.querySelectorAll('.minor-star'),
        ...document.querySelectorAll('.xiaoxing-star'),
        ...document.querySelectorAll('.shensha-star'),
        ...document.querySelectorAll('.changsheng-star')
    ];

    starElements.forEach(star => {
        // 清理星曜名称
        const rawName = star.textContent.trim();
        const cleanName = rawName.replace(/[0-9()（）]/g, '').slice(0,2);

        // 移除之前的事件监听器
        star.replaceWith(star.cloneNode(true));
    });

    // 重新获取元素
    const newStarElements = [
        ...document.querySelectorAll('.main-star'),
        ...document.querySelectorAll('.minor-star'),
        ...document.querySelectorAll('.xiaoxing-star'),
        ...document.querySelectorAll('.shensha-star'),
        ...document.querySelectorAll('.changsheng-star')
    ];

    newStarElements.forEach(star => {
        const rawName = star.textContent.trim();
        const cleanName = rawName.replace(/[0-9()（）]/g, '').slice(0,2);

        // 点击事件 - 小屏幕和正常屏幕都适用
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentDisplayedStar === cleanName) {
                return;
            }
            showStarMeaning(cleanName, star);
        });

        star.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: true });
    });

    // 页面点击事件
    document.addEventListener('click', (e) => {
        const isStar = e.target.closest('.main-star, .minor-star, .xiaoxing-star, .shensha-star, .changsheng-star');
        if (!isStar) {
            hideStarMeaning();
        }
    });

    document.addEventListener('touchstart', (e) => {
        const isStar = e.target.closest('.main-star, .minor-star, .xiaoxing-star, .shensha-star, .changsheng-star');
        if (!isStar) {
            hideStarMeaning();
        }
    }, { passive: true });
};
// 添加窗口大小变化监听，重新定位tooltip
// window.addEventListener('resize', () => {
//     if (currentDisplayedStar) {
//         const starElements = document.querySelectorAll('.main-star, .minor-star, .xiaoxing-star, .shensha-star, .changsheng-star');
//         const matchingStar = Array.from(starElements).find(star => {
//             const rawName = star.textContent.trim();
//             const cleanName = rawName.replace(/[0-9()（）]/g, '').slice(0,2);
//             return cleanName === currentDisplayedStar;
//         });

//         if (matchingStar) {
//             showStarMeaning(currentDisplayedStar, matchingStar);
//         }
//     }
// });
// 6. 初始化（在DOM加载完成后执行）
document.addEventListener('DOMContentLoaded', () => {
    // 确保在命盘渲染完成后绑定事件
    setTimeout(bindStarEvents, 500);

    // 监听命盘渲染完成事件（如果存在）
    if (typeof renderChart === 'function') {
        const originalRender = renderChart;
        renderChart = function(...args) {
            originalRender.apply(this, args);
            setTimeout(bindStarEvents, 100);
        };
    }
});

/* --------------追踪四化------------------ */
// 2. 新增追踪标记显示函数
function showSihuaTracking(currentPalace) {
    // 获取当前宫位的所有星曜
    const palaceElement = document.getElementById(currentPalace + '宫');
    if (!palaceElement) return;

    // 收集所有星曜名称（主星+辅星）
    const stars = new Set();

    // 获取主星
    const mainStars = palaceElement.querySelectorAll('.main-star');
    mainStars.forEach(star => {
        stars.add(star.textContent.trim());
    });

    // 获取辅星
    const minorStars = palaceElement.querySelectorAll('.minor-star');
    minorStars.forEach(star => {
        stars.add(star.textContent.trim());
    });

    // 为每个星曜显示追踪信息
    stars.forEach(starName => {
        const sources = getSihuaSources(starName, currentPalace);
        // console.log(`星曜 ${starName} 在 ${currentPalace}宫 的四化来源:`, sources);
        sources.forEach(source => {
            createTrackingMark(source.palace, source.sihuaType, source.showName);
        });
    });
}


// 3. 新增获取四化来源函数（优化算法）
function getSihuaSources(starName, currentPalace) {
    const sources = [];

    // 遍历所有宫位的飞四化数据，查找当前星曜的来源
    Object.entries(zhui4Map || {}).forEach(([star, sihuaData]) => {
        Object.entries(sihuaData).forEach(([sihuaType, targetInfo]) => {
            if (star === starName && sihuaType != 'name') {
                sources.push({
                    palace: targetInfo,
                    sihuaType: sihuaType,
                    showName: sihuaData.name,
                    fullName:starName
                });
            }
        });
    });

    return sources;
}

// 4. 新增创建追踪标记函数
function createTrackingMark(sourceTianGan, sihuaType, starName) {

    // 查找所有包含指定天干的宫位
    const targetPalaces = findPalacesByTianGan(sourceTianGan);

    if (targetPalaces.length === 0) {
        console.warn(`未找到天干"${sourceTianGan}"对应的宫位`);
        return;
    }

    // 在每个匹配的宫位上创建追踪标记
    targetPalaces.forEach(palaceElement => {
        // 检查该宫位是否已有追踪标记
        const existingMarks = palaceElement.querySelectorAll('.tracking-mark');
        const markCount = existingMarks.length;

        // 创建标记容器（如果不存在）
        let marksContainer = palaceElement.querySelector('.tracking-marks-container');
        if (!marksContainer) {
            marksContainer = document.createElement('div');
            marksContainer.className = 'tracking-marks-container';
            palaceElement.appendChild(marksContainer);
        }

        // 创建单个标记
        const mark = document.createElement('div');
        mark.className = `tracking-mark ${sihuaMap[sihuaType].toLowerCase()}`;
        mark.textContent = starName;
        // mark.title = `${starName}的${sihuaType}来源（${sourceTianGan}）`;

        // 设置标记位置
        mark.style.right = `${60 + markCount * 25}`; // 偏移，避免重叠

        // 添加到宫位元素
        marksContainer.appendChild(mark);

        // 高亮目标宫位
        // palaceElement.classList.add('tracking-highlight');
    });

    // console.log(`在天干"${sourceTianGan}"对应的${targetPalaces.length}个宫位创建了追踪标记`);
}

// 5. 新增清除追踪标记函数
function clearTrackingMarks() {
    // 移除追踪标记
    document.querySelectorAll('.tracking-mark').forEach(mark => {
        mark.remove();
    });

    // 移除高亮效果
    document.querySelectorAll('.palace.tracking-highlight').forEach(palace => {
        palace.classList.remove('tracking-highlight');
    });
}

// 6. 优化：预计算星曜来源映射（提升性能）
function precomputeStarSources() {
    const starSourceMap = new Map();

    Object.entries(window.zhui4Map || {}).forEach(([sourcePalace, sihuaData]) => {
        Object.entries(sihuaData).forEach(([sihuaType, targetInfo]) => {
            const key = `${targetInfo.target}-${targetInfo.star}`;
            if (!starSourceMap.has(key)) {
                starSourceMap.set(key, []);
            }
            starSourceMap.get(key).push({
                palace: sourcePalace,
                sihuaType: sihuaType
            });
        });
    });

    return starSourceMap;
}

// 根据天干查找宫位
function findPalacesByTianGan(tianGan) {
    const palaces = [];

    // 获取所有宫位元素
    const palaceElements = document.querySelectorAll('.palace');

    palaceElements.forEach(palace => {
        // 获取宫位的干支信息
        const ganzhiElement = palace.querySelector('.ganzhi');
        if (ganzhiElement && tianGan.includes(ganzhiElement.textContent.substring(0, 1))) {
            palaces.push(palace);
        }
    });

    return palaces;
}

// 使用优化后的获取来源函数
function getSihuaSourcesOptimized(starName, currentPalace) {
    const key = `${currentPalace}-${starName}`;
    return window.starSourceMap?.get(key) || [];
}


// 宫位表征信息映射表
const palaceMeaningMap = {
    '命': {
        title: '命宫 - 核心/发心接口 (主体性质)',
        meanings: [
            '自己，气运，灵魂，我，魄力，业力，神识',
            '命数，气数，宿缘，宿命，命名，使命，寿命',
            '先天根基，个性本质，第一驱动力',
            '与疾厄宫一体两面：命主精神，疾厄主肉体'
        ],
        examples: {
            feichu: [
                '命宫飞禄：我主动投射生机或产生兴趣。',
                '命宫飞权：我主观意识强烈，强行干预或控制。',
                '命宫飞科：我寻找名义、理由或通过文饰来表现。',
                '命宫飞忌：我的执念或错误决策导致能量损耗。'
            ],
            feiru: [
                '命宫追禄：外界给予我的生机、名誉或机会。',
                '命宫追权：外部力量对我施压或赋予我掌控力。',
                '命宫追科：外界赋予我的名声、荣誉或解释权。',
                '命宫追忌：外界的压力、债务或结局由我承接。'
            ]
        }
    },
    '兄弟': {
        title: '兄弟宫 - 内部/协作接口 (资源周转性质)',
        meanings: [
            '同行，同事，竞争，手足，现金周转，财库',
            '母亲，盟友，契约，弟子，成就线（官禄之疾）',
            '床位：同居生活的基础，身体的气数体质'
        ],
        examples: {
            feichu: [
                '兄弟飞禄：内部资源外送产生合作生机。',
                '兄弟飞权：内部力量强行运作或资金杠杆。',
                '兄弟飞科：内部关系的公示、名义化的说明或周转理由。',
                '兄弟飞忌：内部资金断裂或同级竞争的破坏。'
            ],
            feiru: [
                '兄弟追禄：资金回笼，现金流得到补充。',
                '兄弟追权：外部竞争压力进入内部，被迫强化运作。',
                '兄弟追科：获得内部名誉背书或资金周转的缓冲理由。',
                '兄弟追忌：外部债务透支内部资源，资金周转受阻。'
            ]
        }
    },
    '夫妻': {
        title: '夫妻宫 - 对待/契约接口 (博弈对待性质)',
        meanings: [
            '因果位，对方，对手，对待位，博弈位',
            '婚姻，契约另一方，合作关系，结果，情债',
            '一切二元关系：我与外界的“博弈面”'
        ],
        examples: {
            feichu: [
                '夫妻飞禄：对方施予好处，对待关系呈现生机。',
                '夫妻飞权：对方展现掌控欲，对待关系受压。',
                '夫妻飞科：对方给出理由、借口或建立名义关系。',
                '夫妻飞忌：对手打压或对待关系的终结。'
            ],
            feiru: [
                '夫妻追禄：我主动投入筹码以维系对待平衡。',
                '夫妻追权：我强行干预对方，控制博弈面。',
                '夫妻追科：我寻求名义上的合作或法律上的契约（如领证）。',
                '夫妻追忌：我的压力抛向对方，产生感情或契约亏欠。'
            ]
        }
    },
    '子女': {
        title: '子女宫 - 执行/产出接口 (行为执行性质)',
        meanings: [
            '下属，徒弟，粉丝，成果，子公司，变动',
            '桃花位，性能力，分娩，创造力，投资位'
        ],
        examples: {
            feichu: [
                '子女飞禄：执行顺遂产生红利，合伙愉快。',
                '子女飞权：执行环节强力推进，产出扩张。',
                '子女飞科：产出的名义化（如产品命名/发布会）。',
                '子女飞忌：执行受阻、项目流产或下属造反。'
            ],
            feiru: [
                '子女追禄：外部注资合伙，获得新的执行资源。',
                '子女追权：我强行干预执行细节，对下级施压。',
                '子女追科：执行方案的名义合规化或寻找缓冲替代品。',
                '子女追忌：问题的根源在执行层，投资决策失误。'
            ]
        }
    },
    '财帛': {
        title: '财帛宫 - 资源/筹码接口 (资产价值性质)',
        meanings: [
            '钱财，资源，价值评估，盈亏，筹码',
            '智商，情商，财务报表，赚钱能力，现钞'
        ],
        examples: {
            feichu: [
                '财帛飞禄：主动注资或将筹码转化为生机。',
                '财帛飞权：资金强行运作或通过财富施压。',
                '财帛飞科：资金运作的名义化（如融资担保/信用证明）。',
                '财帛飞忌：资金流失、亏损或资源消耗。'
            ],
            feiru: [
                '财帛追禄：利润回笼，资源增量，价值获认可。',
                '财帛追权：外部资本强控财权，理财受迫。',
                '财帛追科：因名望而获利，或资金来源的合法名义。',
                '财帛追忌：债务落地，罚款或损失归结到口袋。'
            ]
        }
    },
    '疾厄': {
        title: '疾厄宫 - 现象/现场接口 (肉身显化性质)',
        meanings: [
            '肉体，病灶，现场，物理状态，显化',
            '底层运作，器官，免疫，创伤，身体信号'
        ],
        examples: {
            feichu: [
                '疾厄飞禄：现象好转，肉身散发活力。',
                '疾厄飞权：现象剧烈扩张或肉身爆发力。',
                '疾厄飞科：身体外表的修饰或病理的名义公示（诊断书）。',
                '疾厄飞忌：病灶显化，物理压力抛向意志。'
            ],
            feiru: [
                '疾厄追禄：外界滋养肉体，现象得到修复。',
                '疾厄追权：外部力量强行改变肉身（如手术/外伤）。',
                '疾厄追科：身体获得名义上的照护或虚假的健康表象。',
                '疾厄追忌：因果或压力直接作用于肉身，显化病痛。'
            ]
        }
    },
    '迁移': {
        title: '迁移宫 - 空间/反馈接口 (环境结果性质)',
        meanings: [
            '环境，结果，结局，社会评价，外界，机遇',
            '出行，变动，漂泊，社会空间，人生反馈'
        ],
        examples: {
            feichu: [
                '迁移飞禄：环境给予机会，外界反馈生机。',
                '迁移飞权：社会环境强行拉动，位移产出的权力。',
                '迁移飞科：外界给予的名望、公示或虚幻的外部表象。',
                '迁移飞忌：环境排斥、意外阻碍或结局崩塌。'
            ],
            feiru: [
                '迁移追禄：我向外寻求认同，心向远方。',
                '迁移追权：我强行扩张外部领地，在外交涉力强。',
                '迁移追科：我在外寻找名义、理由或寻找缓冲地。',
                '迁移追忌：我在外受困，我的压力抛向了社会。'
            ]
        }
    },
    '交友': {
        title: '交友宫 - 众生/市场接口 (外部推力性质)',
        meanings: [
            '众生，客户，市场，社群，对比，推力',
            '小人，竞争对手，粉丝，别人的钱袋子'
        ],
        examples: {
            feichu: [
                '交友飞禄：众生带来红利，市场机会涌现。',
                '交友飞权：大众施压，市场强制力导致变动。',
                '交友飞科：众生给出的理由、公示或表面的社交辞令。',
                '交友飞忌：小人干扰、市场萎缩或众生欠我债。'
            ],
            feiru: [
                '交友追禄：我主动拓展市场，向众生施予资源。',
                '交友追权：我强行掌控他人，争夺社群主导。',
                '交友追科：我寻找社交名目或建立名义上的人脉圈。',
                '交友追忌：我欠下人情债，众生对我产生压力。'
            ]
        }
    },
    '官禄': {
        title: '官禄宫 - 行为/逻辑接口 (行为运作性质)',
        meanings: [
            '行为，运作逻辑，制度，功名，社会地位',
            '职位，管理，秩序，职业生涯，目的性'
        ],
        examples: {
            feichu: [
                '官禄飞禄：行为产生效益，业务流程变现。',
                '官禄飞权：职权扩张，行为产生的控制力。',
                '官禄飞科：行为的名义化（如虚衔/获奖/走流程）。',
                '官禄飞忌：操作失误导致的系统性压力外泄。'
            ],
            feiru: [
                '官禄追禄：事业获资源注入，运作逻辑被激活。',
                '官禄追权：规则层强行加压，工作受制度严管。',
                '官禄追科：获得事业名誉、头衔或合法的免责理由。',
                '官禄追忌：问题的症结在于操作不当或事业受困。'
            ]
        }
    },
    '田宅': {
        title: '田宅宫 - 资产/终局接口 (储存基础性质)',
        meanings: [
            '祖产，资产库，终局，家底，财库，根基',
            '积累，空间，私域，潜藏资源，储存点'
        ],
        examples: {
            feichu: [
                '田宅飞禄：家底溢出收益，资产升值变现。',
                '田宅飞权：资产抵押运作，家宅强行变动。',
                '田宅飞科：资产的名义公示（如产证/家族名誉）。',
                '田宅飞忌：家底空虚、资产缩水或基石动摇。'
            ],
            feiru: [
                '田宅追禄：财富入库，基石稳固，置产兴家。',
                '田宅追权：外界强行干预资产（如征收/封锁）。',
                '田宅追科：资产的名义化处理或获得居住的名义保障。',
                '田宅追忌：债务最终追溯至资产，倾家荡产之兆。'
            ]
        }
    },
    '福德': {
        title: '福德宫 - 心念/因果接口 (潜意识能量性质)',
        meanings: [
            '想法，潜意识，心情，心念，慧根，福报',
            '理想化，业力反馈，精神享受，源动力'
        ],
        examples: {
            feichu: [
                '福德飞禄：善念萌发带动生机。',
                '福德飞权：执念强烈驱使强力扩张。',
                '福德飞科：为行为寻找精神寄托或合理的解释。',
                '福德飞忌：贪嗔痴念导致自寻烦恼。'
            ],
            feiru: [
                '福德追禄：天佑我也，精神获得极度愉悦。',
                '福德追权：外界干扰意志，内心受迫较劲。',
                '福德追科：获得心灵慰藉、精神名誉或宗教寄托。',
                '福德追忌：业力显现，精神遭受折磨，心神不宁。'
            ]
        }
    },
    '父母': {
        title: '父母宫 - 规则/秩序接口 (文书上层性质)',
        meanings: [
            '上级，政府，规则，秩序，文书，证明',
            '法律，信用，背书，官方，背景，名位'
        ],
        examples: {
            feichu: [
                '父母飞禄：政策红利，贵人提拔，文书过关。',
                '父母飞权：法律管控，规则强制执行。',
                '父母飞科：规则的解释、文书的公示或给予名义支持。',
                '父母飞忌：官非纠纷、政策打压或文书错误。'
            ],
            feiru: [
                '父母追禄：我寻求名位背书，主动维护秩序。',
                '父母追权：我挑战权威，在规则层争夺主导。',
                '父母追科：我寻找法律缝隙、名义保护或申请证书。',
                '父母追忌：我的行为触碰红线，受制于规则裁断。'
            ]
        }
    }
};
let palaceMeaningRequestController = null; // 用于追踪当前的请求控制器
// 显示宫位详细信息
async function showPalaceMeaning(palaceName,palaceGan, sihuaData,element) {
    // 取消之前的请求（如果存在）
    if (palaceMeaningRequestController) {
        palaceMeaningRequestController.abort();
    }
    const tooltip = document.getElementById('star-tooltip') || createStarTooltip();
    const meaning = palaceMeaningMap[palaceName] || {
        title: `${palaceName}宫 - 详细信息`,
        meanings: ['暂无此宫位的详细说明'],
        examples: {
            feichu: [],
            feiru: []
        }
    };

    // 构建HTML内容
    let content = `
        <div style="font-weight:bold; color:#8b4513; margin-bottom:8px; border-bottom:1px solid #d2b48c; padding-bottom:5px;text-align: center;">
            ${meaning.title}
        </div>
    `;

    // 添加表征信息
    if (meaning.meanings && meaning.meanings.length > 0) {
        content += `
            <div style="margin-bottom:10px;">
                <div style="font-weight:bold; color:#2c3e50; margin-bottom:5px;">📖 基本表征：</div>
                <div style="font-size:12px; line-height:1.4;color:#7f8c8d;">
                    ${meaning.meanings.map(m => `• ${m}`).join('<br>')}
                </div>
            </div>
        `;
    }

    // 添加实际应用示例
    if (meaning.examples && meaning.examples.feichu.length > 0 && meaning.examples.feiru.length > 0) {
        content += `
            <div style="margin-bottom:10px;">
                <div style="font-weight:bold; color:#2c3e50; margin-bottom:5px;">💡 实际应用：</div>
                <div style="font-size:12px; line-height:1.4; color:#7f8c8d;">
                    ${meaning.examples.feichu.map(e => `→ ${e}`).join('<br>')}
                </div>
                <div style="font-size:12px; line-height:1.4; color:#7f8c8d;">
                    ${meaning.examples.feiru.map(e => `→ ${e}`).join('<br>')}
                </div>
            </div>
        `;
    }

    // 添加四化影响说明
    const sihua = document.createElement('div');
    sihua.id = 'sihua-loading-area';
    sihua.style.cssText = `
        font-size:11px; 
        line-height:1.3; 
        color:#7f8c8d;
    `;
    // 如果该宫有宫干，则向后端请求核心四化数据
    if (palaceGan && Object.keys(sihuaData).length > 0) {
        try {
            // 创建新的AbortController用于本次请求
            palaceMeaningRequestController = new AbortController();      
               
            
            // 检查今天是否已经验证过
            let passwordInfo;
            if (isPasswordVerifiedToday()) {
                // 自动使用当前日期的密码
                passwordInfo = {
                    password: getCurrentMMDDPassword(),
                    remember: true,
                    autoFilled: true
                };
            } 
            // 将数据转换为 URL 查询参数
            const queryParams = new URLSearchParams({
                source: palaceName,
                password: passwordInfo ? passwordInfo.password : '',
                targets: JSON.stringify(sihuaData) // 将 B宫与星曜信息 JSON 序列化
            });   
            // 发起请求给后端 get_sihua
            const response = await fetch(getApiBaseUrl()+`/api/sihuas/${encodeURIComponent(palaceGan)}?${queryParams.toString()}`, {
                method: 'GET',
                signal: palaceMeaningRequestController.signal,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();

            if (result.success && result.data) {
                let html = `<ul class="sihua-list">`;

                // 遍历后台返回的拼装结果
                for (const [sihuaType, info] of Object.entries(result.data)) {
                    html += `
                        <li class="sihua-item">
                            <div class="desc-logic" style="color: #555;margin-left: 10px;">
                                🚀${palaceName}宫 : ${info.logic_source} <br/>
                                <span class="sihua-${sihuaMap[sihuaType] || sihuaType}">
                                    卐【${sihuaType}】${info.star}(${info.brightness})  > ${info.logic_sihua2} < ${info.logic_sihua1} <br/>
                                </span>
                                ☯ ${info.target_palace} : ${info.logic_target}
                            </div>
                        </li>
                    `;
                }
                html += `</ul>`;
                
                // 将加载中的文案替换为真实的四化数据
                sihua.innerHTML =  html;
            } else {
                sihua.innerHTML = `<p class="error-text">获取四化机制失败：${result.message}</p>`;
            }
        } catch (error) {
            console.error("获取四化数据出错:", error);
            sihua.innerHTML = `<p class="error-text">网络或服务器错误，无法获取天地感应数据。</p>`;
        }
        content += `
            <div style="margin-bottom:5px;">
                <div style="font-weight:bold; color:#2c3e50; margin-bottom:3px;">🎯 四化影响：</div>
        ` + sihua.outerHTML + `
            </div>
            </div>
        `;
    }

    tooltip.innerHTML = content;
    tooltip.style.display = 'block';
    
    // 更新当前显示状态
    currentDisplayedStar = `palace_${palaceName}`;
    element.style.cursor = 'pointer';
}

/**
 * 通过页面实际 DOM 结构反查星曜所在的宫位及亮度
 * @param {string} starName - 需要查找的星曜名称 (如 '紫微', '地空', '天福')
 * @returns {object|null} 返回找到的宫位信息，未找到返回 null
 */
function findPalaceByStar(starName) {
    // 1. 获取所有的宫位容器
    const palaces = document.querySelectorAll('.palace'); 
    
    // 2. 遍历每个宫位进行查找
    for (let i = 0; i < palaces.length; i++) {
        const palaceEl = palaces[i];
        
        // 3. 定义可能包含星曜名称的 CSS 类名
        // 根据你的结构，主星、辅星、小星、神煞都有各自的容器或类名
        const starSelectors = [
            '.main-star',      // 假设主星的类名是这个
            '.minor-star',     // 辅星 (如你给的地空)
            '.xiaoxing-star',  // 小星 (如天福)
            '.shensha-star',   // 神煞 (如病符)
            '.changsheng-star' // 长生 (如病)
        ];
        
        let foundStarEl = null;
        let brightness = '平'; // 默认星情兜底
        
        // 4. 在当前宫位中，寻找匹配的星曜文本
        for (const selector of starSelectors) {
            const stars = palaceEl.querySelectorAll(selector);
            for (const starEl of stars) {
                // 如果文本内容匹配（去除首尾空格防止误判）
                if (starEl.textContent.trim() === starName) {
                    foundStarEl = starEl;
                    
                    // 5. 尝试提取亮度 (基于你的 .star-unit > .brightness-container 结构)
                    const starUnit = starEl.closest('.star-unit');
                    if (starUnit) {
                        const brightnessEl = starUnit.querySelector('.brightness-container');
                        if (brightnessEl && brightnessEl.textContent.trim() !== '') {
                            brightness = brightnessEl.textContent.trim();
                        }
                    }
                    break;
                }
            }
            if (foundStarEl) break; // 找到了就跳出当前宫位的选择器循环
        }
        
        // 6. 如果在当前宫位找到了该星曜，提取宫位基本信息并返回
        if (foundStarEl) {
            // 提取宫位名称 (例如 "财帛")，并补全 "宫" 字确保格式统一
            let palaceName = palaceEl.querySelector('.palace-footer .palace-name').textContent.trim();
            if (!palaceName.endsWith('宫')) palaceName += '宫';
            
            // 提取地支 (根据干支 <span> 内的文本，如 "丙寅" 取第二个字 "寅")
            // 也可以通过 id="寅宫" 提取，这里采用解析干支的方式更加严谨
            const ganzhi = palaceEl.querySelector('.palace-footer .ganzhi span').textContent.trim();
            const zhi = ganzhi.length >= 2 ? ganzhi.charAt(1) : palaceEl.id.replace('宫', '').trim();
            
            return {
                name: palaceName,  // 最终输出如: '财帛宫'
                zhi: zhi,          // 最终输出如: '寅'
                stars: [
                    {
                        name: starName,
                        brightness: brightness
                    }
                ]
            };
        }
    }
    
    // 如果遍历完 12 个宫位都没找到该星曜
    return null; 
}

// 隐藏宫位信息
function hidePalaceMeaning() {
    const tooltip = document.getElementById('star-tooltip');
    if (tooltip && currentDisplayedStar && currentDisplayedStar.startsWith('palace_')) {
        // tooltip.style.display = 'none';
        // currentDisplayedStar = null;
    }
}

const TIANGAN_SIHUA = {
    "甲": {"禄": "廉贞", "权": "破军", "科": "武曲", "忌": "太阳"},
    "乙": {"禄": "天机", "权": "天梁", "科": "紫微", "忌": "太阴"},
    "丙": {"禄": "天同", "权": "天机", "科": "文昌", "忌": "廉贞"},
    "丁": {"禄": "太阴", "权": "天同", "科": "天机", "忌": "巨门"},
    "戊": {"禄": "贪狼", "权": "太阴", "科": "右弼", "忌": "天机"},
    "己": {"禄": "武曲", "权": "贪狼", "科": "天梁", "忌": "文曲"},
    "庚": {"禄": "太阳", "权": "武曲", "科": "太阴", "忌": "天同"},
    "辛": {"禄": "巨门", "权": "太阳", "科": "文曲", "忌": "文昌"},
    "壬": {"禄": "天梁", "权": "紫微", "科": "左辅", "忌": "武曲"},
    "癸": {"禄": "破军", "权": "巨门", "科": "太阴", "忌": "贪狼"}
}

const SIHUA_START_MAP = {
    "廉贞": "廉", 
    "天机": "机", 
    "天同": "同", 
    "太阴": "阴", 
    "贪狼": "贪", 
    "武曲": "武", 
    "太阳": "阳", 
    "巨门": "巨", 
    "天梁": "梁", 
    "破军": "破", 
    "破军": "破",
    "天梁": "梁",
    "天机": "机",
    "天同": "同",
    "太阴": "阴",
    "贪狼": "贪",
    "武曲": "武",
    "太阳": "阳",
    "紫微": "紫",
    "巨门": "巨",
    "武曲": "武",
    "紫微": "紫",
    "文昌": "昌",
    "天机": "机",
    "右弼": "右",
    "天梁": "梁",
    "太阴": "阴",
    "文曲": "曲",
    "左辅": "左",
    "太阴": "阴",
    "太阳": "阳",
    "太阴": "阴",
    "廉贞": "廉",
    "巨门": "巨",
    "天机": "机",
    "文曲": "曲",
    "天同": "同",
    "文昌": "昌",
    "武曲": "武",
    "贪狼": "贪"

}
// 绑定宫位名称点击事件
function bindPalaceNameEvents() {
    // 获取所有宫位名称元素
    const palaceNameElements = document.querySelectorAll('.palace-name');
    
    palaceNameElements.forEach(element => {
        // 移除旧的事件监听器
        element.replaceWith(element.cloneNode(true));
    });

    // 重新获取元素并绑定事件
    const newPalaceNameElements = document.querySelectorAll('.palace-name');    
    
    newPalaceNameElements.forEach(element => {
        const palaceName = element.textContent.replace('宫', '').trim();
        const ganzhiElement = element.previousSibling ? element.previousSibling.querySelector('.ganzhi span') : null;
        // 点击事件
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 如果点击的是当前已显示的宫位，且在小屏幕下，不执行任何操作
            if (currentDisplayedStar === `palace_${palaceName}`) {
                return;
            }
            const palaceGan = ganzhiElement ? ganzhiElement.textContent.trim().charAt(0) : '';

            // 2. 锁定并组装 B宫（飞入宫位）的数据映射包
            const sihuaData = {};
            // 确保配置已经正确注入到前端
            const flyStars = TIANGAN_SIHUA[palaceGan];
            
            // 遍历当前宫干触发的 禄、权、科、忌
            for (const [sihuaType, starName] of Object.entries(flyStars)) {
                // 利用“DOM爬虫”函数直接从页面上找这颗星
                const targetInfo = findPalaceByStar(starName);
                if (targetInfo) {
                    sihuaData[sihuaType] = {
                        star: starName,
                        palace: targetInfo.name,          // 飞入的B宫
                        brightness: targetInfo.stars[0].brightness // 星情亮度
                    };
                }
            }
            
            showPalaceMeaning(palaceName, palaceGan,sihuaData,element);
        });

        // 触摸事件
        element.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: true });

        // 添加指针样式
        element.style.cursor = 'pointer';
        element.title = `点击查看${palaceName}宫详细说明`;        

    });

    // 页面点击事件（隐藏宫位信息）
    document.addEventListener('click', (e) => {
        const isPalaceName = e.target.closest('.palace-name');
        if (!isPalaceName) {
            hidePalaceMeaning();
        }
    });

    document.addEventListener('touchstart', (e) => {
        const isPalaceName = e.target.closest('.palace-name');
        if (!isPalaceName) {
            hidePalaceMeaning();
        }
    }, { passive: true });
}
// 初始化宫位名称点击功能
function initPalaceNameClicks() {
    // 在命盘渲染完成后绑定事件
    setTimeout(() => {
        bindPalaceNameEvents();
    }, 500);
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initPalaceNameClicks();
    updateStarContainerWidths();

    // 监听窗口大小变化（使用防抖优化性能）
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateStarContainerWidths, 250);
    });
});

// 如果存在命盘渲染函数，在渲染完成后重新绑定
if (typeof renderChart === 'function') {
    const originalRender = renderChart;
    renderChart = function(...args) {
        const result = originalRender.apply(this, args);
        setTimeout(() => {
            bindPalaceNameEvents();
        }, 100);
        return result;
    };
}
// 动态计算和设置星曜容器的宽度变量 - 小星
function updateStarContainerWidths() {
    const palaces = document.querySelectorAll('.palace');

    palaces.forEach(palace => {
        const mainContainer = palace.querySelector('.main-stars-container');
        const minorContainer = palace.querySelector('.minor-stars-container');
        const xiaoxingContainer = palace.querySelector('.xiaoxing-stars-container');
        const mainStar = palace.querySelector('.main-star');
        const minorStar = palace.querySelector('.minor-star');
        const brightnessContainer = palace.querySelector('.brightness-container');


        // 计算主星容器宽度（star-unit数量 × 13px）
        const mainStarUnits = mainContainer.querySelectorAll('.star-unit').length;
        const mainWidth = mainStarUnits * 13;

        // 计算辅星容器宽度
        const minorStarUnits = minorContainer.querySelectorAll('.star-unit').length;
        const minorWidth = minorStarUnits * 13;

        // 设置CSS变量
        palace.style.setProperty('--main-stars-width', mainWidth + 'px');
        palace.style.setProperty('--minor-stars-width', minorWidth + 'px');

        // 动态计算单个grid-area的宽度（基于父容器宽度）
        const palaceWidth = palace.scrollWidth;
        const gridAreaWidth = palaceWidth; // 每个palace就是一个grid-area

        // 计算小星容器的可用宽度
        const availableWidth = gridAreaWidth - mainWidth - minorWidth - 2;

        // 设置小星容器宽度
        xiaoxingContainer.style.width = Math.max(availableWidth, 20) + 'px';

        // 同步高度：获取主星/辅星和星情的最大高度
        const mainHeight = minorStar?.scrollHeight ?? 30;
        const minorHeight = minorStar?.scrollHeight ?? 30 ;
        const brightnessHeight = brightnessContainer?.scrollHeight ?? 15 ;
        const maxHeight = Math.max(mainHeight, minorHeight, 30)+brightnessHeight;

        // 设置小星容器高度
        xiaoxingContainer.style.minHeight = maxHeight + 'px';
   
    });
}


// function showPasswordModal() {
//     return new Promise((resolve) => {
//         // 显示当前日期的MMDD格式作为提示
//         const now = new Date();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const todayPassword = month + day;
        
//         // 使用浏览器的prompt函数
//         const password = prompt(
//             `输入密码：`,
//             ''
//         );
        
//         if (password === null) {
//             // 用户点击了取消
//             resolve(null);
//         } else {
//             // 去除空格
//             const trimmedPassword = password.trim();
            
//             if (!trimmedPassword) {
//                 alert('密码不能为空');
//                 // 递归调用自己，让用户重新输入
//                 showPasswordModal().then(resolve);
//             } else {
//                 resolve(trimmedPassword);
//             }
//         }
//     });
// }
// 修改 showPasswordModal 函数，添加记忆功能选项

function showPasswordModalWithMemory(options = {}) {
    return new Promise((resolve) => {
        const {
            title = '验证',
            prompt = '请输入密码：',
            placeholder = '请输入密码',
            confirmText = '确认',
            cancelText = '取消',
            showRememberOption = true // 新增：是否显示"今天不再询问"选项
        } = options;
        
        // 检查是否今天已经验证过
        if (isPasswordVerifiedToday()) {
            // 自动使用当前日期的密码
            const currentPassword = getCurrentMMDDPassword();
            resolve({
                password: currentPassword,
                remember: true,
                autoFilled: true
            });
            return;
        }
        
        // 创建模态框（使用之前改进的版本）
        const modal = document.createElement('div');
        modal.id = 'passwordModal';
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
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            width: 350px;
            max-width: 90%;
        `;
        
        // 构建模态框内容
        let modalHTML = `
            <h3 style="margin: 0 0 20px 0; color: #8b4513; text-align: center;">${title}</h3>
            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">${prompt}</p>
            <input type="password" id="passwordInput" 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px;"
                   placeholder="${placeholder}">
            <div id="errorMessage" style="color: red; font-size: 12px; margin-bottom: 10px; min-height: 20px; display: none;"></div>
        `;
        
        // 添加"今天不再询问"选项
        if (showRememberOption) {
            modalHTML += `
                <div style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="rememberToday" style="margin-right: 8px;">
                        <span style="font-size: 14px; color: #666;">今天不再询问（仅限本设备）</span>
                    </label>
                </div>
            `;
        }
        
        modalHTML += `
            <div style="display: flex; gap: 10px;">
                <button id="confirmPassword" 
                        style="flex: 1; padding: 10px; background: #8b4513; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ${confirmText}
                </button>
                <button id="cancelPassword" 
                        style="flex: 1; padding: 10px; background: #ccc; color: #666; border: none; border-radius: 4px; cursor: pointer;">
                    ${cancelText}
                </button>
            </div>
        `;
        
        modalContent.innerHTML = modalHTML;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // 获取DOM元素
        const passwordInput = document.getElementById('passwordInput');
        const errorMessage = document.getElementById('errorMessage');
        const confirmBtn = document.getElementById('confirmPassword');
        const cancelBtn = document.getElementById('cancelPassword');
        const rememberCheckbox = document.getElementById('rememberToday');
        
        // 自动聚焦输入框
        setTimeout(() => passwordInput.focus(), 100);
        
        // 清理函数
        const cleanup = () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        };
        
        // 确认按钮事件
        confirmBtn.addEventListener('click', function() {
            const password = passwordInput.value.trim();
            const remember = rememberCheckbox ? rememberCheckbox.checked : false;
            
            if (!password) {
                errorMessage.textContent = '密码不能为空';
                errorMessage.style.display = 'block';
                passwordInput.focus();
                return;
            }
            
            cleanup();
            resolve({
                password: password,
                remember: remember,
                autoFilled: false
            });
        });
        
        // 取消按钮事件
        cancelBtn.addEventListener('click', function() {
            cleanup();
            resolve(null);
        });
        
        // 按Enter键确认
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });
        
        // 点击模态框外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cleanup();
                resolve(null);
            }
        });
    });
}  

// >>>>>>>>>>>>>>>>>大运 + 流年
// 更新宫位大运名称显示
function updatePalaceDayunName(data, dayunData) {
    const palaceContainer = document.querySelector('.chart-grid');
    if (!palaceContainer || !dayunData) return;

    // 1. 收集所有宫位，按age_range起始年龄升序排序（天地时间顺序）
    const sortedPalaces = [...data.palaces]
        .filter(p => p.age_range) // 过滤无效age_range
        .sort((a, b) => {
            const aStart = parseInt(a.age_range.split('-')[0]);
            const bStart = parseInt(b.age_range.split('-')[0]);
            return aStart - bStart; // 从小到大排列（4-13→14-23→…）
        });

    // 2. 定义大运名称顺序（紫占12宫位象义：命→兄→夫→子→财→疾→迁→友→官→田→福→父）
    const dayunNames = ['☯', '兄', '夫', '子', '财', '疾', '迁', '友', '官', '田', '福', '父'];
    const dayunNames2 = ['大运命宫', '大运兄弟宫', '大运夫妻宫', '大运子女宫', '大运财帛宫', '大运疾厄宫', '大运迁移宫', '大运交友宫', '大运官禄宫', '大运田宅宫', '大运福德宫', '大运父母宫'];
    // 3. 找到选中大运宫位在排序后的位置（天地枢纽定位）
    const selectedIndex = sortedPalaces.findIndex(p => 
        p.dizhi === dayunData.dizhi // 通过地支唯一标识宫位
    );
    if (selectedIndex === -1) return; // 未找到选中宫位，终止执行

    // 4. 遍历排序后宫位，生成大运名称（双宫同卦合并显示）
    sortedPalaces.forEach((palace, sortedIndex) => {
        // console.log(`Processing palace: ${palace.name}, dizhi: ${palace.dizhi}, sortedIndex: ${sortedIndex} , selectedIndex: ${selectedIndex}`);
        const palaceEl = document.getElementById(`${palace.dizhi}宫`);
        if (!palaceEl) return;

        // 4.1 创建/获取大运名称元素（天地卦象标记）
        const palaceNameEl = palaceEl.querySelector('.palace-name');
        let dayunEl = palaceEl.querySelector('.palace-name-dayun');
        if (!dayunEl) {
            dayunEl = document.createElement('div');
            dayunEl.className = 'palace-name-dayun';
            palaceNameEl.parentNode.insertBefore(dayunEl, palaceNameEl); // 插入到宫位名称正上方
        }

        // 4.2 计算大运名称（天地偏移逻辑）
        const offset = (sortedIndex - selectedIndex + 12) % 12; // 环形偏移（确保正数）
        const dayunName = dayunNames[offset]; // 选中宫位→offset=0→“大命”，其他按偏移取名称
        palaceEl.dayunName=dayunNames2[offset]; // 选中宫位→offset=0→“大运命宫”，其他按偏移取名称

        // 4.3 设置大运名称与样式（星曜显化规则）
        dayunEl.textContent = "["+dayunName+"]";
        dayunEl.style.cssText = `
            position: absolute;
            top: -15px; 
            left: 50%; 
            transform: translateX(-50%);
            color: ${dayunName === '大命' ? '#8b4513' : '#430450'}; /* 大命用深棕，其他用紫 */
            font-weight: ${dayunName === '大命' ? 'bold' : 'normal'}; 
            font-size: 12px;
            white-space: nowrap; 
            z-index: 10;
            background: rgba(241, 233, 249, 0.8); /* 米黄背景模拟命盘纸 */
            padding: 0 4px;
            border-radius: 2px;
        `;

    });
}


// 生成大运四化（根据宫位天干）
function generateDayunSihua(data, dayunPalace) {
    /**
     * 改进说明：
     * 1. 显示内容调整为“[大运名称] 星曜名”（如“[大子] 天梁 左辅”）
     * 2. 四化类型不显示，用颜色标记星曜（禄=绿、权=紫、科=蓝、忌=红）
     * 3. 星曜名按飞入顺序排列，用空格分隔
     */

    // 1. 获取大运宫位的核心信息（天地枢纽定位）
    const { dizhi: sourceDizhi, gan: gongGan, name: sourceName } = dayunPalace;
    if (!sourceDizhi || !gongGan) return; // 无地支/天干则终止

    // 2. 从命盘数据中获取飞宫图（feigong_map）——文档中`ziwei_chart.js`的核心结构
    const feigongMap = data.feigong_map;
    if (!feigongMap || !feigongMap[sourceDizhi]) return; // 无飞宫数据则终止

    // 3. 获取大运宫位的飞出四化信息（源宫位→四化类型→落点宫位+星曜）
    const flySihua = feigongMap[sourceDizhi]; // 示例：{ 禄: { target: '辰', star: '廉贞' }, 权: {...} }

    // 4. 用临时对象收集每个落点宫位的星曜（避免重复处理）
    const targetPalaceMap = {};
    Object.entries(flySihua).forEach(([sihuaType, sihuaInfo]) => {
        // 过滤无效四化（如无落点宫位）
        if (!sihuaInfo || !sihuaInfo.target || !sihuaInfo.star) return;

        const targetDizhi = sihuaInfo.target; // 落点宫位地支（如“辰”）
        const targetStar = sihuaInfo.star;     // 四化星曜（如“天梁”）

        // 初始化落点宫位的星曜列表
        if (!targetPalaceMap[targetDizhi]) {
            targetPalaceMap[targetDizhi] = [];
        }

        // 添加星曜信息（星曜名+四化类型）
        targetPalaceMap[targetDizhi].push({
            star: targetStar,
            sihuaType: sihuaType
        });
    });

    // 5. 遍历每个落点宫位，生成`palace-name-dayun`显示内容
    Object.entries(targetPalaceMap).forEach(([targetDizhi, stars]) => {
        // 5.1 定位落点宫位DOM元素
        const palaceEl = document.getElementById(`${targetDizhi}宫`);
        if (!palaceEl) return; // 宫位不存在则跳过

        // 5.2 获取落点宫位的`palace-name-dayun`元素（天地卦象标记）
        let dayunEl = palaceEl.querySelector('.palace-name-dayun'); // 大运名称元素

        // 5.4 格式化星曜名（用颜色标记四化类型）
        const starElements = stars.map(starInfo => {
            const span = document.createElement('span');
            span.textContent = SIHUA_START_MAP[starInfo.star] || starInfo.star; // 星曜名（如“天梁”）
            
            // 根据四化类型设置颜色（天地象义：禄=绿、权=紫、科=蓝、忌=红）
            let color;
            switch (starInfo.sihuaType) {
                case '禄': color = '#035a24'; break; // 禄=放大（绿）
                case '权': color = '#430450'; break; // 权=施压（紫）
                case '科': color = '#4169e1'; break; // 科=延缓（蓝）
                case '忌': color = '#ff0a0a'; break; // 忌=终止（红）
                default: color = '#8b4513'; // 默认=棕色（土）
            }
            span.style.color = color;
            span.style.fontWeight = 'normal';
            return span;
        });

        // 5.5 设置`palace-name-dayun`的显示内容（[大运名称] 星曜名1 星曜名2 ...）
        starElements.forEach((span, index) => {
            dayunEl.appendChild(span);
            if (index < starElements.length - 1) {
                dayunEl.appendChild(document.createTextNode(' ')); // 星曜间加空格
            }
        });

        // 5.6 调整样式（符合天地卦象的视觉显化）
        dayunEl.style.cssText = `
            position: absolute;
            top: -15px; 
            left: 50%; 
            transform: translateX(-50%);
            font-size: 12px;
            white-space: nowrap; 
            z-index: 10;
            background: rgba(241, 233, 249, 0.8); /* 米黄背景模拟命盘纸 */
            padding: 0 4px;
            border-radius: 2px;
            color: #430450; /* 大运名称用紫色（非忌） */
        `;
    });
}


// 清空大运显示（天地归墟逻辑）
function clearDayunDisplays() {
    /**
     * 移除所有宫位中的大运名称元素（palace-name-dayun）
     * 天地规则：心念离开大运→卦象标记消散
     */
    document.querySelectorAll('.palace-name-dayun').forEach(el => el.remove());
}


// 生成流年选项
function generateLiunianOptions(dayunPalace, birthYear) {
  const liunianSelector = document.getElementById('liunianSelector');
  liunianSelector.innerHTML = '<option value="">流年</option>';
  
  // 计算10年流年范围（大运年龄范围）
  const [startAge, endAge] = dayunPalace.age_range.split('-').map(Number);
  for (let age = startAge; age <= endAge; age++) {
    const year = birthYear + age - 1; // 虚岁转年份
    const option = document.createElement('option');
    option.value = year;
    option.textContent = `${year}年`;
    liunianSelector.appendChild(option);
  }
  
  liunianSelector.disabled = false;
}

// 计算流年宫位
function calculateLiunianPalace(data, selectedYear) {
    /**
     * 改进说明：
     * 1. 用`getLiunianGZ`计算流年干支（文档中已有函数）
     * 2. 提取流年地支，定位命盘中对应宫位（如“甲辰”→地支“辰”→“辰宫”）
     * 3. 未找到时返回命宫（默认）
     */
    if (!selectedYear || !data) return data.palaces.find(p => p.name === '命宫') || data.palaces[0];
    
    // 1. 计算流年干支（文档中`getLiunianGZ`函数）
    const liunianGZ = getLiunianGZ(selectedYear);
    const liunianZhi = liunianGZ.zhi; // 流年地支（如“辰”）
    
    // 2. 定位命盘中地支等于流年地支的宫位（天地卦象的“流年接口”）
    const liunianPalace = data.palaces.find(p => p.dizhi === liunianZhi);
    
    // 3. 未找到时返回命宫（默认）
    return liunianPalace || (data.palaces.find(p => p.name === '命宫') || data.palaces[0]);
}

// 更新宫位流年名称显示
function updatePalaceLiunianName(data, liunianData) {
    /**
     * 改进说明：
     * 1. 仿照大运`updatePalaceDayunName`的“排序→偏移→显示”逻辑
     * 2. 流年名称用“流命/流兄/…/流父”，显示位置在`palace-name-dayun`上方
     * 3. 样式用红色系区分流年（大运用棕色/紫色）
     */
    const palaceContainer = document.querySelector('.chart-grid');
    if (!palaceContainer || !liunianData) return;

    // 1. 收集所有宫位，按`age_range`起始年龄升序排序（天地时间顺序，同大运）
    const sortedPalaces = [...data.palaces]
        .filter(p => p.age_range) // 过滤无效age_range
        .sort((a, b) => {
            const aStart = parseInt(a.age_range.split('-')[0]);
            const bStart = parseInt(b.age_range.split('-')[0]);
            return aStart - bStart; // 从小到大排列（4-13→14-23→…）
        });

    // 2. 定义流年名称顺序（紫占12宫位象义：流命→流兄→…→流父）
    const liunianNames = ['☯', '兄', '夫', '子', '财', '疾', '迁', '友', '官', '田', '福', '父'];
    const liunianNames2 = ['流年命宫', '流年兄弟宫', '流年夫妻宫', '流年子女宫', '流年财帛宫', '流年疾厄宫', '流年迁移宫', '流年交友宫', '流年官禄宫', '流年田宅宫', '流年福德宫', '流年父母宫'];

    // 3. 找到选中流年宫位在排序后的位置（天地枢纽定位，同大运）
    const selectedIndex = sortedPalaces.findIndex(p => 
        p.dizhi === liunianData.dizhi // 通过地支唯一标识宫位
    );
    if (selectedIndex === -1) return; // 未找到选中宫位，终止执行

    // 4. 遍历排序后宫位，生成流年名称（双宫同卦合并显示，同大运）
    sortedPalaces.forEach((palace, sortedIndex) => {
        const palaceEl = document.getElementById(`${palace.dizhi}宫`);
        if (!palaceEl) return;

        // 4.1 创建/获取流年名称元素（天地卦象标记，同大运的`palace-name-dayun`）
        const palaceNameEl = palaceEl.querySelector('.palace-name');
        let liunianEl = palaceEl.querySelector('.palace-name-liunian');
        if (!liunianEl) {
            liunianEl = document.createElement('div');
            liunianEl.className = 'palace-name-liunian';
            // 插入到`palace-name-dayun`上方（若有），否则插入到`palace-name`上方
            const dayunEl = palaceEl.querySelector('.palace-name-dayun');
            if (dayunEl) {
                palaceNameEl.parentNode.insertBefore(liunianEl, dayunEl);
            } else {
                palaceNameEl.parentNode.insertBefore(liunianEl, palaceNameEl);
            }
        }

        // 4.2 计算流年名称（天地偏移逻辑，同大运的`offset`）
        const offset = (sortedIndex - selectedIndex + 12) % 12; // 环形偏移（确保正数）
        const liunianName = liunianNames[offset]; // 选中宫位→offset=0→“流命”，其他按偏移取名称
        palaceEl.liunianName = liunianNames2[offset]; // 存储流年全称（如“流年命宫”）

        // 4.3 设置流年名称与样式（同大运的样式逻辑，用红色系区分）
        liunianEl.textContent = `[${liunianName}]`;
        liunianEl.style.cssText = `
            position: absolute;
            top: -30px; /* 在palace-name-dayun上方（大运在-15px） */
            left: 50%;
            transform: translateX(-50%);
            color: ${liunianName === '流命' ? '#ff0000' : '#ff6666'}; /* 流命用深红，其他用浅红 */
            font-weight: ${liunianName === '流命' ? 'bold' : 'normal'};
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
            background: rgba(255, 240, 240, 0.8); /* 浅红背景（模拟命盘纸） */
            padding: 0 4px;
            border-radius: 2px;
        `;
    });
}

function generateLiunianSihua(data, selectedYear, liunianPalace) {
    /**
     * 改进说明：流年四化逻辑修正为“流年天干→四化星曜→飞宫落点”
     * 1. 用getLiunianGZ计算流年干支（取天干作为四化依据）
     * 2. 从TIANGAN_SIHUA获取流年天干的四化星曜
     * 3. 遍历飞宫图，显示流年四化在落点宫位的彩色星曜
     */

    // 1. 计算流年干支（文档中getLiunianGZ函数）
    const liunianGZ = getLiunianGZ(selectedYear);
    const liunianGan = liunianGZ.gan; // 流年天干（如“甲”）
    // const liunianZhi = liunianGZ.zhi; // 流年地支（如“辰”）
    
    
    // 3. 获取流年宫位的飞宫图（源宫位=流年地支）
    const feigongMap = data.feigong_map;
    const flySihua = feigongMap[getDizhiByGan(data, liunianGan)]; // 通过流年天干定位飞宫图
    if (!flySihua) return; // 无飞宫数据则终止
    
    // 4. 收集流年四化的落点星曜（仅处理流年天干对应的四化）
    const targetPalaceMap = {};
    Object.entries(flySihua).forEach(([sihuaType, sihuaInfo]) => {

        // 过滤无效四化（如无落点宫位）
        if (!sihuaInfo || !sihuaInfo.target || !sihuaInfo.star) return;  
        
        const targetDizhi = sihuaInfo.target; // 落点宫位地支（如“午”）
        const targetStar = sihuaInfo.star;     // 四化星曜（如“廉贞”）
        
        if (!targetPalaceMap[targetDizhi]) {
            targetPalaceMap[targetDizhi] = [];
        }
        targetPalaceMap[targetDizhi].push({
            star: targetStar,
            sihuaType: sihuaType
        });
    });
    
    // 5. 在落点宫位显示流年四化（仿照大运的彩色星曜逻辑）
    Object.entries(targetPalaceMap).forEach(([targetDizhi, stars]) => {
        const palaceEl = document.getElementById(`${targetDizhi}宫`);
        if (!palaceEl) return;
        
        // 获取流年名称元素（palace-name-liunian）
        let liunianEl = palaceEl.querySelector('.palace-name-liunian');

        // 格式化彩色星曜（禄绿、权紫、科蓝、忌红）
        const starElements = stars.map(starInfo => {
            const span = document.createElement('span');
            span.className = 'liunian-sihua-star';
            span.textContent = SIHUA_START_MAP[starInfo.star] || starInfo.star; 
            // 根据四化类型设置颜色（天地象义：禄=绿、权=紫、科=蓝、忌=红）
            let color;
            switch (starInfo.sihuaType) {
                case '禄': color = '#035a24'; break; // 禄=放大（绿）
                case '权': color = '#430450'; break; // 权=施压（紫）
                case '科': color = '#4169e1'; break; // 科=延缓（蓝）
                case '忌': color = '#ff0a0a'; break; // 忌=终止（红）
                default: color = '#8b4513'; // 默认=棕色（土）
            }
            span.style.color = color;
            span.style.fontWeight = 'normal';
            return span;
        });
        
        // 追加星曜到流年名称右侧
        starElements.forEach((span, index) => {
            liunianEl.appendChild(span);
            if (index < starElements.length - 1) {
                liunianEl.appendChild(document.createTextNode(' '));
            }
        });
        
        // 调整样式（与大运一致）
        liunianEl.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            white-space: nowrap;
            z-index: 10;
            background: rgba(255, 240, 240, 0.8);
            padding: 0 4px;
            border-radius: 2px;
            color: #ff6666; /* 流年名称用浅红（非忌） */
        `;
    });
}

// 清空流年显示（天地归墟逻辑）
function clearLiunianDisplays() {
    /**
     * 1. 移除所有宫位中的流年名称元素（palace-name-liunian）
     * 2. 清空流年选择器并禁用（回归默认状态）
     * 天地规则：大运未选→流年无依
     */
    document.querySelectorAll('.palace-name-liunian').forEach(el => el.remove());
    
    const liunianSelector = document.getElementById('liunianSelector');
    if (liunianSelector) {
        liunianSelector.innerHTML = '<option value="">选择流年</option>';
        liunianSelector.disabled = true;
    }
}

/**
 * 通过天干定位宫位地支（通用推演法）
 * @param {Object} data - 命盘完整数据（包含 palaces 数组）
 * @param {string} targetGan - 目标天干（如 '甲', '丙'）
 * @returns {string|null} - 对应的地支（如 '寅', '辰'），未找到则返回 null
 */
function getDizhiByGan(data, targetGan) {
    if (!data || !data.palaces || !targetGan) return null;
    
    // 遍历十二宫，寻找天干匹配的宫位
    const foundPalace = data.palaces.find(palace => palace.gan === targetGan);
    
    // 返回该宫位的地支，若未找到则返回 null
    return foundPalace ? foundPalace.dizhi : null;
}

function editFeigongstr(feigongstr) {
    // 获取所有宫位元素（DOM层）
    const palaceElements = document.querySelectorAll('.palace');
    // 存储宫位名称与对应的大运/流年信息（键值对：宫位名称→{dayunName, liunianName}）
    const palaceInfoMap = new Map();

    palaceElements.forEach(palaceEl => {
        // 提取宫位名称（如“财帛宫”，来自.palace-name元素）
        const ageRange = palaceEl.querySelector('.age-range').textContent.trim();
        // 提取大运名称（来自palaceEl的dayunName属性，由updatePalaceDayunName设置）
        const dayunName = palaceEl.dayunName || '无';
        // 提取流年名称（来自palaceEl的liunianName属性，由updatePalaceLiunianName设置）
        const liunianName = palaceEl.liunianName || '无';
        // 存入Map（键：宫位名称，值：大运/流年信息）
        palaceInfoMap.set(ageRange, { dayunName, liunianName });
    }); 

    const blocks = [];
    let currentBlock = '';
    feigongstr.split('\n').forEach(line => {
        // 如果行匹配宫位块开头（如“财帛宫 (乙卯) [86-95岁]:”），则开始新块
        if (line.match(/^[^\()]+? \([^)]+\) \[[^\]]+\]:$/)) {
            if (currentBlock) blocks.push(currentBlock);
            currentBlock = line + '\n';
        } else {
            currentBlock += line + '\n';
        }
    });
    if (currentBlock) blocks.push(currentBlock); // 添加最后一个块

    // 遍历所有宫位块，修改内容
    const updatedBlocks = blocks.map(block => {
        // 提取宫位名称（如“财帛宫”，从块的第一行获取）
        const firstLine = block.split('\n')[0];

        const ageRangeMatch = firstLine.match(/\[(.+)岁\]/); // 匹配“age-range”部分
        if (!ageRangeMatch) return block; // 无法识别，跳过
        const ageRange = ageRangeMatch[1]; // 年龄范围（如“86-95”）

        // 从Map中获取该宫位的大运/流年信息
        const { dayunName, liunianName } = palaceInfoMap.get(ageRange) || { dayunName: '无', liunianName: '无' };
        
        // 构造插入内容（**关键改进**：大运/流年行均前缀2个空格，用数组存储行）
        const insertLines = [
            `  大运宫位: ${dayunName}`,  // 前缀2空格
            `  流年宫位: ${liunianName}`   // 前缀2空格
        ];
        const insertContent = insertLines.join('\n'); // 用换行符拼接

        // 在块的末尾（身宫标记之后）插入内容
        // 找到“身宫标记: ”的行，在其后添加insertContent
        const lines = block.split('\n');
        const shengongLineIndex = lines.findIndex(line => line.startsWith('  身宫标记: '));
        if (shengongLineIndex !== -1) {
            // 在身宫标记行之后插入
            lines.splice(shengongLineIndex + 1, 0, insertContent.split('\n')[0], insertContent.split('\n')[1]);
            // 或者用更简单的方式：直接在块末尾添加（假设身宫标记是最后一行）
            // lines.push(insertContent.trim().split('\n')[0], insertContent.trim().split('\n')[1]);
        }
        
        // 重组块内容
        return lines.join('\n');
    });

    return updatedBlocks.join('\n'); // 将所有块重新组合成完整的字符串
}
// <<<<<<<<<<<<<<<<<<大运 + 流年