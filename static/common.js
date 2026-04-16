
// 24节气太阳黄经（度）
const SOLAR_LONGITUDE = [
    285.0, 300.0, 315.0, 330.0, 345.0, 0.0,
    15.0, 30.0, 45.0, 60.0, 75.0, 90.0,
    105.0, 120.0, 135.0, 150.0, 165.0, 180.0,
    195.0, 210.0, 225.0, 240.0, 255.0, 270.0
];

// 天干数组
const ganList = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

// 地支数组
const zhiList = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 月份地支映射
const MONTH_ZHI_MAP = [
    "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"
];
// 节气计算相关常量
const J2000 = 2451545.0; // J2000儒略日
const RAD = Math.PI / 180.0; // 弧度转换

// 24节气名称
const SOLAR_TERMS = [
    "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
    "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
    "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
    "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
];
// 完整的城市经度映射表（国内+国际）
const CITY_LONGITUDE = {
    // 中国主要城市
    '北京': 116.4, '上海': 121.47, '广州': 113.23, '深圳': 114.07,
    '杭州': 120.19, '南京': 118.78, '武汉': 114.31, '成都': 104.06,
    '西安': 108.95, '天津': 117.2, '重庆': 106.54, '哈尔滨': 126.63,
    '长春': 125.35, '沈阳': 123.38, '大连': 121.62, '济南': 117.0,
    '青岛': 120.33, '苏州': 120.62, '无锡': 120.29, '宁波': 121.56,
    '厦门': 118.1, '福州': 119.3, '长沙': 112.97, '郑州': 113.65,
    '石家庄': 114.48, '太原': 112.53, '合肥': 117.27, '南昌': 115.89,
    '南宁': 108.33, '贵阳': 106.71, '昆明': 102.73, '拉萨': 91.11,
    '兰州': 103.73, '西宁': 101.74, '银川': 106.27, '乌鲁木齐': 87.68,
    '呼和浩特': 111.65, '海口': 110.35, '香港': 114.17, '澳门': 113.54,
    '台北': 121.5, '高雄': 120.28,
    
    // 亚洲其他城市
    '东京': 139.65, '大阪': 135.5, '首尔': 126.98, '平壤': 125.75,
    '曼谷': 100.5, '新加坡': 103.85, '吉隆坡': 101.7, '雅加达': 106.82,
    '马尼拉': 120.98, '胡志明市': 106.63, '河内': 105.85, '金边': 104.92,
    '仰光': 96.15, '新德里': 77.21, '孟买': 72.88, '加尔各答': 88.36,
    '伊斯兰堡': 73.04, '卡拉奇': 67.01, '科伦坡': 79.86, '加德满都': 85.32,
    
    // 北美城市
    '纽约': -74.01, '洛杉矶': -118.24, '芝加哥': -87.65, '休斯顿': -95.36,
    '多伦多': -79.38, '温哥华': -123.12, '墨西哥城': -99.13, '华盛顿': -77.04,
    '旧金山': -122.42, '西雅图': -122.33, '波士顿': -71.06, '迈阿密': -80.19,
    
    // 欧洲城市
    '伦敦': -0.13, '巴黎': 2.35, '柏林': 13.4, '莫斯科': 37.62,
    '罗马': 12.5, '马德里': -3.7, '雅典': 23.73, '维也纳': 16.37,
    '阿姆斯特丹': 4.9, '布鲁塞尔': 4.35, '日内瓦': 6.15, '斯德哥尔摩': 18.07,
    '奥斯陆': 10.75, '哥本哈根': 12.57, '赫尔辛基': 24.94, '都柏林': -6.26,
    
    // 大洋洲城市
    '悉尼': 151.2, '墨尔本': 144.96, '奥克兰': 174.76, '惠灵顿': 174.78,
    '布里斯班': 153.03, '珀斯': 115.86, '阿德莱德': 138.6,
    
    // 南美城市
    '圣保罗': -46.63, '里约热内卢': -43.17, '布宜诺斯艾利斯': -58.38,
    '利马': -77.03, '圣地亚哥': -70.65, '波哥大': -74.08,
    
    // 非洲城市
    '开罗': 31.24, '约翰内斯堡': 28.04, '开普敦': 18.42, '内罗毕': 36.82,
    '拉各斯': 3.38, '卡萨布兰卡': -7.61, '达累斯萨拉姆': 39.28,
    
    // 中东城市
    '迪拜': 55.3, '阿布扎比': 54.37, '多哈': 51.53, '利雅得': 46.72,
    '特拉维夫': 34.78, '安曼': 35.93, '贝鲁特': 35.5, '巴格达': 44.37
};
//  根据当前环境动态设置API基础URL
function getApiBaseUrl() {
    const { hostname, protocol } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1' || protocol === 'file:') {

        return 'http://127.0.0.1:5001';

    } else {

        return ''; // 或者 return 'https://your-production-domain.com';

    }

}
// 将十进制时间转换为 hh:ss 格式
function convertTimeFormat(time) {
    // 将输入拆分为小时和小数部分
    const [hours, decimalPart] = String(time).split('.').map(Number);
    
    // 计算分钟数（小数部分 * 60）
    const minutes = Math.round((decimalPart || 0) * 6);
    // console.log(hours, minutes.toString().padStart(2, '0'));
    // 格式化为 hh:ss
    return `${hours.toString().padStart(2, '0').substring(0, 2)}:${minutes.toString().padStart(2, '0').substring(0, 2)}`;

}

