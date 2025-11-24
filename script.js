// --- JAVASCRIPT: LOGIC ĐĂNG NHẬP/ĐĂNG KÝ HOÀN CHỈNH (LOCALSTORAGE) ---

// Lấy các phần tử form
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotForm = document.getElementById('forgot-form');

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

// --- 2. XỬ LÝ ĐĂNG KÝ (LƯU VÀO LOCALSTORAGE) ---
function register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const confirmPass = document.getElementById('reg-confirm-pass').value;

    if (pass !== confirmPass) {
        alert("Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.");
        return;
    }

    let userList = JSON.parse(localStorage.getItem('listUsers')) || [];
    
    // Kiểm tra trùng lặp email
    const isExist = userList.some(user => user.email === email);
    if (isExist) {
        alert("Email này đã được đăng ký! Vui lòng dùng email khác.");
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: pass
    };

    userList.push(newUser);
    localStorage.setItem('listUsers', JSON.stringify(userList));

    alert("Đăng ký thành công! Hãy đăng nhập ngay.");
    showLogin(); // Chuyển về trang đăng nhập
}

// --- 3. XỬ LÝ ĐĂNG NHẬP (KIỂM TRA DỮ LIỆU) ---
// Trong file script.js

// Trong file script.js

function login() {
    const inputEmail = document.getElementById('login-email').value;
    const inputPass = document.getElementById('login-pass').value;

    const userList = JSON.parse(localStorage.getItem('listUsers')) || [];

    // Tìm kiếm xem có tài khoản nào khớp Email và Mật khẩu không
    const userFound = userList.find(user => user.email === inputEmail && user.password === inputPass);

    if (userFound) {
        alert("Đăng nhập thành công! Chào mừng " + userFound.name);
        
        // Lưu phiên đăng nhập hiện tại
        localStorage.setItem('currentUser', userFound.name);
        
        // DÒNG NÀY ĐÃ ĐƯỢC SỬA: home.html => homepage.html
        window.location.href = "homepage.html"; 
    } else {
        alert("Sai Email hoặc Mật khẩu! Vui lòng kiểm tra lại.");
    }
}

// --- 4. XỬ LÝ QUÊN MẬT KHẨU (CODE MỚI ĐÃ SỬA LỖI LƯU TRỮ) ---
function resetPassword() {
    const emailInput = document.getElementById('forgot-email').value;
    const newPassInput = document.getElementById('forgot-new-pass').value;

    let userList = JSON.parse(localStorage.getItem('listUsers')) || [];

    // Tìm vị trí của user có email trùng khớp
    const userIndex = userList.findIndex(user => user.email === emailInput);

    if (userIndex !== -1) {
        // Nếu tìm thấy: Cập nhật mật khẩu mới và lưu lại
        userList[userIndex].password = newPassInput;
        localStorage.setItem('listUsers', JSON.stringify(userList));

        alert("Thành công! Mật khẩu của bạn đã được đổi.");
        showLogin(); // Chuyển ngay về màn hình đăng nhập
    } else {
        // Nếu không tìm thấy email
        alert("Lỗi: Email này chưa từng được đăng ký!");
    }
}


// --- LOGIC HIỂN THỊ/ẨN MẬT KHẨU ---

// Hàm chính để xử lý logic ẩn/hiện
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);

    if (passwordInput.type === 'password') {
        // Nếu đang là password, chuyển sang text (hiển thị)
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye'); // Đổi icon từ mắt mở
        toggleIcon.classList.add('fa-eye-slash'); // sang mắt bị gạch
    } else {
        // Nếu đang là text, chuyển sang password (ẩn)
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Gắn sự kiện click cho các icon
document.addEventListener('DOMContentLoaded', () => {
    // 1. Đăng nhập
    const toggleLoginPass = document.getElementById('toggleLoginPass');
    if(toggleLoginPass) {
        toggleLoginPass.addEventListener('click', () => {
            togglePasswordVisibility('login-pass', 'toggleLoginPass');
        });
    }

    // 2. Đăng ký - Mật khẩu
    const toggleRegPass = document.getElementById('toggleRegPass');
    if(toggleRegPass) {
        toggleRegPass.addEventListener('click', () => {
            togglePasswordVisibility('reg-pass', 'toggleRegPass');
        });
    }
    
    // 3. Đăng ký - Xác nhận mật khẩu
    const toggleRegConfirmPass = document.getElementById('toggleRegConfirmPass');
    if(toggleRegConfirmPass) {
        toggleRegConfirmPass.addEventListener('click', () => {
            togglePasswordVisibility('reg-confirm-pass', 'toggleRegConfirmPass');
        });
    }
});