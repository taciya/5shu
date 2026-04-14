
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
            return {
                name: document.getElementById('name').value,
                birthTime: document.getElementById('birthTime').value , // 组合出生时间
                gender: document.getElementById('gender').value,
                birthPlace: document.getElementById('birthPlace').value,
                natalTime: document.getElementById('natalTime').value.trim() || ''
            };
        }

        // 加载保存的命盘列表
        async function loadSavedMingpanList(category = 'all') {
            const listContainer = document.getElementById('savedList');
            listContainer.innerHTML = '<div class="empty-list">正在加载命盘列表...</div>';
            
            try {
                // 从后端获取命盘数据
                const response = await fetch(getApiBaseUrl()+`/get_mingpan?category=${encodeURIComponent(category)}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`加载失败: ${errorData.message || response.statusText}`);
                }
                
                const result = await response.json();
                
                if (!result.success) {
                    throw new Error('加载失败: ' + result.message);
                }
                
                const mingpanList = result.data || [];
                
                if (mingpanList.length === 0) {
                    listContainer.innerHTML = '<div class="empty-list">暂无保存的命盘</div>';
                    return;
                }
                
                listContainer.innerHTML = '';
                
                mingpanList.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'saved-item';
                    itemElement.setAttribute('data-id', item.id);                    
                   
                    itemElement.innerHTML = `
                        <div class="saved-item-header">
                            <span class="saved-item-name">${item.name}</span>
                            <div class="saved-item-details">
                                ${item.data.birthTime}(${item.data.gender === 'male' ? '男' : '女'})
                            </div>
                            <span class="saved-item-category">${item.category}</span> 
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
                        e.stopPropagation(); // 阻止冒泡到双击事件
                        showDeleteDialog(item.id, item.name);
                    });           

                    listContainer.appendChild(itemElement);
                });
                
                
            } catch (error) {
                console.error('加载命盘列表时出错:', error);
                listContainer.innerHTML = `<div class="empty-list">加载失败: ${error.message}</div>`;
            }
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