// 格式化小时
function formatHour(hour) {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);

    return `${hours}:${minutes}`;
}
function calculateTrueSolarTime(year, month, day, hour, minute, birthPlace) {
    if (!isOperable(year) || !isOperable(month) || !isOperable(day) || !isOperable(hour) || !isOperable(minute)) {  
        return { year: 0, month: 0, day: 0, hour: 0, minute: 0 }; // 返回原始输入，保持向后兼容
    }
    
    // 获取出生地经度（默认为北京）
    const longitude = CITY_LONGITUDE[birthPlace] || 116.4;
    
    // 将小时和分钟转换为总分钟数，提高计算精度
    const totalMinutes = hour * 60 + minute;
    
    // 计算时差（分钟）：每度经度对应4分钟时差
    const timeDifferenceMinutes = (longitude - 120) * 4;
    
    // 计算真太阳时（总分钟数）
    let trueSolarTotalMinutes = totalMinutes + timeDifferenceMinutes;
    
    // 处理跨日问题
    let adjustedDay = day;
    let adjustedMonth = month;
    let adjustedYear = year;
    
    if (trueSolarTotalMinutes < 0) {
        // 向前跨日
        trueSolarTotalMinutes += 24 * 60; // 加一天
        adjustedDay--;
        
        if (adjustedDay < 1) {
            adjustedMonth--;
            if (adjustedMonth < 1) {
                adjustedYear--;
                adjustedMonth = 12;
            }
            adjustedDay = new Date(adjustedYear, adjustedMonth, 0).getDate();
        }
    } else if (trueSolarTotalMinutes >= 24 * 60) {
        // 向后跨日
        trueSolarTotalMinutes -= 24 * 60; // 减一天
        adjustedDay++;
        
        const daysInMonth = new Date(adjustedYear, adjustedMonth, 0).getDate();
        if (adjustedDay > daysInMonth) {
            adjustedDay = 1;
            adjustedMonth++;
            if (adjustedMonth > 12) {
                adjustedYear++;
                adjustedMonth = 1;
            }
        }
    }
    
    // 将总分钟数转换回小时和分钟
    const trueSolarHour = Math.floor(trueSolarTotalMinutes / 60);
    const trueSolarMinute = Math.round(trueSolarTotalMinutes % 60);
    
    // 返回更精确的结果
    return {
        year: adjustedYear,
        month: adjustedMonth,
        day: adjustedDay,
        hour: trueSolarHour,
        minute: trueSolarMinute,
        // 保持向后兼容的小时字段
        decimalHour: trueSolarHour + trueSolarMinute / 60
    };
}
// 计算太阳黄经 (精确算法)
function calculateSolarLongitude(JD) {
    // 计算J2000起的天数
    const T = (JD - J2000) / 36525.0;
    
    // 平黄经（度）
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    
    // 平近点角（度）
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const M_rad = M * RAD;
    
    // 中心差
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad) +
                (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad) +
                0.000289 * Math.sin(3 * M_rad);
    
    // 真黄经（度）
    const O = L0 + C;
    
    // 章动
    const omega = 125.04 - 1934.136 * T;
    const dL = -0.00569 - 0.00478 * Math.sin(omega * RAD);
    
    // 视黄经
    const theta = O + dL;
    
    // 转换为0-360度范围
    return theta % 360;
}

// 计算节气 (精确算法)
function calculateSolarTerm(year, month, day, hour) {
    // 目标儒略日
    const targetJD = toJulianDate(year, month, day, hour);
    
    // 当前太阳黄经
    const currentLongitude = calculateSolarLongitude(targetJD);
    
    // 找到最接近的节气
    let minDiff = 360;
    let closestTerm = 0;
    
    for (let i = 0; i < 24; i++) {
        const diff = Math.abs(currentLongitude - SOLAR_LONGITUDE[i]);
        if (diff < minDiff) {
            minDiff = diff;
            closestTerm = i;
        }
    }
    
    return closestTerm;
}

// 精确计算天干地支信息 (使用严谨节气算法)
function calculateGanZhi(year, month, day, hour) {
    // 1. 年柱计算
    // 以立春为界（立春为第一个节气）
    const springTermIndex = calculateSolarTerm(year, month, day, hour);
    const isAfterSpring = springTermIndex >= 2; // 立春是第2个节气（0-indexed）
    
    const yearForGanZhi = isAfterSpring ? year : year - 1;
    const yearDiff = yearForGanZhi - 1900;
    const yearGanZhiIndex = (36 + yearDiff) % 60;
    const yearGan = ganList[yearGanZhiIndex % 10];
    const yearZhi = zhiList[yearGanZhiIndex % 12];
    
    // 2. 月柱计算 - 完全重写
    const termIndex = calculateSolarTerm(year, month, day, hour);
    const monthZhi = MONTH_ZHI_MAP[Math.floor(termIndex / 2)];
    
    // 五虎遁口诀计算月干
    const yearGanIndex = ganList.indexOf(yearGan);
    let monthGanIndex;
    
    if (yearGanIndex === 0 || yearGanIndex === 5) { // 甲或己
        monthGanIndex = 2; // 丙
    } else if (yearGanIndex === 1 || yearGanIndex === 6) { // 乙或庚
        monthGanIndex = 4; // 戊
    } else if (yearGanIndex === 2 || yearGanIndex === 7) { // 丙或辛
        monthGanIndex = 6; // 庚
    } else if (yearGanIndex === 3 || yearGanIndex === 8) { // 丁或壬
        monthGanIndex = 8; // 壬
    } else { // 戊或癸
        monthGanIndex = 0; // 甲
    }
    
    // 获取月支索引
    const monthZhiIndex = zhiList.indexOf(monthZhi);
    
    // 计算月干索引
    monthGanIndex = (monthGanIndex + monthZhiIndex) % 10;
    const monthGan = ganList[monthGanIndex];
    
    // 3. 日柱计算 - 使用更精确的算法
    // 以1900年1月1日（庚子日）为基础
    const baseDate = new Date(1900, 0, 1); // 1900-01-01
    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    
    // 计算日干支序号
    let dayGanZhiIndex = (36 + daysDiff) % 60;
    if (dayGanZhiIndex < 0) dayGanZhiIndex += 60;
    
    // 获取日干支
    const dayGan = ganList[dayGanZhiIndex % 10];
    const dayZhi = zhiList[dayGanZhiIndex % 12];
    
    // 4. 时柱计算 - 修复算法
    const hourIndex = Math.floor((hour + 1) / 2) % 12;
    const dayGanIndex = ganList.indexOf(dayGan);
    let hourGanIndex;
    
    if (dayGanIndex === 0 || dayGanIndex === 5) { // 甲或己
        hourGanIndex = 0; // 甲
    } else if (dayGanIndex === 1 || dayGanIndex === 6) { // 乙或庚
        hourGanIndex = 2; // 丙
    } else if (dayGanIndex === 2 || dayGanIndex === 7) { // 丙或辛
        hourGanIndex = 4; // 戊
    } else if (dayGanIndex === 3 || dayGanIndex === 8) { // 丁或壬
        hourGanIndex = 6; // 庚
    } else { // 戊或癸
        hourGanIndex = 8; // 壬
    }
    
    hourGanIndex = (hourGanIndex + hourIndex) % 10;
    const hourGan = ganList[hourGanIndex];
    const hourZhi = zhiList[hourIndex];
    
    return {
        year: `${yearGan}${yearZhi}`,
        month: `${monthGan}${monthZhi}`,
        day: `${dayGan}${dayZhi}`,
        hour: `${hourGan}${hourZhi}`
    };
}


