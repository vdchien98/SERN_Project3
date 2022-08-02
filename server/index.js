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
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query('INSERT INTO new_table (username, password) VALUES (?,?)', [username, password], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/login', (req, res) => {
    const username = req.body.usernameLogin;
    const password = req.body.passwordLogin;

    db.query('SELECT * FROM new_table WHERE username = ? AND password = ?', [username, password], (err, result) => {
        if (err) {
            res.send({ err: err });
        }
        // console.log(typeOf.result);
        if (result) {
            res.send(result);
        } else {
            res.send({
                message: 'Ko tim thay nguoi dung',
            });
        }
    });
});
app.listen(3001, () => {
    console.log('Hello your server is running on port 3001');
});
