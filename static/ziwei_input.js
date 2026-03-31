// 更新真太阳时
function updateTrueSolar() {
    const year = parseInt(document.getElementById('birthYear').value) || 0;
    const month = parseInt(document.getElementById('birthMonth').value) || 0;
    const day = parseInt(document.getElementById('birthDay').value) || 0;
    const hour = parseFloat(document.getElementById('birthHour').value) || 0;
    const minute = parseFloat(document.getElementById('birthMinute').value) || 0;
    const trueSolarText = document.getElementById('trueSolarText');

    if (year && month && day && !isNaN(hour) && !isNaN(minute)) {
        try {
            // 显示真太阳时信息
            const birthPlace = document.getElementById('birthPlace').value;
            if (birthPlace) {
                // const decimalHour = hour + minute / 60;
                const trueSolarTime = calculateTrueSolarTime(year, month, day, hour, minute,birthPlace);
                // 显示真太阳时完整时间（包含分钟）
                // const trueSolarHour = Math.floor(trueSolarTime.hour);
                // const trueSolarMinute = Math.round((trueSolarTime.hour - trueSolarHour) * 60);

                trueSolarText.innerText =
                    `${trueSolarTime.year}/${trueSolarTime.month}/${trueSolarTime.day} ${trueSolarTime.hour}:${trueSolarTime.minute}`;
                // 添加提示文本
                trueSolarText.title = "双击可编辑真太阳时";
            }

        } catch (e) {
            console.error("更新真太阳时出错:", e);
            trueSolarText.innerText = '';
        }
    } else {
        trueSolarText.innerText = '';
    }
}
// 新增：格式化小时和分钟显示
function formatHourWithMinutes(hour, minute) {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
}
// 解析真太阳时文本为日期时间组件
function parseTrueSolarText(text) {
    // 格式: "YYYY/MM/DD HH:MM" 或 "YYYY/MM/DD HH"
    const parts = text.split(' ');
    if (parts.length !== 2) {
        throw new Error('格式错误，应为 "年/月/日 小时:分钟"');
    }

    const datePart = parts[0].split('/');
    const timePart = parts[1];

    if (datePart.length !== 3) {
        throw new Error('日期格式错误');
    }

    const year = parseInt(datePart[0]);
    const month = parseInt(datePart[1]);
    const day = parseInt(datePart[2]);

    let hour, minute;
    if (timePart.includes(':')) {
        const timeParts = timePart.split(':');
        hour = parseInt(timeParts[0]);
        minute = parseInt(timeParts[1]) || 0;
    } else {
        hour = parseInt(timePart);
        minute = 0;
    }

    // 验证范围
    if (isNaN(year) || year < 1 || year > 9999) {
        throw new Error('年份无效');
    }
    if (isNaN(month) || month < 1 || month > 12) {
        throw new Error('月份无效');
    }
    if (isNaN(day) || day < 1 || day > 31) {
        throw new Error('日期无效');
    }
    if (isNaN(hour) || hour < 0 || hour >= 24) {
        throw new Error('小时无效');
    }
    if (isNaN(minute) || minute < 0 || minute >= 60) {
        throw new Error('分钟无效');
    }

    return { year, month, day, hour, minute };
}