// 计算儒略日 (公历转儒略日)
function toJulianDate(year, month, day, hour = 0) {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    
    return JD + hour / 24.0;
}


// 添加农历日期计算函数
function calculateLunarDate(year, month, day,hour) {
    // 这里应该是一个完整的农历计算函数
    // 由于农历计算非常复杂，这里使用简化版
    
    // 简化版：只返回干支表示的年月日
    const ganZhi = calculateGanZhi(year, month, day, hour); // 使用中午12点计算
    
    return {
        year: ganZhi.year,
        month: ganZhi.month,
        day: ganZhi.day,
        hour: ganZhi.hour
    };
}

// 计算真太阳时
// function calculateTrueSolarTime(year, month, day, hour, birthPlace) {
//     // 城市经度映射表
//     const CITY_LONGITUDE = {
//         '北京': 116.4, '上海': 121.47, '广州': 113.23, '深圳': 114.07,
//         '杭州': 120.19, '南京': 118.78, '武汉': 114.31, '成都': 104.06,
//         '西安': 108.95, '天津': 117.2, '重庆': 106.54, '哈尔滨': 126.63,
//         '长春': 125.35, '沈阳': 123.38, '大连': 121.62, '济南': 117.0,
//         '青岛': 120.33, '苏州': 120.62, '无锡': 120.29, '宁波': 121.56,
//         '厦门': 118.1, '福州': 119.3, '长沙': 112.97, '郑州': 113.65,
//         '石家庄': 114.48, '太原': 112.53, '合肥': 117.27, '南昌': 115.89,
//         '南宁': 108.33, '贵阳': 106.71, '昆明': 102.73, '拉萨': 91.11,
//         '兰州': 103.73, '西宁': 101.74, '银川': 106.27, '乌鲁木齐': 87.68,
//         '呼和浩特': 111.65, '海口': 110.35, '香港': 114.17, '澳门': 113.54,
//         '台北': 121.5, '高雄': 120.28
//     };
    
//     // 获取出生地经度（默认为北京）
//     const longitude = CITY_LONGITUDE[birthPlace] || 116.4;
    
//     // 计算时差（分钟）
//     const timeDifferenceMinutes = (longitude - 120) * 4;
    
//     // 转换为小时
//     const timeDifferenceHours = timeDifferenceMinutes / 60;
    
//     // 计算真太阳时
//     let trueSolarTime = hour + timeDifferenceHours;
    
//     // 处理跨日问题
//     let adjustedDay = day;
//     let adjustedMonth = month;
//     let adjustedYear = year;
    
//     if (trueSolarTime < 0) {
//         trueSolarTime += 24;
//         adjustedDay--;
//         if (adjustedDay < 1) {
//             adjustedMonth--;
//             if (adjustedMonth < 1) {
//                 adjustedYear--;
//                 adjustedMonth = 12;
//             }
//             adjustedDay = new Date(adjustedYear, adjustedMonth, 0).getDate();
//         }
//     } else if (trueSolarTime >= 24) {
//         trueSolarTime -= 24;
//         adjustedDay++;
//         const daysInMonth = new Date(adjustedYear, adjustedMonth, 0).getDate();
//         if (adjustedDay > daysInMonth) {
//             adjustedDay = 1;
//             adjustedMonth++;
//             if (adjustedMonth > 12) {
//                 adjustedYear++;
//                 adjustedMonth = 1;
//             }
//         }
//     }
    
//     // 返回结果
//     return {
//         year: adjustedYear,
//         month: adjustedMonth,
//         day: adjustedDay,
//         hour: Math.round(trueSolarTime * 100) / 100
//     };
// }

// 将小时和分钟转换为小数小时（保持向后兼容）
function convertToDecimalHour(hour, minute) {
    return hour + minute / 60;
}

// 将小数小时拆分为小时和分钟
function convertFromDecimalHour(decimalHour) {
    const hour = Math.floor(decimalHour);
    const minute = Math.round((decimalHour - hour) * 60);
    return { hour, minute };
}

/**
 * 判断一个值是否可安全操作
 * 可安全操作的条件：不是 null、undefined、NaN，不是空函数，不是空对象（可选）
 * 
 * @param {*} value - 要检查的值
 * @param {Object} [options] - 配置选项
 * @param {boolean} [options.checkEmptyObject=true] - 是否检查空对象
 * @param {boolean} [options.checkEmptyString=false] - 是否检查空字符串
 * @param {boolean} [options.checkZero=false] - 是否检查零值
 * @param {boolean} [options.checkEmptyArray=false] - 是否检查空数组
 * @param {boolean} [options.checkInvalidDate=true] - 是否检查无效日期
 * @returns {boolean} 是否可以安全操作
 */
