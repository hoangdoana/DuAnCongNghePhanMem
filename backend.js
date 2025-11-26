// backend.js
// Node.js backend API cho đăng ký, đăng nhập, reset password với SQLite
// Chạy: node backend.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const db = new sqlite3.Database('data.db');

// Cấu hình CORS cho phép truy cập từ Live Server và cổng mới (8080)
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    credentials: true
}));
app.use(bodyParser.json());

// Hàm kiểm tra email đã tồn tại trong Account_Customers
function checkAccountExists(email, cb) {
    db.get('SELECT 1 FROM Account_Customers WHERE Username = ?', [email], (err, row) => {
        if (err) return cb(err);
        cb(null, !!row);
    });
}

// Đăng ký tài khoản mới
app.post('/api/register', (req, res) => {
    const { name, email, birthday, gender, password, create_time } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Thiếu thông tin bắt buộc.' });
    }
    checkAccountExists(email, (err, exists) => {
        if (err) return res.json({ success: false, message: 'Lỗi truy vấn.' });
        if (exists) return res.json({ success: false, message: 'Email đã được đăng ký!' });
        // Thêm vào Customers
        db.run('INSERT INTO Customers (Name, Email, Birthday, Sex) VALUES (?, ?, ?, ?)',
            [name, email, birthday, gender], function(err) {
            if (err) return res.json({ success: false, message: 'Lỗi tạo khách hàng.' });
            const customerId = this.lastID;
            // Thêm vào Account_Customers
            db.run('INSERT INTO Account_Customers (CustomerID, Username, Password, CreateDate) VALUES (?, ?, ?, ?)',
                [customerId, email, password, create_time], function(err2) {
                if (err2) return res.json({ success: false, message: 'Lỗi tạo tài khoản.' });
                res.json({ success: true });
            });
        });
    });
});

// Đăng nhập: truy vấn tối ưu bằng username và password hash
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT c.Name FROM Account_Customers a JOIN Customers c ON a.CustomerID = c.CustomerID WHERE a.Username = ? AND a.Password = ?`,
        [username, password], (err, row) => {
        if (err) return res.json({ success: false, message: 'Lỗi truy vấn.' });
        if (!row) return res.json({ success: false, message: 'Sai Email hoặc Mật khẩu!' });
        res.json({ success: true, name: row.Name });
    });
});

// Đổi mật khẩu
app.post('/api/reset-password', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT AccountID FROM Account_Customers WHERE Username = ?', [email], (err, row) => {
        if (err) return res.json({ success: false, message: 'Lỗi truy vấn.' });
        if (!row) return res.json({ success: false, message: 'Email này chưa từng được đăng ký!' });
        db.run('UPDATE Account_Customers SET Password = ? WHERE Username = ?', [password, email], function(err2) {
            if (err2) return res.json({ success: false, message: 'Lỗi cập nhật mật khẩu.' });
            res.json({ success: true });
        });
    });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log('Backend server running at http://localhost:' + PORT);
    console.log('Nếu frontend báo lỗi kết nối, hãy chắc chắn backend đang chạy và không bị firewall chặn.');
    console.log('Nếu không muốn chạy backend, hãy chuyển script.js về chế độ localStorage.');
});
