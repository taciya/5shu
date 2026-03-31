
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
    const currentYear = new Date().getFullYear();
    const true_solar_time = `${birth.true_solar_time}`+"";
    const rue_solar_time_fenzhong = true_solar_time.split(':')[1] % 12;


    // 获取三层卦象
    feigong_str=''
    feigong_str=feigong_str+`问卦编号：${birth.true_solar_time}`+'\n'
    feigong_str=feigong_str+`问卦占事：${data.name?data.name:'XXXXXX'}`+'\n'
    // feigong_str=feigong_str+`基本信息：${data.name} ${genderText} ${birth.gan_zhi}年生，当前是${currentYear}年`+'\n'
    feigong_str=feigong_str+`三层卦象：主卦(${data.three_level_hexagram['main_hexagram']})，十分卦(${data.three_level_hexagram['second_hexagram']})，分钟卦(${data.three_level_hexagram['third_hexagram']})[余数=${rue_solar_time_fenzhong}]`+'\n'
    feigong_str=feigong_str+'命盘信息：'+'\n'
    feigong_str=feigong_str+data.feigong_str.join('\n'); //将飞宫字符串赋值给全局变量

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
        data.palaces.forEach(palace => {
            findSihuaTracking(palace);
        });

    } else {
        showError('数据格式错误：缺少宫位信息');
    }
    initFlySihua(data.feigong_map);



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

    if (palace.name === three_level_hexagram['main_hexagram']) {

        const laiyinMark = document.createElement('div');
        laiyinMark.className = 'laiyin-mark zhu';
        laiyinMark.textContent = '因';
        palaceElement.appendChild(laiyinMark);

    }
    if (palace.name === three_level_hexagram['second_hexagram']) {

        const laiyinMark = document.createElement('div');
        laiyinMark.className = 'laiyin-mark ci';
        laiyinMark.textContent = '2';
        palaceElement.appendChild(laiyinMark);

    }
    if (palace.name === three_level_hexagram['third_hexagram']) {

        const laiyinMark = document.createElement('div');
        laiyinMark.className = 'laiyin-mark san';
        laiyinMark.textContent = '3';
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
    exportBtn.addEventListener('click', function() {

        // 填充文本内容
        exportText.textContent = feigong_str;
        // 显示模态框
        exportModal.style.display = 'flex';
        // initDivination();

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
    copyBtn.addEventListener('click', function() {
        // 创建临时文本区域
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = feigong_str;
        document.body.appendChild(tempTextArea);

        // 选择并复制文本
        tempTextArea.select();
        document.execCommand('copy');

        // 移除临时元素
        document.body.removeChild(tempTextArea);

        // 显示复制成功提示
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '已复制！';

        // 2秒后恢复原文本
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
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
function findSihuaTracking2(currentPalace,three_level) {
    const hexagram={
        'zhu':"追四化-主卦(xxx)",
        'ci':"追四化-十分卦(xxx)",
        'san':"追四化-分钟卦(xxx)"
    }
    feigong_str=feigong_str+'\n'+`${hexagram[three_level].replace("xxx",currentPalace.name)} ：`+'\n'
    // 为每个星曜显示追踪信息
    currentPalace.main_stars.forEach(starName => {
        const sources = getSihuaSources(starName, currentPalace);
        sources.forEach(source => {
            const palaces=findPalacesByTianGan(source.palace)
            palaces_str=''
            palaces.forEach(palace=>{
                palace.querySelectorAll('.palace-footer').forEach(div=>{
                    temp_str=div.textContent.trim().substring(0,4)
                    palaces_str=palaces_str+` ${temp_str.substring(2,4)}宫 (${temp_str.substring(0,2)})`+' '
                })
            })
            feigong_str=feigong_str+` 追${source.sihuaType}(${source.fullName}) : ${palaces_str}`+'\n'
        });

    });
    currentPalace.minor_stars.forEach(starName => {
        const sources = getSihuaSources(starName, currentPalace);
        sources.forEach(source => {
            const palaces=findPalacesByTianGan(source.palace)
            palaces_str=''
            palaces.forEach(palace=>{
                palace.querySelectorAll('.palace-footer').forEach(div=>{
                    temp_str=div.textContent.trim().substring(0,4)
                    palaces_str=palaces_str+` ${temp_str.substring(2,4)}宫 (${temp_str.substring(0,2)})`+' '
                })
            })
            feigong_str=feigong_str+` 追${source.sihuaType}(${source.fullName}) : ${palaces_str}`+'\n'
        });

    });
}
// palace,data.three_level_hexagram
// currentPalace,three_level
function findSihuaTracking(palace) {

    const zhu=document.getElementById('chartGrid').querySelector('.laiyin-mark.zhu').parentNode;
    const zhu_palace_name=zhu.querySelector('.palace-footer').textContent.trim().substring(2,4);
    const ci=document.getElementById('chartGrid').querySelector('.laiyin-mark.ci').parentNode;
    const ci_palace_name=ci.querySelector('.palace-footer').textContent.trim().substring(2,4);
    const san=document.getElementById('chartGrid').querySelector('.laiyin-mark.san').parentNode;
    const san_palace_name=san.querySelector('.palace-footer').textContent.trim().substring(2,4);
    if (palace.name.substring(0,2).trim() === zhu_palace_name.trim()) {
        findSihuaTracking2(palace,'zhu');
    }
    if (palace.name.substring(0,2).trim() === ci_palace_name.trim()) {
        findSihuaTracking2(palace,'ci');
    }
    if (palace.name.substring(0,2).trim() === san_palace_name.trim()) {
        findSihuaTracking2(palace,'san');
    }





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
        title: '命宫 - 自我与根源',
        meanings: [
            '自己，气运，灵魂，我，魄力，业力，神识',
            '命数，气数，宿缘，宿命，命名，使命，寿命',
            '口令，奉命，生命线，命案，算命，命理，命盘',
            '先天根基，个性本质，人生起点',
            '与疾厄宫一体两面：命主精神，疾厄主肉体'
        ],
        examples: [
            '命宫强：自主性强，有领导力',
            '命宫弱：易受外界影响，依赖他人',
            '命宫化禄：天生福气，易得助力',
            '命宫化忌：一生劳碌，自我设限'
        ]
    },
    '兄弟': {
        title: '兄弟宫 - 平辈与协作',
        meanings: [
            '同学，同事，合同，合作，配偶，竞争，同行',
            '财库，竞争，母亲，群友，嫁娶，结婚，同窗',
            '盟友，契约，弟子，小迷弟，流动的钱财',
            '交际圈子，零用钱，手足情谊',
            '成就线（兄弟宫为官禄宫的疾厄）'
        ],
        examples: [
            '兄弟宫吉：人际关系和谐，得朋友助',
            '兄弟宫凶：易有口舌是非，合作不利',
            '兄弟宫化禄：朋友多，易得偏财',
            '兄弟宫化忌：为朋友破财，兄弟缘薄'
        ]
    },
    '夫妻': {
        title: '夫妻宫 - 因果与契约',
        meanings: [
            '因果位，爱情，结果，恋爱，情仇，恩怨',
            '成败，缠绵，情淡，情浓，情债，夫妻店',
            '夫权，妻妾成群，夫妻肺片，夫妻档',
            '夫妻财产，夫家，妻家，婚姻质量',
            '看配偶特征及婚姻相处模式'
        ],
        examples: [
            '夫妻宫吉：婚姻和谐，得配偶助力',
            '夫妻宫凶：感情多波折，易分离',
            '夫妻宫化禄：配偶有助力，感情甜蜜',
            '夫妻宫化忌：婚姻压力大，为情所困'
        ]
    },
    '子女': {
        title: '子女宫 - 创造与传承',
        meanings: [
            '儿子，下属，徒弟，粉丝，宠物，女儿',
            '生殖，性爱，分娩，哺育，子集，孩子',
            '繁衍，幼苗，幼体，君子，公子，鼻子',
            '胖子，格子，石子，竹子，少女，女孩',
            '桃花位，创造力，投资运'
        ],
        examples: [
            '子女宫吉：子女有成，人际关系好',
            '子女宫凶：为子女操心，部属难管',
            '子女宫化禄：桃花旺，易得晚辈助',
            '子女宫化忌：为子女付出多，投资失利'
        ]
    },
    '财帛': {
        title: '财帛宫 - 资源与价值',
        meanings: [
            '钱财，资源，名利，积蓄，价值，盈亏',
            '得失，财路，筹码，财源，财神，财主',
            '守财奴，贪财，财务报表，财经新闻',
            '才气，财新网，财联社，赚钱能力',
            '看求财方式及理财观念'
        ],
        examples: [
            '财帛宫吉：财运佳，理财能力强',
            '财帛宫凶：钱财难聚，易破财',
            '财帛宫化禄：收入丰，易得财',
            '财帛宫化忌：为财烦心，财务压力大'
        ]
    },
    '疾厄': {
        title: '疾厄宫 - 肉体与健康',
        meanings: [
            '肉体，病痛，隐患，体质，伤残，病灶',
            '器官，血光，免疫，衰弱，创伤，代谢',
            '残疾，急诊，疾跑，疾苦，疾书',
            '疾言厉色，疾走，疾步如飞，疾呼',
            '疾风知劲草，疾恶如仇，身体健康状况'
        ],
        examples: [
            '疾厄宫吉：身体健康，抵抗力强',
            '疾厄宫凶：体弱多病，易有灾厄',
            '疾厄宫化禄：注重养生，康复力强',
            '疾厄宫化忌：慢性病缠身，健康隐患'
        ]
    },
    '迁移': {
        title: '迁移宫 - 变动与机遇',
        meanings: [
            '出行，变动，远方，漂泊，环境，机遇',
            '迁徙，异乡，动荡，转机，旅途，跨界',
            '流转，位移，外缘，迁就，轻侈，淫秽',
            '因果，行为的结果，外出运',
            '社交能力，人生际遇'
        ],
        examples: [
            '迁移宫吉：外出发展有利，人际关系佳',
            '迁移宫凶：外出多阻碍，宜守不宜攻',
            '迁移宫化禄：远地发展有利，易得外助',
            '迁移宫化忌：外出不顺，宜本地发展'
        ]
    },
    '交友': {
        title: '交友宫 - 人脉与群体',
        meanings: [
            '众生，人脉，群体，客户，团队，社群',
            '大众，旁观，泛交，群众，随缘，过客',
            '交谊舞，交易所，交通卡，交规考试',
            '交杯酒，交通肇事，交钥匙，交战国',
            '交头接耳，交火线，盟友，网友，战友，友商'
        ],
        examples: [
            '交友宫吉：朋友多，得人相助',
            '交友宫凶：易遇小人，朋友助力少',
            '交友宫化禄：人脉广，易得朋友财',
            '交友宫化忌：为朋友破财，人际关系紧张'
        ]
    },
    '官禄': {
        title: '官禄宫 - 事业与作为',
        meanings: [
            '行为，事业，功名，作为，功业，职涯',
            '功过，干活，做事，行动，官场小说',
            '官渡之战，禄存，官网，官话，官宣文案',
            '判官，官司，长官，官报，官方',
            '工作态度，职业发展，社会地位'
        ],
        examples: [
            '官禄宫吉：事业顺利，易得赏识',
            '官禄宫凶：工作多波折，职场竞争大',
            '官禄宫化禄：事业发展佳，易升迁',
            '官禄宫化忌：工作压力大，易换工作'
        ]
    },
    '田宅': {
        title: '田宅宫 - 根基与产业',
        meanings: [
            '祖产，根基，房产，祖荫，家宅，核心',
            '祖业，天魂，家运，Q群，本性，空间',
            '办公室，田园诗，宅急送，田字格',
            '宅文化，田忌赛马，宅男，田螺姑娘',
            '宅斗剧，宅心，家庭环境，不动产运'
        ],
        examples: [
            '田宅宫吉：家运好，有祖产，置业运佳',
            '田宅宫凶：家宅不宁，易搬家，无祖产',
            '田宅宫化禄：置产容易，家庭和谐',
            '田宅宫化忌：为家所累，房产纠纷'
        ]
    },
    '福德': {
        title: '福德宫 - 思想与福报',
        meanings: [
            '想法，思想，心情，爷爷，心念，慧根',
            '妄念，福尔摩斯，福建土楼，德育分',
            '福袋盲盒，福利，幸福，眼福，全家福',
            '师德，医德，功德，大德',
            '自化科：理想化，没受过社会毒打',
            '精神享受，前世修为，晚年运'
        ],
        examples: [
            '福德宫吉：心态好，有福气，精神充实',
            '福德宫凶：多烦恼，想不开，福报浅',
            '福德宫化禄：心想事成，精神愉悦',
            '福德宫化忌：钻牛角尖，精神压力大'
        ]
    },
    '父母': {
        title: '父母宫 - 根源与传承',
        meanings: [
            '体系/领域，师长，文书，祖脉，领导',
            '长辈，尊长，宗族，公务员，宗亲',
            '皮肤，地魂，字母，酵母，韵母，云母',
            '欧姆，贝母，母校，遗传基因',
            '文书运，考运，与长辈关系'
        ],
        examples: [
            '父母宫吉：得长辈助，文书运佳，遗传好',
            '父母宫凶：与长辈缘薄，文书麻烦多',
            '父母宫化禄：得父母遗产，考试运佳',
            '父母宫化忌：为长辈操心，文书出错'
        ]
    }
};
// 显示宫位详细信息
function showPalaceMeaning(palaceName, element) {
    const tooltip = document.getElementById('star-tooltip') || createStarTooltip();
    const meaning = palaceMeaningMap[palaceName] || {
        title: `${palaceName}宫 - 详细信息`,
        meanings: ['暂无此宫位的详细说明'],
        examples: []
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
                <div style="font-size:12px; line-height:1.4;">
                    ${meaning.meanings.map(m => `• ${m}`).join('<br>')}
                </div>
            </div>
        `;
    }

    // 添加实际应用示例
    if (meaning.examples && meaning.examples.length > 0) {
        content += `
            <div style="margin-bottom:10px;">
                <div style="font-weight:bold; color:#2c3e50; margin-bottom:5px;">💡 实际应用：</div>
                <div style="font-size:12px; line-height:1.4; color:#7f8c8d;">
                    ${meaning.examples.map(e => `→ ${e}`).join('<br>')}
                </div>
            </div>
        `;
    }

    // 添加四化影响说明
    content += `
        <div style="margin-bottom:5px;">
            <div style="font-weight:bold; color:#2c3e50; margin-bottom:3px;">🎯 四化影响：</div>
            <div style="font-size:11px; line-height:1.3; color:#666;">
                <span style="color:#035a24;">禄</span>=增益 • 
                <span style="color:#430450;">权</span>=巩固 • 
                <span style="color:#4169e1;">科</span>=名誉 • 
                <span style="color:#ff0a0a;">忌</span>=压力
            </div>
        </div>
    `;

    tooltip.innerHTML = content;
    tooltip.style.display = 'block';
    
    // 更新当前显示状态
    currentDisplayedStar = `palace_${palaceName}`;
    element.style.cursor = 'pointer';
}



// 隐藏宫位信息
function hidePalaceMeaning() {
    const tooltip = document.getElementById('star-tooltip');
    if (tooltip && currentDisplayedStar && currentDisplayedStar.startsWith('palace_')) {
        // tooltip.style.display = 'none';
        // currentDisplayedStar = null;
    }
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
        
        // 点击事件
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 如果点击的是当前已显示的宫位，且在小屏幕下，不执行任何操作
            if (currentDisplayedStar === `palace_${palaceName}`) {
                return;
            }
            
            showPalaceMeaning(palaceName, element);
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