function isOperable(value, options = {}) {
    // 默认配置
    const config = {
        checkEmptyObject: true,
        checkEmptyString: false,
        checkZero: false,
        checkEmptyArray: false,
        checkInvalidDate: true,
        ...options
    };
    
    // 1. 基础无效值检查
    if (value === null || value === undefined) {
        return false;
    }
    
    // 2. 检查 NaN
    if (typeof value === 'number' && isNaN(value)) {
        return false;
    }
    
    // 3. 检查无效日期
    if (config.checkInvalidDate && value instanceof Date && isNaN(value.getTime())) {
        return false;
    }
    
    // 4. 检查空字符串
    if (config.checkEmptyString && typeof value === 'string' && value.trim() === '') {
        return false;
    }
    
    // 5. 检查零值
    if (config.checkZero && value === 0) {
        return false;
    }
    
    // 6. 检查空数组
    if (config.checkEmptyArray && Array.isArray(value) && value.length === 0) {
        return false;
    }
    
    // 7. 检查空对象
    if (config.checkEmptyObject && value !== null && typeof value === 'object') {
        // 排除数组和函数
        if (Array.isArray(value)) {
            return true; // 数组已在上面的空数组检查中处理
        }
        
        // 检查是否是普通对象
        if (value.constructor === Object) {
            // 检查对象是否为空
            for (let key in value) {
                if (value.hasOwnProperty(key)) {
                    return true;
                }
            }
            return false;
        }
    }
    
    return true;
}

/**
 * 检查是否可安全访问对象属性
 * 
 * @param {Object} obj - 要检查的对象
 * @param {string} path - 属性路径，如 'a.b.c'
 * @param {*} [defaultValue] - 默认值
 * @returns {*} 属性值或默认值
 */
function safeGet(obj, path, defaultValue) {
    if (!isOperable(obj, { checkEmptyObject: false })) {
        return defaultValue;
    }
    
    try {
        const keys = path.split('.');
        let result = obj;
        
        for (let key of keys) {
            if (result === null || result === undefined || !result.hasOwnProperty(key)) {
                return defaultValue;
            }
            result = result[key];
        }
        
        return isOperable(result) ? result : defaultValue;
    } catch (error) {
        console.warn(`safeGet error for path "${path}":`, error);
        return defaultValue;
    }
}

/**
 * 安全调用函数
 * 
 * @param {Function} fn - 要调用的函数
 * @param {Array} [args=[]] - 参数数组
 * @param {*} [defaultValue] - 默认返回值
 * @returns {*} 函数返回值或默认值
 */
function safeCall(fn, args = [], defaultValue) {
    if (typeof fn !== 'function') {
        return defaultValue;
    }
    
    try {
        const result = fn.apply(null, args);
        return isOperable(result) ? result : defaultValue;
    } catch (error) {
        console.warn('safeCall error:', error);
        return defaultValue;
    }
}

/**
 * 跨平台获取元素尺寸的工具类
 * 支持多种尺寸类型和浏览器兼容性处理
 */
class ElementSize {
    /**
     * 获取元素的计算样式
     * 
     * @param {HTMLElement} element - 目标元素
     * @returns {CSSStyleDeclaration} 计算样式
     */
    static getComputedStyle(element) {
        if (!element || !(element instanceof HTMLElement)) {
            throw new Error('无效的 DOM 元素');
        }
        
        if (window.getComputedStyle) {
            return window.getComputedStyle(element);
        } else if (element.currentStyle) {
            return element.currentStyle; // IE8 及以下
        } else {
            return element.style;
        }
    }
    
    /**
     * 解析尺寸值，移除单位
     * 
     * @param {string} value - 带单位的尺寸值
     * @returns {number} 数值
     */
    static parseSizeValue(value) {
        if (typeof value === 'string') {
            // 移除单位，只保留数字
            const num = parseFloat(value);
            return isNaN(num) ? 0 : num;
        }
        return typeof value === 'number' ? value : 0;
    }
    
