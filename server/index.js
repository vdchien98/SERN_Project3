const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        key: 'userId',
        secret: 'subscribe',
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

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
app.get('/login', (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
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
                    req.session.user = result;
                    console.log(req.session.user);
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
