// ====== FILE: script.js (PHIÊN BẢN MỚI NHẤT CÓ AC AUTOCOMPLETE) ======

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
    // Cần đảm bảo các ID này đã có trong HTML
    // document.getElementById('designer-name').textContent = product.designer;
    // document.getElementById('material-type').textContent = product.material;
    
    // Cập nhật Giá tiền
    // Cần đảm bảo các ID này đã có trong HTML
    // document.getElementById('product-old-price').textContent = product.old_price;
    // document.getElementById('product-new-price').textContent = product.price;
    // document.getElementById('product-discount').textContent = product.discount;
}


// =======================================================
// CHỨC NĂNG BỔ SUNG ĐÃ CÓ: Tăng/Giảm Số lượng Sản phẩm
// =======================================================
function setupQuantityControls() {
    // 1. Tìm khối điều khiển số lượng (Chỉ chạy trên trang product.html)
    const quantityControl = document.querySelector('.quantity-control');
    if (!quantityControl) return; 

    const minusButton = quantityControl.querySelector('.qty-input button:first-child');
    const plusButton = quantityControl.querySelector('.qty-input button:last-child');
    const quantityInput = document.getElementById('quantity');

    // Đảm bảo các phần tử tồn tại trước khi thêm sự kiện
    if (!minusButton || !plusButton || !quantityInput) return;

    // 2. Lắng nghe sự kiện GIẢM
    minusButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) { // Đảm bảo số lượng không nhỏ hơn 1
            quantityInput.value = currentValue - 1;
        }
    });

    // 3. Lắng nghe sự kiện TĂNG
    plusButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    // 4. Xử lý khi người dùng nhập trực tiếp (đảm bảo là số và >= 1)
    quantityInput.addEventListener('change', () => {
        let currentValue = parseInt(quantityInput.value);
        if (isNaN(currentValue) || currentValue < 1) {
            // Đặt lại về 1 nếu nhập không hợp lệ
            quantityInput.value = 1; 
        } else {
            // Cập nhật giá trị đã được làm tròn
            quantityInput.value = currentValue; 
        }
    });
}


// -------------------------------------------------------------
// --- 7. CHỨC NĂNG BỔ SUNG: Gợi ý Tìm kiếm (Autocomplete) ---
// -------------------------------------------------------------

// Hàm chuyển hướng đến trang kết quả tìm kiếm (hoặc chi tiết)
function performSearch(query) {
    if (query.trim() === '') return;

    // TÌM ID SẢN PHẨM: Nếu tên sản phẩm khớp hoàn toàn, chuyển đến trang chi tiết
    const matchedProductKey = Object.keys(productData).find(key => 
        productData[key].name.toLowerCase() === query.toLowerCase().trim()
    );

    if (matchedProductKey) {
        // Chuyển đến trang chi tiết sản phẩm nếu tìm thấy tên chính xác
        window.location.href = `product.html?id=${matchedProductKey}`;
    } else {
        // Nếu không khớp chính xác, chuyển đến trang tìm kiếm chung
        window.location.href = `product_search.html?query=${encodeURIComponent(query)}`;
    }
}

function setupSearchAutocomplete() {
    const searchInput = document.getElementById('searchInput');
    const resultsDropdown = document.getElementById('searchResultsDropdown');
    const searchButton = document.getElementById('searchButton'); // Đã thêm ID trong bước HTML trước
    
    // Kiểm tra các phần tử HTML cần thiết
    if (!searchInput || !resultsDropdown || !searchButton) return; 

    // Lấy tên tất cả các sản phẩm
    const productNames = Object.values(productData).map(p => p.name);

    // Xử lý sự kiện gõ phím
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        resultsDropdown.innerHTML = ''; 

        if (query.length === 0) {
            resultsDropdown.style.display = 'none';
            return;
        }

        // Lọc sản phẩm theo chữ cái đầu hoặc tên
        const filteredResults = productNames.filter(name => 
            name.toLowerCase().startsWith(query) || name.toLowerCase().includes(query)
        ).slice(0, 5); // Giới hạn 5 kết quả

        if (filteredResults.length > 0) {
            filteredResults.forEach(name => {
                const item = document.createElement('div');
                item.classList.add('autocomplete-item');
                
                // Highlight từ khóa khớp
                const regex = new RegExp(`(${query})`, 'gi');
                item.innerHTML = name.replace(regex, '<b>$1</b>'); // Dùng <b> cho đậm
                
                // Xử lý sự kiện khi click vào một gợi ý
                item.addEventListener('click', () => {
                    searchInput.value = name; // Đưa tên sản phẩm lên thanh tìm kiếm
                    resultsDropdown.style.display = 'none'; // Ẩn dropdown
                    performSearch(name); // Chuyển đến trang sản phẩm
                });
                
                resultsDropdown.appendChild(item);
            });
            resultsDropdown.style.display = 'block';
        } else {
            resultsDropdown.style.display = 'none';
        }
    });

    // Ẩn dropdown khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target) && !searchButton.contains(e.target)) {
            resultsDropdown.style.display = 'none';
        }
    });
    
    // Xử lý sự kiện khi bấm nút Tìm kiếm
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // Xử lý sự kiện khi nhấn Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            performSearch(searchInput.value);
        }
    });
}

// -------------------------------------------------------------


// --- HỢP NHẤT VÀ CHẠY KHI DOM TẢI XONG ---
document.addEventListener('DOMContentLoaded', () => {

    // (Đã có sẵn) Thiết lập chức năng tăng/giảm số lượng sản phẩm
    // LƯU Ý: Vị trí của hàm setupQuantityControls() trong khối DOMContentLoaded không phù hợp, 
    // nên tôi sẽ di chuyển nó vào trong khối if(getQueryParam('id')) để chỉ chạy trên product.html.
    
    // 1. Logic Kiểm tra Đăng nhập & Hiển thị tên người dùng
    checkAuthAndInitHomepage();

    // 2. Khởi tạo Slider (chỉ chạy trên homepage.html)
    if (document.getElementById('sliderTrack')) {
        initSlider(); 
    }
    
    // 3. Load Chi tiết Sản phẩm (chỉ chạy trên product.html)
    if (getQueryParam('id')) {
        loadProductDetail(); 
        // Đặt hàm Quantity Control ở đây để chỉ chạy trên trang chi tiết
        setupQuantityControls(); 
    }
    
    // 4. Kích hoạt tính năng Gợi ý Tìm kiếm (chủ yếu trên homepage.html)
    setupSearchAutocomplete(); 
});


document.addEventListener('DOMContentLoaded', function() {
    // Lấy nút 'Mua hàng' bằng ID
    const buyButton = document.getElementById('btnBuy');

    // Kiểm tra nếu nút tồn tại trên trang
    if (buyButton) {
        // Gắn sự kiện 'click' cho nút
        buyButton.addEventListener('click', function() {
            // Hiển thị thông báo xác nhận mua hàng thành công
            alert('Xác nhận mua hàng thành công');

            // TODO: Ở đây bạn sẽ thêm logic chuyển hướng (ví dụ: location.href = 'trang_cam_on.html')
        });
    }
});