    /**
     * 获取元素的完整尺寸信息
     * 
     * @param {HTMLElement} element - 目标元素
     * @param {Object} [options] - 配置选项
     * @param {boolean} [options.includeScrollbar=true] - 是否包含滚动条
     * @returns {Object} 尺寸信息对象
     */
    static getFullDimensions(element, options = {}) {
        const config = {
            includeScrollbar: true,
            ...options
        };
        
        if (!element || !(element instanceof HTMLElement)) {
            return {
                width: 0,
                height: 0,
                clientWidth: 0,
                clientHeight: 0,
                offsetWidth: 0,
                offsetHeight: 0,
                scrollWidth: 0,
                scrollHeight: 0,
                boundingRect: { width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 }
            };
        }
        
        const computedStyle = this.getComputedStyle(element);
        const boxSizing = computedStyle.boxSizing || computedStyle.MozBoxSizing || 
                         computedStyle.WebkitBoxSizing || 'content-box';
        
        // 解析各种尺寸值
        const paddingLeft = this.parseSizeValue(computedStyle.paddingLeft);
        const paddingRight = this.parseSizeValue(computedStyle.paddingRight);
        const paddingTop = this.parseSizeValue(computedStyle.paddingTop);
        const paddingBottom = this.parseSizeValue(computedStyle.paddingBottom);
        
        const borderLeft = this.parseSizeValue(computedStyle.borderLeftWidth);
        const borderRight = this.parseSizeValue(computedStyle.borderRightWidth);
        const borderTop = this.parseSizeValue(computedStyle.borderTopWidth);
        const borderBottom = this.parseSizeValue(computedStyle.borderBottomWidth);
        
        const marginLeft = this.parseSizeValue(computedStyle.marginLeft);
        const marginRight = this.parseSizeValue(computedStyle.marginRight);
        const marginTop = this.parseSizeValue(computedStyle.marginTop);
        const marginBottom = this.parseSizeValue(computedStyle.marginBottom);
        
        // 获取各种尺寸属性
        const clientWidth = element.clientWidth || 0;
        const clientHeight = element.clientHeight || 0;
        
        const offsetWidth = element.offsetWidth || 0;
        const offsetHeight = element.offsetHeight || 0;
        
        const scrollWidth = element.scrollWidth || 0;
        const scrollHeight = element.scrollHeight || 0;
        
        // 获取边界矩形（相对于视口）
        let boundingRect = { width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
        try {
            boundingRect = element.getBoundingClientRect();
        } catch (e) {
            console.warn('获取边界矩形失败:', e);
        }
        
        // 计算内容区域尺寸
        let contentWidth, contentHeight;
        
        if (boxSizing === 'border-box') {
            // border-box: 宽度包括padding和border
            contentWidth = clientWidth - paddingLeft - paddingRight - borderLeft - borderRight;
            contentHeight = clientHeight - paddingTop - paddingBottom - borderTop - borderBottom;
        } else {
            // content-box: 宽度不包括padding和border
            contentWidth = clientWidth;
            contentHeight = clientHeight;
        }
        
        // 确保最小值为0
        contentWidth = Math.max(0, contentWidth);
        contentHeight = Math.max(0, contentHeight);
        
        return {
            // 基础尺寸
            width: offsetWidth,
            height: offsetHeight,
            
            // 客户端区域（不包括滚动条和边框）
            clientWidth,
            clientHeight,
            
            // 偏移尺寸（包括边框）
            offsetWidth,
            offsetHeight,
            
            // 滚动尺寸
            scrollWidth,
            scrollHeight,
            
            // 内容区域（根据box-sizing计算）
            contentWidth,
            contentHeight,
            
            // 包含内边距
            paddingWidth: clientWidth,
            paddingHeight: clientHeight,
            
            // 包含边框
            borderWidth: offsetWidth,
            borderHeight: offsetHeight,
            
            // 包含外边距
            marginWidth: offsetWidth + marginLeft + marginRight,
            marginHeight: offsetHeight + marginTop + marginBottom,
            
            // 内边距
            padding: {
                left: paddingLeft,
                right: paddingRight,
                top: paddingTop,
                bottom: paddingBottom,
                horizontal: paddingLeft + paddingRight,
                vertical: paddingTop + paddingBottom
            },
            
            // 边框
            border: {
                left: borderLeft,
                right: borderRight,
                top: borderTop,
                bottom: borderBottom,
                horizontal: borderLeft + borderRight,
                vertical: borderTop + borderBottom
            },
            
            // 外边距
            margin: {
                left: marginLeft,
                right: marginRight,
                top: marginTop,
                bottom: marginBottom,
                horizontal: marginLeft + marginRight,
                vertical: marginTop + marginBottom
            },
            
            // 边界矩形
            boundingRect,
            
            // 其他信息
            boxSizing,
            display: computedStyle.display,
            position: computedStyle.position,
            visibility: computedStyle.visibility
        };
    }
    
    /**
     * 获取特定类型的尺寸
     * 
     * @param {HTMLElement} element - 目标元素
     * @param {string} [type='border'] - 尺寸类型: 'content', 'padding', 'border', 'margin'
     * @returns {Object} 包含width和height的对象
     */
    static getSize(element, type = 'border') {
        const dimensions = this.getFullDimensions(element);
        
        switch (type.toLowerCase()) {
            case 'content':
                return {
                    width: dimensions.contentWidth,
                    height: dimensions.contentHeight
                };
                
            case 'padding':
                return {
                    width: dimensions.paddingWidth,
                    height: dimensions.paddingHeight
                };
                
            case 'border':
                return {
                    width: dimensions.borderWidth,
                    height: dimensions.borderHeight
                };
                
            case 'margin':
                return {
                    width: dimensions.marginWidth,
                    height: dimensions.marginHeight
                };
                
            case 'scroll':
                return {
                    width: dimensions.scrollWidth,
                    height: dimensions.scrollHeight
                };
                
            case 'client':
                return {
                    width: dimensions.clientWidth,
                    height: dimensions.clientHeight
                };
                
            case 'offset':
                return {
                    width: dimensions.offsetWidth,
                    height: dimensions.offsetHeight
                };
                
            default:
                throw new Error(`不支持的尺寸类型: ${type}。支持的类型: content, padding, border, margin, scroll, client, offset`);
        }
    }
    
    /**
     * 检查元素是否在视口中可见
     * 
     * @param {HTMLElement} element - 目标元素
     * @param {Object} [options] - 配置选项
     * @param {number} [options.threshold=0] - 可见阈值（0-1）
     * @returns {boolean} 是否可见
     */
    static isInViewport(element, options = {}) {
        const config = {
            threshold: 0,
            ...options
        };
        
        if (!element || !(element instanceof HTMLElement)) {
            return false;
        }
        
        try {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            const elementHeight = rect.bottom - rect.top;
            const elementWidth = rect.right - rect.left;
            
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
            
            const visibleArea = visibleHeight * visibleWidth;
            const elementArea = elementHeight * elementWidth;
            
            if (elementArea === 0) return false;
            
            const visibilityRatio = visibleArea / elementArea;
            
            return visibilityRatio > config.threshold;
        } catch (error) {
            console.warn('检查元素可见性失败:', error);
            return false;
        }
    }
}

// // 使用示例
// document.addEventListener('DOMContentLoaded', function() {
//     // 测试 isOperable 函数
//     console.group('isOperable 测试');
//     console.log('null:', isOperable(null)); // false
//     console.log('undefined:', isOperable(undefined)); // false
//     console.log('NaN:', isOperable(NaN)); // false
//     console.log('0:', isOperable(0)); // true
//     console.log('空字符串:', isOperable('')); // true
//     console.log('空对象:', isOperable({})); // false
//     console.log('非空对象:', isOperable({ a: 1 })); // true
//     console.log('空数组:', isOperable([])); // true
//     console.log('无效日期:', isOperable(new Date('invalid'))); // false
//     console.log('有效日期:', isOperable(new Date())); // true
//     console.groupEnd();
    
//     // 测试 safeGet
//     const obj = { a: { b: { c: 123 } } };
//     console.log('safeGet:', safeGet(obj, 'a.b.c')); // 123
//     console.log('safeGet 不存在的属性:', safeGet(obj, 'a.b.d', '默认值')); // 默认值
    
//     // 测试尺寸获取
//     const testElement = document.getElementById('test-element');
//     if (testElement) {
//         console.group('元素尺寸测试');
        
//         // 获取完整尺寸信息
//         const fullDimensions = ElementSize.getFullDimensions(testElement);
//         console.log('完整尺寸信息:', fullDimensions);
        
//         // 获取特定类型尺寸
//         console.log('内容尺寸:', ElementSize.getSize(testElement, 'content'));
//         console.log('边框尺寸:', ElementSize.getSize(testElement, 'border'));
//         console.log('内边距尺寸:', ElementSize.getSize(testElement, 'padding'));
//         console.log('外边距尺寸:', ElementSize.getSize(testElement, 'margin'));
        
//         // 检查元素是否可见
//         console.log('元素是否在视口中:', ElementSize.isInViewport(testElement));
        
//         console.groupEnd();
//     }
    
//     // 监听窗口变化，重新计算尺寸
//     let resizeTimeout;
//     window.addEventListener('resize', function() {
//         clearTimeout(resizeTimeout);
//         resizeTimeout = setTimeout(function() {
//             if (testElement) {
//                 const newDimensions = ElementSize.getFullDimensions(testElement);
//                 console.log('窗口变化后尺寸:', newDimensions);
//             }
//         }, 250);
//     });
// });

// // 导出函数（在模块环境中）
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = {
//         isOperable,
//         safeGet,
//         safeCall,
//         ElementSize
//     };
// } else if (typeof define === 'function' && define.amd) {
//     define([], function() {
//         return {
//             isOperable,
//             safeGet,
//             safeCall,
//             ElementSize
//         };
//     });
// } else {
//     // 全局暴露
//     window.ObjectUtils = { isOperable, safeGet, safeCall };
//     window.DOMUtils = { ElementSize };
// }

const STORAGE_KEYS = {
    PASSWORD_VERIFIED: 'password_verified_date',
    LAST_PASSWORD: 'last_valid_password',
    TERMINAL_ID: 'terminal_unique_id'
};

// 生成终端唯一标识（基于浏览器指纹）
function generateTerminalId() {
    // 简单的终端标识生成（基于用户代理和屏幕分辨率）
    const fingerprint = navigator.userAgent + 
                      screen.width + 'x' + screen.height + 
                      navigator.language + 
                      (navigator.hardwareConcurrency || '');
    
    // 使用简单的哈希函数生成唯一ID
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return 'terminal_' + Math.abs(hash).toString(36);
}

// 获取终端ID
function getTerminalId() {
    let terminalId = localStorage.getItem(STORAGE_KEYS.TERMINAL_ID);
    if (!terminalId) {
        terminalId = generateTerminalId();
        localStorage.setItem(STORAGE_KEYS.TERMINAL_ID, terminalId);
    }
    return terminalId;
}

// 生成基于终端和日期的存储键名
function getDailyStorageKey(baseKey) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const terminalId = getTerminalId();
    return `${baseKey}_${terminalId}_${today}`;
}

// 检查今天是否已经验证过密码
function isPasswordVerifiedToday() {
    const storageKey = getDailyStorageKey(STORAGE_KEYS.PASSWORD_VERIFIED);
    const verified = localStorage.getItem(storageKey);

    if (verified) {
        return verified;
    }
    
    return false;
}

// 标记今天密码已验证
function markPasswordVerifiedToday(password) {
    const storageKey = getDailyStorageKey(STORAGE_KEYS.PASSWORD_VERIFIED);
    localStorage.setItem(storageKey, password);
}

// 清除验证状态（用于调试或强制重新验证）
function clearPasswordVerification() {
    const keysToRemove = [];
    
    // 查找所有相关的存储键
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.PASSWORD_VERIFIED)) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

