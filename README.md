# Minimal Fashion Web Project

## 1. Cấu trúc thư mục

```
DuAnCongNghePhanMem/
│
├── backend.js           # Node.js backend API (Express + SQLite)
├── db.sql               # File định nghĩa các bảng CSDL SQLite
├── db_setup.js          # Script tạo bảng trong data.db từ db.sql
├── data.db              # File cơ sở dữ liệu SQLite (tạo tự động)
│
├── index.html           # Trang đăng nhập/đăng ký (front-end)
├── homepage.html        # Trang chủ sau khi đăng nhập
├── style.css            # CSS cho trang đăng nhập/đăng ký
├── homepage.css         # CSS cho trang chủ
├── script.js            # Logic JS cho đăng nhập/đăng ký (frontend)
│
├── image/               # Thư mục chứa hình ảnh giao diện
│
└── ...
```

## 2. Hướng dẫn cài đặt & chạy

### Bước 1: Cài Node.js và các package cần thiết

- Cài Node.js (https://nodejs.org/)
- Mở terminal tại thư mục dự án, chạy:

```
npm install express sqlite3 body-parser cors
```

### Bước 2: Tạo database và các bảng

```
node db_setup.js
```

Sau khi chạy, file `data.db` sẽ được tạo với các bảng theo định nghĩa trong `db.sql`.


### Bước 3: Chạy backend server

```
node backend.js
```

Server sẽ chạy ở địa chỉ: `http://localhost:5500`

### Bước 4: Chạy giao diện web

- **Cách 1 (Khuyên dùng):** Dùng Live Server (VSCode extension) để mở `index.html` (tự động proxy, không lỗi CORS, fetch API backend được).
- **Cách 2:** Nếu mở file .html trực tiếp (file://), bạn sẽ bị lỗi không kết nối được backend (CORS hoặc fetch bị chặn). Khi đó, hãy dùng Live Server hoặc cấu hình proxy cho frontend về đúng địa chỉ backend (`http://localhost:5500`).
- Đăng ký, đăng nhập, đổi mật khẩu sẽ gọi API backend để thao tác với database.

## 3. Chức năng chính

- Đăng ký: Lưu thông tin khách hàng vào bảng `Customers`, tài khoản vào `Account_Customers` (password được hash SHA-256).
- Đăng nhập: Kiểm tra tài khoản qua bảng `Account_Customers` (username là email, password đã hash).
- Đổi mật khẩu: Cập nhật password mới (hash) cho tài khoản.
- Giao diện đẹp, tách biệt front-end và back-end.


## 4. Lưu ý

- **Luôn chạy backend trước khi thao tác đăng ký/đăng nhập.**
- Nếu website báo không thể kết nối 127.0.0.1:5500, hãy kiểm tra:
	- Backend đã chạy đúng cổng 5500 chưa?
	- Frontend phải mở qua Live Server hoặc proxy, không mở file .html trực tiếp.
	- Nếu dùng port khác, sửa lại fetch URL trong `script.js` cho đúng port backend.
- Có thể mở rộng thêm các chức năng quản lý sản phẩm, giỏ hàng, đơn hàng... dựa trên các bảng đã có trong `db.sql`.

---

**Tác giả:** hoangdoana
