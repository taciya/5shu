// 用户认证功能
let currentUser = null;

// 检查登录状态
async function checkLoginStatus() {
    try {
        const response = await fetch(getApiBaseUrl()+'/api/user/current');
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            updateUIForLoggedInUser();
        } else {
            updateUIForLoggedOutUser();
        }
    } catch (error) {
        updateUIForLoggedOutUser();
    }
}

// 更新UI为已登录状态
function updateUIForLoggedInUser() {
    document.getElementById('loginBtnText').textContent = currentUser.username;
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userPoints').textContent = currentUser.points;
    document.getElementById('userInfo').style.display = 'block';
    
    // 如果是管理员，显示后台管理链接
    if (currentUser.user_type === 'admin') {
        document.getElementById('adminLink').style.display = 'block';
    }
}

// 更新UI为未登录状态
function updateUIForLoggedOutUser() {
    document.getElementById('loginBtnText').textContent = '登录';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('adminLink').style.display = 'none';
    currentUser = null;
}

// 登录功能
async function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }
    
    try {
        const response = await fetch(getApiBaseUrl()+'/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('登录成功！');
            document.getElementById('authModal').style.display = 'none';
            checkLoginStatus();
        } else {
            alert('登录失败: ' + data.message);
        }
    } catch (error) {
        alert('登录失败，请检查网络连接');
    }
}

// 注册功能
async function handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || username.length < 3) {
        alert('用户名至少3位');
        return;
    }
    
    if (!password || password.length < 6) {
        alert('密码至少6位');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致');
        return;
    }
    
    try {
        const response = await fetch(getApiBaseUrl()+'/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`注册成功！您的用户ID是：${data.user_id}，请妥善保管`);
            // 切换到登录表单
            switchToLoginForm();
        } else {
            alert('注册失败: ' + data.message);
        }
    } catch (error) {
        alert('注册失败，请检查网络连接');
    }
}

// 退出登录
async function handleLogout() {
    try {
        await fetch(getApiBaseUrl()+'/api/logout', {method: 'POST'});
        updateUIForLoggedOutUser();
        alert('退出成功');
    } catch (error) {
        alert('退出失败');
    }
}

// 切换表单显示
function switchToRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('authModalTitle').textContent = '用户注册';
}

function switchToLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('authModalTitle').textContent = '用户登录';
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 绑定事件
    document.getElementById('loginBtn').addEventListener('click', function() {
        document.getElementById('authModal').style.display = 'flex';
    });
    
    document.getElementById('switchToRegister').addEventListener('click', function(e) {
        e.preventDefault();
        switchToRegisterForm();
    });
    
    document.getElementById('switchToLogin').addEventListener('click', function(e) {
        e.preventDefault();
        switchToLoginForm();
    });
    
    document.getElementById('loginSubmit').addEventListener('click', handleLogin);
    document.getElementById('registerSubmit').addEventListener('click', handleRegister);
    document.getElementById('logoutLink').addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
    
    // 关闭模态框
    document.querySelector('#authModal .close-btn').addEventListener('click', function() {
        document.getElementById('authModal').style.display = 'none';
    });
});