// 获取当前日期的MMDD格式密码
function getCurrentMMDDPassword() {
    // const now = new Date();
    // const month = String(now.getMonth() + 1).padStart(2, '0');
    // const day = String(now.getDate()).padStart(2, '0');
    // return month + day;
    const storageKey = getDailyStorageKey(STORAGE_KEYS.PASSWORD_VERIFIED);
    return localStorage.getItem(storageKey);
}

class ClipboardHelper {
    constructor() {
        this.supportsClipboardAPI = 'clipboard' in navigator;
        this.supportsWriteText = 'writeText' in (navigator.clipboard || {});
    }
    
    /**
     * 复制文本到剪贴板（最佳实践）
     * @param {string} text - 要复制的文本
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async copyText(text) {
        // 验证输入
        if (!text || typeof text !== 'string') {
            return {
                success: false,
                message: '无效的文本内容'
            };
        }
        
        // 方法1: 优先使用现代 Clipboard API
        if (this.supportsClipboardAPI && this.supportsWriteText) {
            try {
                await navigator.clipboard.writeText(text);
                return {
                    success: true,
                    message: '已成功复制到剪贴板',
                    method: 'clipboard-api'
                };
            } catch (err) {
                console.warn('Clipboard API 失败，尝试回退方案:', err);
            }
        }
        
        // 方法2: 使用 document.execCommand 作为回退
        try {
            const result = this.copyWithExecCommand(text);
            if (result.success) {
                return {
                    ...result,
                    method: 'exec-command'
                };
            }
        } catch (err) {
            console.warn('document.execCommand 失败:', err);
        }
        
        // 方法3: 使用临时 input 元素
        try {
            const result = this.copyWithInputElement(text);
            if (result.success) {
                return {
                    ...result,
                    method: 'input-element'
                };
            }
        } catch (err) {
            console.warn('Input 元素方法失败:', err);
        }
        
        // 方法4: 使用 contentEditable
        try {
            const result = this.copyWithContentEditable(text);
            if (result.success) {
                return {
                    ...result,
                    method: 'content-editable'
                };
            }
        } catch (err) {
            console.warn('ContentEditable 方法失败:', err);
        }
        
        // 所有方法都失败
        return {
            success: false,
            message: '无法复制到剪贴板，请手动复制',
            method: 'none'
        };
    }
    
    /**
     * 使用 document.execCommand 复制
     * @private
     */
    copyWithExecCommand(text) {
        try {
            const textArea = document.createElement('textarea');
            
            // 设置文本
            textArea.value = text;
            
            // 防止文本区域在页面中可见
            Object.assign(textArea.style, {
                position: 'fixed',
                top: '-1000px',
                left: '-1000px',
                width: '2em',
                height: '2em',
                padding: 0,
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                background: 'transparent'
            });
            
            document.body.appendChild(textArea);
            
            // 选择文本
            textArea.select();
            textArea.setSelectionRange(0, 99999); // 对于移动设备
            
            // 执行复制命令
            const success = document.execCommand('copy');
            
            // 清理
            document.body.removeChild(textArea);
            
            return {
                success: success,
                message: success ? '复制成功' : '复制命令失败'
            };
        } catch (err) {
            return {
                success: false,
                message: '复制失败: ' + err.message
            };
        }
    }
    
