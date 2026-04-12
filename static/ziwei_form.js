// 验证表单数据
function validateForm() {
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const hour = parseInt(document.getElementById('birthHour').value);
    const minute = parseInt(document.getElementById('birthMinute').value);
    
    if (year < 1 || year > 9999) {
        showError('出生年份必须在1-9999之间');
        return false;
    }
    
    if (month < 1 || month > 12) {
        showError('出生月份必须在1-12之间');
        return false;
    }
    
    if (day < 1 || day > 31) {
        showError('出生日期必须在1-31之间');
        return false;
    }
    
    if (hour < 0 || hour >= 24) {
        showError('出生小时必须在0-23之间');
        return false;
    }
    
    if (minute < 0 || minute >= 60) {
        showError('出生分钟必须在0-59之间');
        return false;
    }
    
    return true;
}

// 提交表单数据到后端
async function submitForm() {
    if (!validateForm()) return;
    
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const hour = parseInt(document.getElementById('birthHour').value);
    const minute = parseInt(document.getElementById('birthMinute').value);
    const birthPlace = document.getElementById('birthPlace').value;
    // 新增：检查是否有 natalTime
    const natalTime = document.getElementById('natalTime').value.trim();    
    const natalData = parseNatalTime(natalTime) || { year: null, month: null, day: null, hour: null, minute: null }; // 解析 natalTime，若无效则使用默认值

    // 将小时和分钟合并为小数小时格式，保持向后兼容
    const decimalHour = hour + minute / 60;
    
    // 计算真太阳时（包含日期）
    const trueSolarTime = calculateTrueSolarTime(year, month, day, hour, minute, birthPlace);
    const trueSolarNatalTime = calculateTrueSolarTime(natalData.year, natalData.month, natalData.day, natalData.hour, natalData.minute, birthPlace);
    const formData = {
        name: document.getElementById('name').value,
        gender: document.getElementById('gender').value,
        birthYear: trueSolarTime.year,
        birthMonth: trueSolarTime.month,
        birthDay: trueSolarTime.day,
        birthHour: trueSolarTime.hour, 
        birthMinute: trueSolarTime.minute, 
        NatalYear: trueSolarNatalTime.year,
        NatalMonth: trueSolarNatalTime.month,
        NatalDay: trueSolarNatalTime.day,
        NatalHour: trueSolarNatalTime.hour, 
        NatalMinute: trueSolarNatalTime.minute,
        birthHour_decimal: decimalHour, // 保持小数小时格式
        birthPlace: birthPlace
    };
    // 显示加载指示器
    document.getElementById('loadingIndicator').style.display = 'block';
    
    try {
        // 发送请求到后端
        const response = await fetch(getApiBaseUrl()+'/generate_ziwei', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        
        const data = await response.json();
        data.ziwei_chart=JSON.parse(data.ziwei_chart) || {}; // 确保 ziwei_chart 存在
        data.ziwei_chart.name = formData.name;
        data.ziwei_chart.shichen = convertTimeFormat(decimalHour); // 使用合并后的小时
        data.natal_chart=JSON.parse(data.natal_chart) || {}; // 确保 natal_chart 存在
        data.natal_chart.name = formData.name;
        data.natal_chart.shichen = convertTimeFormat(decimalHour); // 使用合并后的小时        
        // 渲染命盘
        renderChart(data, formData);
        // 成功生成命盘后隐藏输入区域
        hideInputSection();        

        updateStarContainerWidths(); // 更新星盘容器宽度   
    } catch (error) {
        showError('生成命盘时出错: ' + error.message);
    } finally {
        // 隐藏加载指示器
        document.getElementById('loadingIndicator').style.display = 'none';
    }
}