const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
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

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        res.send('Yo ,we need a token, please');
    } else {
        jwt.verify(token, 'jwtSecret', (err, decoded) => {
            if (err) {
                res.json({
                    auth: false,
                    message: 'U failed to authenticaated',
                });
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
};

app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.send('Yom are authenticaated congrats!!');
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
                    // console.log(req.session.user);
                    const id = result[0].id;
                    const token = jwt.sign({ id }, 'jwtSecret', {
                        expiresIn: 300,
                    });
                    req.session.user = result;
                    res.json({ auth: true, token: token, result: result });
                } else {
                    res.json({
                        auth: false,
                        message: 'Ko tim thay nguoi dung',
                    });
                }
            });
        } else {
            res.json({ auth: false, message: 'no user ' });
        }
    });
});
app.listen(3001, () => {
    console.log('Hello your server is running on port 3001');
});
