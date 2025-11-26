
// --- JAVASCRIPT: LOGIC ĐĂNG NHẬP/ĐĂNG KÝ VỚI SQLITE (BACKEND) ---

// Lấy các phần tử form
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotForm = document.getElementById('forgot-form');

// Require sqlite3 and crypto-js (chạy trên Node.js backend hoặc preload Electron)
// const sqlite3 = require('sqlite3').verbose();
// const CryptoJS = require('crypto-js');

// --- 1. CÁC HÀM CHUYỂN ĐỔI FORM ---
function showLogin() {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    forgotForm.classList.remove('active');
}
function showRegister() {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    forgotForm.classList.remove('active');
}
function showForgot() {
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    forgotForm.classList.add('active');
}

// --- 2. HÀM LẤY THỜI GIAN HIỆN TẠI ĐỊNH DẠNG YYYY-MM-DD HH:MM:SS ---
function getCurrentDateTime() {
    const now = new Date();
    const pad = n => n < 10 ? '0' + n : n;
    return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + ' '
        + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
}

// --- 3. HÀM HASH PASSWORD (SHA-256) ---
function hashPassword(password) {
    // Nếu dùng frontend, có thể dùng CryptoJS hoặc Web Crypto API
    // return CryptoJS.SHA256(password).toString();
    if (window.crypto && window.crypto.subtle) {
        // Web Crypto API (async)
        const encoder = new TextEncoder();
        return window.crypto.subtle.digest('SHA-256', encoder.encode(password)).then(buf => {
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        });
    } else {
        // Fallback: simple hash (not secure, for demo only)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) - hash) + password.charCodeAt(i);
            hash |= 0;
        }
        return Promise.resolve(hash.toString());
    }
}

// --- 4. ĐĂNG KÝ: LƯU THÔNG TIN VÀO BẢNG CUSTOMERS VÀ ACCOUNT_CUSTOMERS ---
// Hàm này sẽ gửi request đến backend Node.js để thực hiện lưu vào SQLite
function register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const confirmPass = document.getElementById('reg-confirm-pass').value;
    const birthday = document.querySelector('input[type="date"]').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || '';

    if (pass !== confirmPass) {
        alert("Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.");
        return;
    }

    // Hash password và gửi request đến backend
    hashPassword(pass).then(hashedPass => {
        const data = {
            name,
            email,
            birthday,
            gender,
            password: hashedPass,
            create_time: getCurrentDateTime()
        };
        // Gửi request đến backend Node.js (giả lập bằng fetch)
        fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert("Đăng ký thành công! Hãy đăng nhập ngay.");
                showLogin();
            } else {
                alert(result.message || "Đăng ký thất bại!");
            }
        })
        .catch(() => {
            // Fallback localStorage nếu không kết nối được backend
            let userList = JSON.parse(localStorage.getItem('listUsers')) || [];
            const isExist = userList.some(user => user.email === email);
            if (isExist) {
                alert("Email này đã được đăng ký! Vui lòng dùng email khác.");
                return;
            }
            userList.push({ name, email, password: hashedPass, birthday, gender });
            localStorage.setItem('listUsers', JSON.stringify(userList));
            alert("Đăng ký thành công (local)! Hãy đăng nhập ngay.");
            showLogin();
        });
    });
}

// --- 5. ĐĂNG NHẬP: TRUY VẤN TỐI ƯU BẢNG ACCOUNT_CUSTOMERS ---
// Hàm này sẽ gửi request đến backend Node.js để kiểm tra tài khoản
function login() {
    const inputEmail = document.getElementById('login-email').value;
    const inputPass = document.getElementById('login-pass').value;
    hashPassword(inputPass).then(hashedPass => {
        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: inputEmail, password: hashedPass })
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert("Đăng nhập thành công! Chào mừng " + result.name);
                localStorage.setItem('currentUser', result.name);
                window.location.href = "homepage.html";
            } else {
                alert(result.message || "Sai Email hoặc Mật khẩu! Vui lòng kiểm tra lại.");
            }
        })
        .catch(() => {
            // Fallback localStorage nếu không kết nối được backend
            const userList = JSON.parse(localStorage.getItem('listUsers')) || [];
            const userFound = userList.find(user => user.email === inputEmail && user.password === hashedPass);
            if (userFound) {
                alert("Đăng nhập thành công! Chào mừng " + userFound.name);
                localStorage.setItem('currentUser', userFound.name);
                window.location.href = "homepage.html";
            } else {
                alert("Sai Email hoặc Mật khẩu! Vui lòng kiểm tra lại.");
            }
        });
    });
}

// --- 6. XỬ LÝ QUÊN MẬT KHẨU (CẦN BACKEND) ---
function resetPassword() {
    const emailInput = document.getElementById('forgot-email').value;
    const newPassInput = document.getElementById('forgot-new-pass').value;
    hashPassword(newPassInput).then(hashedPass => {
        fetch('http://localhost:8080/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput, password: hashedPass })
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert("Thành công! Mật khẩu của bạn đã được đổi.");
                showLogin();
            } else {
                alert(result.message || "Lỗi: Email này chưa từng được đăng ký!");
            }
        })
        .catch(() => {
            // Fallback localStorage nếu không kết nối được backend
            let userList = JSON.parse(localStorage.getItem('listUsers')) || [];
            const userIndex = userList.findIndex(user => user.email === emailInput);
            if (userIndex !== -1) {
                userList[userIndex].password = hashedPass;
                localStorage.setItem('listUsers', JSON.stringify(userList));
                alert("Thành công! Mật khẩu của bạn đã được đổi (local). ");
                showLogin();
            } else {
                alert("Lỗi: Email này chưa từng được đăng ký!");
            }
        });
    });
}


// --- LOGIC HIỂN THỊ/ẨN MẬT KHẨU (KHÔNG ĐỔI) ---
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const toggleLoginPass = document.getElementById('toggleLoginPass');
    if(toggleLoginPass) {
        toggleLoginPass.addEventListener('click', () => {
            togglePasswordVisibility('login-pass', 'toggleLoginPass');
        });
    }
    const toggleRegPass = document.getElementById('toggleRegPass');
    if(toggleRegPass) {
        toggleRegPass.addEventListener('click', () => {
            togglePasswordVisibility('reg-pass', 'toggleRegPass');
        });
    }
    const toggleRegConfirmPass = document.getElementById('toggleRegConfirmPass');
    if(toggleRegConfirmPass) {
        toggleRegConfirmPass.addEventListener('click', () => {
            togglePasswordVisibility('reg-confirm-pass', 'toggleRegConfirmPass');
        });
    }
});

