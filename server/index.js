const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '09041998', // đây là mật khẩu trên user
    database: 'sern3',
    port: 3307,
});

app.listen(3001, () => {
    console.log('Hello your server is running on port 3001');
});