// 启用真太阳时编辑
function enableTrueSolarEdit() {
    const trueSolarText = document.getElementById('trueSolarText');
    const currentText = trueSolarText.innerText.trim();

    // 如果没有内容，不进行编辑
    if (!currentText) {
        return;
    }

    // 添加编辑状态样式
    trueSolarText.classList.add('editing');

    // 保存原始值
    const originalText = currentText;

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'true-solar-input';
    input.placeholder = '格式: YYYY/MM/DD HH:MM';

    // 替换显示文本为输入框
    trueSolarText.innerHTML = '';
    trueSolarText.appendChild(input);
    input.focus();
    input.select();

    // 完成编辑的函数
    const finishEdit = () => {
        const newText = input.value.trim();

        // 如果文本没有变化，直接恢复
        if (newText === originalText) {
            trueSolarText.innerHTML = originalText;
            trueSolarText.classList.remove('editing');
            return;
        }

        try {
            // 解析输入的文字，得到真太阳时（trueSolarTime）
            const { year: trueYear, month: trueMonth, day: trueDay, hour: trueHour, minute: trueMinute } = parseTrueSolarText(newText);

            // 获取出生地
            const birthPlace = document.getElementById('birthPlace').value;

            // 使用全局CITY_LONGITUDE获取经度（默认北京）
            const longitude = CITY_LONGITUDE[birthPlace] || 116.4;

            // 计算时差（分钟）：与calculateTrueSolarTime中一致
            const timeDifferenceMinutes = (longitude - 120) * 4;

            // 计算真太阳时总分钟数
            const trueSolarTotalMinutes = trueHour * 60 + trueMinute;

            // 计算平太阳时总分钟数（逆操作：真太阳时减时差）
            let meanSolarTotalMinutes = trueSolarTotalMinutes - timeDifferenceMinutes;

            // 初始化平太阳时日期为真太阳时日期
            let meanYear = trueYear;
            let meanMonth = trueMonth;
            let meanDay = trueDay;

            // 处理跨日问题（逆操作，类似calculateTrueSolarTime但方向相反）
            if (meanSolarTotalMinutes < 0) {
                meanSolarTotalMinutes += 24 * 60; // 加一天
                meanDay--;
                if (meanDay < 1) {
                    meanMonth--;
                    if (meanMonth < 1) {
                        meanYear--;
                        meanMonth = 12;
                    }
                    // 获取上月最后一天
                    meanDay = new Date(meanYear, meanMonth, 0).getDate();
                }
            } else if (meanSolarTotalMinutes >= 24 * 60) {
                meanSolarTotalMinutes -= 24 * 60; // 减一天
                meanDay++;
                const daysInMonth = new Date(meanYear, meanMonth, 0).getDate();
                if (meanDay > daysInMonth) {
                    meanDay = 1;
                    meanMonth++;
                    if (meanMonth > 12) {
                        meanYear++;
                        meanMonth = 1;
                    }
                }
            }

            // 提取平太阳时的小时和分钟
            const meanHour = Math.floor(meanSolarTotalMinutes / 60);
            const meanMinute = Math.round(meanSolarTotalMinutes % 60);

            // 更新对应的输入框为平太阳时（出生时间）
            document.getElementById('birthYear').value = meanYear;
            document.getElementById('birthMonth').value = meanMonth;
            document.getElementById('birthDay').value = meanDay;
            document.getElementById('birthHour').value = meanHour;
            document.getElementById('birthMinute').value = meanMinute;

            // 触发真太阳时更新（会重新计算并显示真太阳时，应与用户输入一致）
            updateTrueSolar();
        } catch (error) {
            // 错误处理保持不变
            alert('解析错误: ' + error.message + '\n请使用格式: YYYY/MM/DD HH:MM');
            trueSolarText.innerHTML = originalText;
        }

        trueSolarText.classList.remove('editing');
    };

    // 失去焦点时完成编辑
    input.addEventListener('blur', finishEdit);

    // 回车键完成编辑
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            finishEdit();
        } else if (e.key === 'Escape') {
            // ESC键取消编辑
            trueSolarText.innerHTML = originalText;
            trueSolarText.classList.remove('editing');
        }
    });
}


