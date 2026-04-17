
        let currentDeletingId = null; // 当前要删除的命盘ID      
        let lastSelectedCategory = 'all'; // 上一次选中的分类  
        let allCategories = new Set(['家人', '朋友', '客户']); // 所有分类集合    

        // DOM加载完成后执行
        document.addEventListener('DOMContentLoaded', function() {
            // 初始化记录上一次选中的分类
            const categorySelect = document.getElementById('categorySelect');
            lastSelectedCategory = categorySelect.value;
            
            // 首先加载所有分类
            loadAllCategories().then(() => {
                // 然后加载命盘列表
                loadSavedMingpanList();
            });
            
            // 绑定保存按钮事件
            document.getElementById('saveBtn').addEventListener('click', saveMingpan);
            
            // 绑定分类选择变化事件
            categorySelect.addEventListener('change', function() {
                if (this.value === 'new') {
                    // 显示新分类对话框
                    showNewCategoryDialog();
                    // 重置为上一次选中的分类
                    this.value = lastSelectedCategory;
                } else {
                    // 更新记录的分类
                    lastSelectedCategory = this.value;
                    // 加载分类下的列表
                    loadSavedMingpanList(this.value);
                }
            });

            // 绑定删除对话框按钮事件
            document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
            document.getElementById('cancelDeleteBtn').addEventListener('click', hideDeleteDialog); 
            
            // 绑定新分类对话框按钮事件
            document.getElementById('confirmNewCategory').addEventListener('click', createNewCategory);
            document.getElementById('cancelNewCategory').addEventListener('click', hideNewCategoryDialog);   
            
            // 绑定加密锁按钮事件
            const lockBtn = document.getElementById('lockBtn');
            if (lockBtn) {
                lockBtn.addEventListener('click', function() {
                    // 获取当前选中的分类
                    const categorySelect = document.getElementById('categorySelect');
                    const currentCategory = categorySelect.value;
                    
                    // 触发加载命盘列表，传递flg参数为true
                    loadSavedMingpanList(currentCategory, true);
                });
            }            
        });

        // 从服务器加载所有分类
        async function loadAllCategories() {
            try {
                // 从服务器获取所有命盘数据
                const response = await fetch(getApiBaseUrl()+`/get_all_categories`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`加载分类失败: ${errorData.message || response.statusText}`);
                }
                
                const result = await response.json();
                
                if (result.success && result.categories) {
                    // 更新分类集合
                    allCategories = new Set(result.categories);
                    
                    // 更新分类下拉框
                    updateCategorySelect();
                }
            } catch (error) {
                console.error('加载分类失败:', error);
            }
        }

        // 保存命盘
        async function saveMingpan() {
            const formData = collectFormData();
            const category = document.getElementById('categorySelect').value;            
          
            // 准备要保存的数据
            const saveData = {
                category: category === 'all' ? '未知' : category,
                name: formData.name || '未命名',
                data: formData
            };
            
            try {
                // 显示加载状态
                const saveBtn = document.getElementById('saveBtn');
                const originalText = saveBtn.innerHTML;
                saveBtn.innerHTML = '保存中...';
                saveBtn.disabled = true;

                // 发送保存请求到后端
                const response = await fetch(getApiBaseUrl()+`/save_mingpan`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(saveData)
                });

                // 恢复按钮状态
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;                
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`保存失败: ${errorData.message || response.statusText}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    alert('命盘保存成功！');
                    // 重新加载列表
                    loadSavedMingpanList(category === 'all' ? 'all' : category);
                } else {
                    throw new Error('保存失败: ' + result.message);
                }
            } catch (error) {
                console.error('保存命盘时出错:', error);
                alert('保存命盘时出错: ' + error.message);
            }
        }

        // 收集表单数据
        function collectFormData() {
            // 获取设备ID
            const deviceId = window.DEVICE_ID || deviceIdentifier.generateDeviceId();
            const deviceType = deviceIdentifier.getDeviceType();
            return {
                name: document.getElementById('name').value,
                birthTime: document.getElementById('birthTime').value , // 组合出生时间
                gender: document.getElementById('gender').value,
                birthPlace: document.getElementById('birthPlace').value,
                natalTime: document.getElementById('natalTime').value.trim() || '',
                // 添加设备信息
                deviceId: deviceId,
                deviceType: deviceType,
                saveTime: new Date().toISOString()
            };
        }

        // 加载保存的命盘列表
        async function loadSavedMingpanList(category = 'all',flg=false) {
            const listContainer = document.getElementById('savedList');
            listContainer.innerHTML = '<div class="empty-list">正在加载命盘列表...</div>';
            
            try {
                // 获取设备ID
                const deviceId = window.DEVICE_ID || deviceIdentifier.generateDeviceId();
             
                // 构建请求URL
                let url = getApiBaseUrl() + `/get_mingpan?category=${encodeURIComponent(category)}&device_id=${encodeURIComponent(deviceId)}`;
                let passwordInfo;
                
                // 检查今天是否已经验证过
                if (isPasswordVerifiedToday()) {
                    // 自动使用当前日期的密码
                    passwordInfo = {
                        password: getCurrentMMDDPassword(),
                        remember: true,
                        autoFilled: true
                    };                    

                } else if (flg) {
                    // 显示密码输入模态框
                    passwordInfo = await showPasswordModalWithMemory();                    
                    if (!passwordInfo) {
                        passwordInfo = {
                            password: '',
                            remember: false,
                            autoFilled: false
                        };  
                    }
                }else {
                    passwordInfo = {
                        password: '',
                        remember: false,
                        autoFilled: false
                    };                        
                }
                // 自动使用当前日期的密码
                url += '&password=' + passwordInfo.password;
                // 从后端获取命盘数据
                const response = await fetch(url);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`加载失败: ${errorData.message || response.statusText}`);
                }
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error('加载失败: ' + result.message);
                }
                
                const mingpanList = result.data || [];
                const isVerified = result.is_verified || false;

                // 密码验证成功，如果用户选择了"记住"，则标记今天已验证
                if (passwordInfo.remember && !passwordInfo.autoFilled) {
                    markPasswordVerifiedToday(passwordInfo.password);
                }     

                // 渲染命盘列表
                renderMingpanList(mingpanList, isVerified);
                    
                } catch (error) {
                    console.error('加载命盘列表时出错:', error);
                    listContainer.innerHTML = `<div class="empty-list">加载失败: ${error.message}</div>`;
                }
            }
        // 渲染命盘列表
        function renderMingpanList(mingpanList, isVerified) {
            const listContainer = document.getElementById('savedList');
            listContainer.innerHTML = '';
            
           
            mingpanList.forEach(item => {
                const itemElement = createMingpanItem(item, isVerified);
                listContainer.appendChild(itemElement);
            });
            
            // 如果没有命盘，显示提示
            if (mingpanList.length === 0) {
                listContainer.innerHTML = '<div class="empty-list">暂无保存的命盘</div>';
            }
        }

        // 创建命盘列表项
        function createMingpanItem(item, isVerified) {
            const itemElement = document.createElement('div');
            
            // 基础CSS类
            const baseClasses = ['saved-item'];
            
            // 如果是自己的命盘
            if (item.is_own) {
                baseClasses.push('own-item');
            } else {
                baseClasses.push('other-item');
            }
            
            // 如果是已验证状态但不是自己的
            if (isVerified && !item.is_own) {
                baseClasses.push('verified-other');
            }
            
            itemElement.className = baseClasses.join(' ');
            itemElement.setAttribute('data-id', item.id);
            
            // 设备信息
            const deviceInfo = item.device_info || {};
            const deviceType = deviceInfo.device_type || 'unknown';
            const deviceIcon = this.getDeviceIcon(deviceType);
            
            // 是否为当前设备
            const isCurrentDevice = deviceInfo.device_id === window.DEVICE_ID;
            // 设置背景颜色
            let bgColor, borderColor, textColor = '#333';
            
            if (item.is_own) {
                // 自己的命盘 - 默认背景
                bgColor = '#f5f5f5';  
                borderColor = '#ddd';  
            } else if (isVerified) {
                // 他人的命盘（已验证状态） - 浅绿色背景
                bgColor = '#e8f5e9';  // 淡绿色
                borderColor = '#4caf50';  // 绿色边框
            } else {
                // 默认样式
                bgColor = '#e3f2fd';  // 淡蓝色
                borderColor = '#2196f3';  // 蓝色边框
            }            
            // 应用样式
            itemElement.style.cssText = `
                background-color: ${bgColor};
                border: 1px solid ${borderColor};
                border-left: 4px solid ${borderColor};
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: ${textColor};
                align-items: center;                
            `;            
            itemElement.innerHTML = `
                <div class="saved-item-header">
                    <div class="saved-item-title">
                        <span class="saved-item-name">${item.name || '未命名'}</span>
                    </div>
                    <div class="saved-item-details" style="justify-content: center; ">
                        ${item.data.birthTime}(${item.data.gender === 'male' ? '男' : '女'})
                    </div>
                    <div class="saved-item-meta">
                        <span class="saved-item-category">
                            ${item.category}
                        </span>                   
                        <span class="device-info" title="${deviceType}设备">
                            ${deviceIcon} 
                            <!-- 
                            ${isCurrentDevice ? '当前设备' : deviceType}    
                            -->                          
                        </span>
                    </div>
                    <button class="btn-delete" title="删除命盘记录">-</button>
                </div>
            `;
            
            // 添加双击事件
            itemElement.addEventListener('dblclick', function() {
                loadMingpanToForm(item.data);
            });

            // 添加删除按钮事件
            const deleteBtn = itemElement.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showDeleteDialog(item.id, item.name);
            });
            
            return itemElement;
        }

        // 获取设备图标
        function getDeviceIcon(deviceType) {
            const iconMap = {
                'mobile': '📱',
                'tablet': '📱',
                'pc': '💻',
                'unknown': ''
            };
            return iconMap[deviceType] || '';
        }
        // 新增：格式化时间显示（包含分钟）
        function formatTimeWithMinutes(hour, minute) {
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            return `${h}:${m}时`;
        }

        // 更新分类下拉框
        function updateCategorySelect() {
            const select = document.getElementById('categorySelect');
            const currentCategory = select.value;
            
            // 保存当前选中的值
            const selectedValue = select.value;
            
            // 清空下拉框（保留"全部"和"新分类"选项）
            select.innerHTML = `
                <option value="all">全部</option>
                <option value="new">新分类</option>
            `;
            
            // 添加所有分类选项
            allCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                select.appendChild(option);
            });
            
            // 尝试恢复之前选中的值
            if (selectedValue && Array.from(select.options).some(opt => opt.value === selectedValue)) {
                select.value = selectedValue;
            } else {
                select.value = 'all';
            }
            
            lastSelectedCategory = select.value;
        }
        
        // 在加载数据时处理缺失的分钟字段
        function ensureMinuteField(data) {
            if (data && data.birthHour !== undefined && data.birthMinute === undefined) {
                // 如果只有birthHour没有birthMinute，从birthHour中解析
                const decimalHour = parseFloat(data.birthHour) || 0;
                const hour = Math.floor(decimalHour);
                const minute = Math.round((decimalHour - hour) * 60);
                
                return {
                    ...data,
                    birthHour: hour,
                    birthMinute: minute
                };
            }
            return data;
        }
        // 加载命盘数据到表单
        function loadMingpanToForm(data) {
            // 确保数据包含分钟字段
            const completeData = ensureMinuteField(data);            
            document.getElementById('name').value = data.name || '';
            document.getElementById('birthTime').value = data.birthTime;
            document.getElementById('gender').value = data.gender;
            document.getElementById('birthPlace').value = data.birthPlace;
            // 新增：加载 natalTime
            document.getElementById('natalTime').value = data.natalTime || '';            
            // 更新天干显示和真太阳时
            updateTrueSolar();
        }


    
        // 显示删除对话框
        function showDeleteDialog(id, name) {
            currentDeletingId = id;
            const message = `您确定要删除命盘记录 "${name}" 吗？此操作不可恢复。`;
            document.getElementById('deleteMessage').textContent = message;
            document.getElementById('confirmDeleteDialog').style.display = 'flex';
        }

        // 隐藏删除对话框
        function hideDeleteDialog() {
            document.getElementById('confirmDeleteDialog').style.display = 'none';
            currentDeletingId = null;
        }

        // 确认删除操作
        async function confirmDelete() {
            if (!currentDeletingId) return;
            
            try {
                // 显示加载状态
                const confirmBtn = document.getElementById('confirmDeleteBtn');
                const originalText = confirmBtn.innerHTML;
                confirmBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 删除中...';
                confirmBtn.disabled = true;
                
                // 发送删除请求
                const response = await fetch(getApiBaseUrl()+`/delete_mingpan/${currentDeletingId}`, {
                    method: 'DELETE'
                });
                
                // 恢复按钮状态
                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`删除失败: ${errorData.message || response.statusText}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    alert('命盘记录已成功删除');
                    // 重新加载列表
                    loadSavedMingpanList(document.getElementById('categorySelect').value);
                } else {
                    throw new Error('删除失败: ' + result.message);
                }
            } catch (error) {
                console.error('删除命盘时出错:', error);
                alert('删除命盘时出错: ' + error.message);
            } finally {
                hideDeleteDialog();
            }
        }        

        // 显示新分类对话框
        function showNewCategoryDialog() {
            document.getElementById('newCategoryName').value = '';
            document.getElementById('newCategoryDialog').style.display = 'flex';
            document.getElementById('newCategoryName').focus();
        }

        // 隐藏新分类对话框
        function hideNewCategoryDialog() {
            document.getElementById('newCategoryDialog').style.display = 'none';
        }

        // 创建新分类
        function createNewCategory() {
            const newCategoryName = document.getElementById('newCategoryName').value.trim();
            
            if (!newCategoryName) {
                alert('请输入新分类名称');
                return;
            }
            
            // 创建新分类选项
            const categorySelect = document.getElementById('categorySelect');
            const newOption = document.createElement('option');
            newOption.value = newCategoryName;
            newOption.textContent = newCategoryName;
            
            // 添加到下拉框（在"新分类"选项之前）
            const newOptionIndex = Array.from(categorySelect.options).findIndex(
                opt => opt.value === 'new'
            );
            
            if (newOptionIndex !== -1) {
                categorySelect.insertBefore(newOption, categorySelect.options[newOptionIndex]);
            } else {
                categorySelect.appendChild(newOption);
            }
            
            // 选中新创建的分类
            categorySelect.value = newCategoryName;
            lastSelectedCategory = newCategoryName;
            
            // 隐藏对话框
            hideNewCategoryDialog();
            
            // 提示用户
            alert(`新分类 "${newCategoryName}" 已创建！现在可以保存命盘到此分类了。`);
        }