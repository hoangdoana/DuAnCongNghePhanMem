// ====== FILE: script.js (PHIÊN BẢN 4 SLIDE BANNER) ======

// Lấy các phần tử form (index.html)
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotForm = document.getElementById('forgot-form');

// --- 1. CÁC HÀM CHUYỂN ĐỔI FORM (cho index.html) ---
function showLogin() {
    if (loginForm) loginForm.classList.add('active');
    if (registerForm) registerForm.classList.remove('active');
    if (forgotForm) forgotForm.classList.remove('active');
}
function showRegister() {
    if (loginForm) loginForm.classList.remove('active');
    if (registerForm) registerForm.classList.add('active');
    if (forgotForm) forgotForm.classList.remove('active');
}
function showForgot() {
    if (loginForm) loginForm.classList.remove('active');
    if (registerForm) registerForm.classList.remove('active');
    if (forgotForm) forgotForm.classList.add('active');
}

// --- HÀM HỖ TRỢ CHUNG ---
function getCurrentDateTime() {
    const now = new Date();
    const pad = n => n < 10 ? '0' + n : n;
    return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + ' '
        + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
}
function hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        return window.crypto.subtle.digest('SHA-256', encoder.encode(password)).then(buf => {
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
        });
    } else {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) - hash) + password.charCodeAt(i);
            hash |= 0;
        }
        return Promise.resolve(hash.toString());
    }
}
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- 2. LOGIC ĐĂNG KÝ/ĐĂNG NHẬP/RESET PASS (cho index.html) ---
function register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const confirmPass = document.getElementById('reg-confirm-pass').value;
    
    if (pass !== confirmPass) { alert("Mật khẩu xác nhận không khớp!"); return; }

    hashPassword(pass).then(hashedPass => {
        let userList = JSON.parse(localStorage.getItem('listUsers')) || [];
        const isExist = userList.some(user => user.email === email);
        if (isExist) { alert("Email này đã được đăng ký!"); return; }
        
        userList.push({ name, email, password: hashedPass });
        localStorage.setItem('listUsers', JSON.stringify(userList));
        alert("Đăng ký thành công (local)! Hãy đăng nhập ngay.");
        showLogin();
    });
}

function login() {
    const inputEmail = document.getElementById('login-email').value;
    const inputPass = document.getElementById('login-pass').value;
    hashPassword(inputPass).then(hashedPass => {
        const userList = JSON.parse(localStorage.getItem('listUsers')) || [];
        const userFound = userList.find(user => user.email === inputEmail && user.password === hashedPass);
        if (userFound) {
            localStorage.setItem('currentUser', userFound.name);
            window.location.href = "homepage.html";
        } else {
            alert("Sai Email hoặc Mật khẩu!");
        }
    });
}

function resetPassword() {
    const emailInput = document.getElementById('forgot-email').value;
    const newPassInput = document.getElementById('forgot-new-pass').value;
    hashPassword(newPassInput).then(hashedPass => {
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
}

// --- HÀM LOGOUT ---
function logout() {
    localStorage.removeItem('currentUser'); 
    window.location.href = 'index.html'; 
}


// --- 3. DỮ LIỆU SẢN PHẨM (CHỈ CÓ 3 SẢN PHẨM) ---
const productData = {
    'white_blazer': {
        name: "White Blazer",
        category: "Áo Blazer",
        price: "450.000đ",
        old_price: "500.000đ",
        discount: "50.000đ",
        designer: "Minimal Design",
        material: "Vải Lanh",
        image_url: "image/ao vest.jpg" 
    },
    'white_T-shirt': {
        name: "White T-shirt",
        category: "Áo T-shirt",
        price: "129.000đ",
        old_price: "150.000đ",
        discount: "21.000đ",
        designer: "Minimal Design",
        material: "Vải Cotton",
        image_url: "image/ao vest 1.jpg" 
    },
    'black_blazer': {
        name: "Black Blazer",
        category: "Áo Blazer",
        price: "400.000đ",
        old_price: "450.000đ",
        discount: "50.000đ",
        designer: "Minimal Design",
        material: "Da/Len Dệt Kim",
        image_url: "image/ao vest 2.jpg" 
    }
};


// --- 4. LOGIC BANNER SLIDER ---

let currentSlide = 0; 
let totalSlides;      
let sliderTrack;      
let sliderDotsContainer; 

function updateSliderDots() {
    if (!sliderDotsContainer) return;
    const dots = sliderDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
    });
}

