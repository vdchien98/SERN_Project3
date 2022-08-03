const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(express.json());
app.use(cors());
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
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

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            // Store hash in your password DB.
            if (err) {
                console.log(err);
            } else {
                db.query('INSERT INTO new_table (username, password) VALUES (?,?)', [username, hash], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });
});

app.post('/login', (req, res) => {
    const username = req.body.usernameLogin;
    const password = req.body.passwordLogin;
    db.query('SELECT * FROM new_table WHERE username = ?', username, (err, result) => {
        if (err) {
            res.send({ err: err });
        }
        if (result.length > 0) {
            console.log(result);
            bcrypt.compare(password, result[0].password, function (err, response) {
                // res === true
                if (response) {
                    res.send(result);
                } else {
                    res.send({
                        message: 'Ko tim thay nguoi dung',
                    });
                }
            });
        } else {
            res.send({
                message: '',
            });
        }
    });
});
app.listen(3001, () => {
    console.log('Hello your server is running on port 3001');
});