    /**
     * 使用 input 元素复制（某些移动设备兼容性更好）
     * @private
     */
    copyWithInputElement(text) {
        try {
            const input = document.createElement('input');
            
            // 设置输入框属性
            input.setAttribute('type', 'text');
            input.setAttribute('value', text);
            input.setAttribute('readonly', '');
            
            // 隐藏输入框
            Object.assign(input.style, {
                position: 'absolute',
                left: '-9999px',
                opacity: 0
            });
            
            document.body.appendChild(input);
            
            // 选择文本
            input.select();
            input.setSelectionRange(0, 99999);
            
            // 尝试复制
            let success = false;
            try {
                success = document.execCommand('copy');
            } catch (e) {
                // 在某些移动设备上，需要手动触发复制
                if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                    input.setSelectionRange(0, text.length);
                    input.focus();
                    document.execCommand('copy');
                    success = true;
                }
            }
            
            // 清理
            document.body.removeChild(input);
            
            return {
                success: success,
                message: success ? '复制成功' : '复制失败'
            };
        } catch (err) {
            return {
                success: false,
                message: '输入框复制失败: ' + err.message
            };
        }
    }
    
    /**
     * 使用 contentEditable 元素复制
     * @private
     */
    copyWithContentEditable(text) {
        try {
            const div = document.createElement('div');
            
            // 设置为可编辑
            div.contentEditable = true;
            
            // 设置内容和样式
            div.textContent = text;
            Object.assign(div.style, {
                position: 'fixed',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden'
            });
            
            document.body.appendChild(div);
            
            // 选择内容
            const range = document.createRange();
            range.selectNodeContents(div);
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            // 尝试复制
            const success = document.execCommand('copy');
            
            // 清理
            selection.removeAllRanges();
            document.body.removeChild(div);
            
            return {
                success: success,
                message: success ? '复制成功' : '复制失败'
            };
        } catch (err) {
            return {
                success: false,
                message: 'contentEditable 复制失败: ' + err.message
            };
        }
    }
    
    /**
     * 显示复制失败提示，并提供手动复制选项
     */
    showCopyFallback(text, element) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
        `;
        
        modal.innerHTML = `
            <h3 style="margin-top:0;">复制失败</h3>
            <p>无法自动复制，请手动复制以下文本：</p>
            <textarea 
                id="manualCopyText" 
                style="width:100%; height:200px; margin:10px 0; padding:10px; border:1px solid #ccc;"
                readonly>${text}</textarea>
            <div style="display:flex; gap:10px;">
                <button id="copyBtn" style="flex:1; padding:10px; background:#8b4513; color:white; border:none; border-radius:4px;">
                    点击复制
                </button>
                <button id="closeBtn" style="flex:1; padding:10px; background:#ccc; color:#666; border:none; border-radius:4px;">
                    关闭
                </button>
            </div>
        `;
        
        container.appendChild(modal);
        document.body.appendChild(container);
        
        // 自动选择文本
        const textarea = document.getElementById('manualCopyText');
        textarea.select();
        
        // 事件处理
        document.getElementById('copyBtn').addEventListener('click', () => {
            textarea.select();
            this.copyText(text).then(result => {
                if (result.success) {
                    alert('复制成功！');
                }
            });
        });
        
        document.getElementById('closeBtn').addEventListener('click', () => {
            document.body.removeChild(container);
        });
        
        // 点击外部关闭
        container.addEventListener('click', (e) => {
            if (e.target === container) {
                document.body.removeChild(container);
            }
        });
    }
}

// 新增：显示成功消息的函数
function showSuccess(message) {
    let successDiv = document.getElementById('successMessage');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'successMessage';
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(successDiv);
    }
    successDiv.textContent = message;
    successDiv.style.display = 'block';

    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// 新增：显示错误消息的函数
function showError(message) {
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}



/**
 * 替换字符串中的普通空格（半角空格）
 * @param {string} str - 待处理字符串
 * @param {string} [replacement=''] - 替换字符（默认空字符串，即去除空格）
 * @returns {string} 替换后的字符串
 */
function replaceSpaces(str, replacement = '') {
  // 边界处理：非字符串输入直接返回原值
  if (typeof str !== 'string') return str;
  // 正则匹配所有普通空格（/ /g），全局替换为目标字符
  return str.replace(/ /g, replacement);
}

// 解析 natalTime 输入
function parseNatalTime(natalTimeStr) {
    if (!natalTimeStr) {
        return null; 
    }
    
    // 支持多种格式：YYYY/MM/DD HH:MM, YYYY-MM-DD HH:MM, YYYY/MM/DD HH, YYYY/MM/DD
    const formats = [
        /^(\d{4})[/-](\d{1,2})[/-](\d{1,2}) (\d{1,2}):(\d{1,2})$/,
        /^(\d{4})[/-](\d{1,2})[/-](\d{1,2}) (\d{1,2})$/,
        /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/
    ];
    
    for (const format of formats) {
        const match = natalTimeStr.match(format);
        if (match) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]);
            const day = parseInt(match[3]);
            const hour = match[4] ? parseInt(match[4]) : 0;  // 默认为0时
            const minute = match[5] ? parseInt(match[5]) : 0;  // 默认为0分
            
            // 验证数据有效性
            if (year < 1 || year > 9999) throw new Error('年份必须在1-9999之间');
            if (month < 1 || month > 12) throw new Error('月份必须在1-12之间');
            if (day < 1 || day > 31) throw new Error('日期必须在1-31之间');
            if (hour < 0 || hour >= 24) throw new Error('小时必须在0-23之间');
            if (minute < 0 || minute >= 60) throw new Error('分钟必须在0-59之间');
            
            return { year, month, day, hour, minute };
        }
    }
    
    throw new Error('时间格式错误，请使用 YYYY/MM/DD HH:MM 格式');
}

/**
 * 文字列を YYYY/MM/DD HH:MM 形式に正規化する
 * yyyymmddhhmm などの形式に対応
 */
function normalizeDateTimeString(value) {
    // 数字以外を除去
    const digits = value.replace(/\D/g, '');
    
    if (digits.length >= 12) {
        // YYYY MM DD HH MM (12桁)
        return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)} ${digits.slice(8, 10)}:${digits.slice(10, 12)}`;
    } else if (digits.length >= 8) {
        // YYYY MM DD (8桁)
        return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)} 00:00`;
    }
    return value; // 変換できない場合はそのまま
}
/**
 * 核心解析函数：支持多种格式，包括 yyyymmddhhmm
 */
function parseDateTimeString(val) {
    if (!val) return null;
    
    // 去除非数字字符，检查是否为纯数字序列 (12位)
    const pureDigits = val.replace(/\D/g, '');
    if (pureDigits.length === 12) {
        return {
            year: parseInt(pureDigits.substring(0, 4)),
            month: parseInt(pureDigits.substring(4, 6)),
            day: parseInt(pureDigits.substring(6, 8)),
            hour: parseInt(pureDigits.substring(8, 10)),
            minute: parseInt(pureDigits.substring(10, 12))
        };
    }

    // 回退到原有的正则解析 (YYYY/MM/DD HH:MM 等)
    const regex = /(\d{4})[/-](\d{1,2})[/-](\d{1,2})\s+(\d{1,2}):(\d{1,2})/;
    const match = val.match(regex);
    if (match) {
        return {
            year: parseInt(match[1]),
            month: parseInt(match[2]),
            day: parseInt(match[3]),
            hour: parseInt(match[4]),
            minute: parseInt(match[5])
        };
    }
    return null;
}
/**
 * 格式化显示：将输入转换为 YYYY/MM/DD HH:MM
 */
function formatToStandard(inputId) {
    const input = document.getElementById(inputId);
    const dt = parseDateTimeString(input.value);
    if (dt) {
        const formatted = `${dt.year}/${String(dt.month).padStart(2, '0')}/${String(dt.day).padStart(2, '0')} ${String(dt.hour).padStart(2, '0')}:${String(dt.minute).padStart(2, '0')}`;
        input.value = formatted;
    }
}


// 终端标识生成和管理
class DeviceIdentifier {
    constructor() {
        this.STORAGE_KEY = 'ziwei_device_id';
        this.DEVICE_TYPE_KEY = 'ziwei_device_type';
    }
    
    // 生成固定终端ID
    generateDeviceId() {
        // 1. 尝试从localStorage获取现有ID
        let deviceId = localStorage.getItem(this.STORAGE_KEY);
        
        if (deviceId) {
            return deviceId;
        }
        
        // 2. 生成新的终端ID（基于浏览器指纹+时间戳+随机数）
        const components = [];
        
        // 浏览器信息
        components.push(navigator.userAgent);
        components.push(navigator.platform);
        components.push(navigator.language);
        components.push(screen.width + 'x' + screen.height);
        
        // 时间戳
        components.push(Date.now().toString());
        
        // 随机数
        components.push(Math.random().toString(36).substr(2, 9));
        
        // 计算哈希
        const combined = components.join('|');
        deviceId = this.hashString(combined);
        
        // 保存到localStorage
        localStorage.setItem(this.STORAGE_KEY, deviceId);
        
        return deviceId;
    }
    
    // 哈希函数
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return 'device_' + Math.abs(hash).toString(36);
    }
    
    // 获取设备类型
    getDeviceType() {
        const ua = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua)) {
            return 'mobile';
        } else if (/Tablet|iPad/i.test(ua)) {
            return 'tablet';
        } else {
            return 'pc';
        }
    }
    
    // 保存设备类型
    saveDeviceType() {
        const deviceType = this.getDeviceType();
        localStorage.setItem(this.DEVICE_TYPE_KEY, deviceType);
        return deviceType;
    }
    
    // 获取设备信息
    getDeviceInfo() {
        return {
            id: this.generateDeviceId(),
            type: this.getDeviceType(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`
        };
    }
}

// 全局设备标识器实例
const deviceIdentifier = new DeviceIdentifier();

// 在页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    const deviceInfo = deviceIdentifier.getDeviceInfo();
    console.log('设备信息:', deviceInfo);
    deviceIdentifier.saveDeviceType();
    
    // 将设备ID存储在全局变量中
    window.DEVICE_ID = deviceInfo.id;
});


// 密码验证管理
class PasswordVerification {
    constructor() {
        this.STORAGE_KEY = 'ziwei_password_verified';
    }
    
    // 检查今天是否已验证
    isVerifiedToday() {
        const verifiedData = localStorage.getItem(this.STORAGE_KEY);
        if (!verifiedData) return false;
        
        try {
            const data = JSON.parse(verifiedData);
            const today = new Date().toDateString();
            return data.date === today && data.verified === true;
        } catch (e) {
            return false;
        }
    }
    
    // 设置验证状态
    setVerified(status) {
        const data = {
            verified: status,
            date: new Date().toDateString(),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    
    // 清除验证状态
    clearVerification() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

const passwordVerifier = new PasswordVerification();