function goToSlide(index) {
    if (!sliderTrack) return; 

    // totalSlides = 4 sau khi thêm White T-shirt
    if (index >= totalSlides) {
        index = 0;
    } else if (index < 0) {
        index = totalSlides - 1;
    }
    currentSlide = index;

    const offset = -currentSlide * 100;
    sliderTrack.style.transform = `translateX(${offset}%)`;

    updateSliderDots(); 
}

function moveSlider(direction) {
    goToSlide(currentSlide + direction); 
}

function initSlider() {
    sliderTrack = document.getElementById('sliderTrack');
    sliderDotsContainer = document.getElementById('sliderDots');
    
    if (!sliderTrack) return; 

    totalSlides = sliderTrack.querySelectorAll('.slide-item').length; // Sẽ là 4
    goToSlide(0); 
    
    setInterval(() => {
        moveSlider(1);
    }, 5000); 
}


// --- 5. LOGIC KIỂM TRA ĐĂNG NHẬP ---
function checkAuthAndInitHomepage() {
    const welcomeElement = document.getElementById('welcome-user');
    
    if (!welcomeElement) return;

    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        welcomeElement.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser}`;
        // CODE CẦN THÊM/SỬA: Gán href nếu đã đăng nhập
        welcomeElement.href = "profile.html"; // Thêm/Sửa dòng này
    } else {
        welcomeElement.innerHTML = `<i class="fas fa-user-circle"></i> Đăng nhập`;
        welcomeElement.href = "index.html"; // Đảm bảo trỏ về trang login nếu chưa đăng nhập
    }
}


// --- 6. LOGIC LOAD CHI TIẾT SẢN PHẨM ---
function loadProductDetail() {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return; 
    
    const productId = getQueryParam('id'); 
    const product = productData[productId];

    if (!product) {
        alert("Sản phẩm không tồn tại. Quay về trang chủ.");
        window.location.href = 'homepage.html';
        return;
    }
    
    // Cập nhật Tiêu đề trang
    document.title = product.name + " - Minimal";

    // Cập nhật Breadcrumb
    breadcrumb.innerHTML = `<a href="homepage.html">Trang chủ</a> / <a href="#">${product.category}</a> / ${product.name}`;
    
    // Cập nhật Hình ảnh
    const mainImage = document.querySelector('.main-product-image');
    if (mainImage) {
        mainImage.src = product.image_url;
        mainImage.alt = product.name;
    }

    // Cập nhật Thông tin Sản phẩm
    document.querySelector('.product-title').textContent = product.name;
    document.getElementById('designer-name').textContent = product.designer;
    document.getElementById('material-type').textContent = product.material;
    
    // Cập nhật Giá tiền
    document.getElementById('product-old-price').textContent = product.old_price;
    document.getElementById('product-new-price').textContent = product.price;
    document.getElementById('product-discount').textContent = product.discount;
}


// --- HỢP NHẤT VÀ CHẠY KHI DOM TẢI XONG ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Logic Kiểm tra Đăng nhập & Hiển thị tên người dùng
    checkAuthAndInitHomepage();

    // 2. Khởi tạo Slider (chỉ chạy trên homepage.html)
    if (document.getElementById('sliderTrack')) {
        initSlider(); 
    }
    
    // 3. Load Chi tiết Sản phẩm (chỉ chạy trên product.html)
    if (getQueryParam('id')) {
        loadProductDetail(); 
    }
});