// 页面加载时初始化
window.onload = function() {
    // 设置当前年份为默认值
    const currentYear = new Date().getFullYear();
    document.getElementById('birthYear').value = currentYear - 30;

    // 添加事件监听器
    document.getElementById('randomTimeBtn').addEventListener('click', generateRandomTime);
    document.getElementById('ziweiForm').addEventListener('submit', function(e) {
        e.preventDefault();
        clearConnectionLines();
        submitForm();
    });

    // 为时间输入框添加事件监听器
    document.getElementById('birthYear').addEventListener('input', updateTrueSolar);
    document.getElementById('birthMonth').addEventListener('input', updateTrueSolar);
    document.getElementById('birthDay').addEventListener('input', updateTrueSolar);
    document.getElementById('birthHour').addEventListener('input', updateTrueSolar);
    document.getElementById('birthMinute').addEventListener('input', updateTrueSolar);

    // // 添加出生地监听器
    document.getElementById('birthPlace').addEventListener('input', updateTrueSolar);

    // 为trueSolarText添加双击编辑功能
    document.getElementById('trueSolarText').addEventListener('dblclick', enableTrueSolarEdit);

    // 初始化toggleButton事件
    const toggleButton = document.getElementById('toggleButton');
    const inputSection = document.getElementById('inputSection');

    toggleButton.addEventListener('click', function() {
        if (inputSection.classList.contains('active')) {
            hideInputSection();
        } else {
            showInputSection();
        }
    });

    // 生成一个随机命盘作为示例
    generateRandomTime();

    // 默认隐藏输入区域
    hideInputSection();

    // 为时间输入框添加焦点时选中文本的功能
    const timeInputs = ['birthYear', 'birthMonth', 'birthDay', 'birthHour', 'birthMinute'];
    timeInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('focus', function() {
                // 使用setTimeout确保在浏览器焦点处理完成后执行选中
                setTimeout(() => {
                    this.select();
                }, 0);
            });

            // 可选：添加点击事件也触发选中，提供更好的用户体验
            input.addEventListener('click', function() {
                setTimeout(() => {
                    this.select();
                }, 0);
            });
            // 防止用户使用方向键时仍然全选
            input.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
                    e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    // 如果用户使用方向键，不清除选中状态
                    e.stopPropagation();
                }
            });
        }
    });
};
// 显示输入区域
function showInputSection() {
    const inputSection = document.getElementById('inputSection');
    inputSection.classList.add('active');
}

// 隐藏输入区域
function hideInputSection() {
    const inputSection = document.getElementById('inputSection');
    inputSection.classList.remove('active');
}
// document.addEventListener('DOMContentLoaded', function() {
//     const toggleButton = document.getElementById('toggleButton');
//     const inputSection = document.getElementById('inputSection');

//     toggleButton.addEventListener('click', function() {
//         if (inputSection.classList.contains('hidden')) {
//             // 显示输入区域
//             inputSection.classList.remove('hidden');
//         } else {
//             // 隐藏输入区域
//             inputSection.classList.add('hidden');
//         }
//     });
// });

// 随机生成出生时间
function generateRandomTime() {
    const year = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);

    document.getElementById('birthYear').value = year;
    document.getElementById('birthMonth').value = month;
    document.getElementById('birthDay').value = day;
    document.getElementById('birthHour').value = hour;
    document.getElementById('birthMinute').value = minute;
    // document.getElementById('name').value = '随机'+ new Date().getTime().toString().slice(-4);

    // 更新真太阳时
    updateTrueSolar();
    // 同时生成命盘
    submitForm();
}



// JavaScript 中可添加窗口大小监听
// window.addEventListener('resize', () => {
//     if (window.innerWidth <= 900) {
//         document.querySelector('.input-section').classList.add('hidden');
//     }
//     if (window.innerWidth > 1000) {
//         document.querySelector('.input-section').classList.remove('hidden');
//     }
// });

// 当在一个输入框中输入达到最大字符数时，光标会自动切换到下一个输入框
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有日期时间输入框
    const dateInputs = [
        document.getElementById('birthYear'),
        document.getElementById('birthMonth'),
        document.getElementById('birthDay'),
        document.getElementById('birthHour'),
        document.getElementById('birthMinute')
    ];
    
    
    // 为每个日期时间输入框添加事件监听
    dateInputs.forEach((input, index) => {
        // 输入事件 - 限制输入为数字
        input.addEventListener('input', function() {
            // 移除非数字字符
            this.value = this.value.replace(/\D/g, '');            
            
            // 检查是否达到最大长度
            if (this.value.length >= parseInt(this.getAttribute('maxlength'))) {
                // 如果是最后一个输入框，不切换
                if (index < dateInputs.length - 1) {
                    // 自动聚焦到下一个输入框
                    dateInputs[index + 1].focus();
                }
            }
        });
        
        // 按键事件 - 处理退格键
        input.addEventListener('keydown', function(e) {
            // 如果是退格键且输入框为空
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                // 阻止默认行为，避免删除前一个字符
                e.preventDefault();
                // 聚焦到上一个输入框
                dateInputs[index - 1].focus();
            }
            
            // 处理左箭头键
            if (e.key === 'ArrowLeft' && this.selectionStart === 0 && index > 0) {
                dateInputs[index - 1].focus();
            }
            
            // 处理右箭头键
            if (e.key === 'ArrowRight' && this.selectionStart === this.value.length && index < dateInputs.length - 1) {
                dateInputs[index + 1].focus();
            }
        });
        
    });
});