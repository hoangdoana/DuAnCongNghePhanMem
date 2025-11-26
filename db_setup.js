// db_setup.js
// Script to create tables in data.db using SQL from db.sql
// Usage: node db_setup.js

const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Read SQL schema from db.sql
const sql = fs.readFileSync('db.sql', 'utf8');

// Connect to SQLite database (will create if not exists)
const db = new sqlite3.Database('data.db');

db.exec(sql, (err) => {
    if (err) {
        console.error('Error executing SQL:', err.message);
    } else {
        console.log('Database tables created successfully.');
    }
    db.close();
});
