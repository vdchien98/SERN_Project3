import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
    const registerData = {
        username: '',
        password: '',
    };
    const loginData = {
        usernameLogin: '',
        passwordLogin: '',
    };
    const [register, setRegister] = useState({ ...registerData });
    const [login, setLogin] = useState({ ...loginData });
    const [statusLogin, setStatusLogin] = useState('');
    axios.defaults.withCredentials = true;

    const handleChange = (e) => {
        setRegister((p) => {
            // console.log('-----', { ...p });
            // console.log('++++++', { ...p, [e.target.name]: e.target.value });
            return { ...p, [e.target.name]: e.target.value };
        });
    };
    const handleRegister = () => {
        axios.post('http://localhost:3001/register', { ...register }).then((response) => {
            console.log('Dang ky thanh cong ', response);
        });
    };

    const handleChangeLogin = (e) => {
        setLogin((p) => {
            // console.log('Dang', { ...p, [e.target.name]: e.target.value });
            return { ...p, [e.target.name]: e.target.value };
        });
    };
    // console.log(login);
    const handleLogin = () => {
        axios.post('http://localhost:3001/login', { ...login }).then((response) => {
            // console.log('Dang nhap thanh cong  ', response);
            let data = response.data;
            if (data.message) {
                setStatusLogin(data.message);
            } else {
                setStatusLogin(data[0].username);
            }
        });
    };

    useEffect(() => {
        axios.get('http://localhost:3001/login').then((response) => {
            // console.log(response);
            if (response.data.loggedIn === true) {
                setStatusLogin(response.data.user[0].username);
            }
        });
    }, []);
    return (
        <div className="App">
            <div className="register">
                <h1>Register</h1>
                <label>Username</label>
                <input type="text" name="username" onChange={handleChange} />
                <label>Password</label>
                <input type="text" name="password" onChange={handleChange} />
                <button type="submit" onClick={handleRegister}>
                    Register
                </button>
            </div>
            <div className="login">
                <h1>Login</h1>
                <input type="text" name="usernameLogin" onChange={handleChangeLogin} />
                <input type="text" name="passwordLogin" onChange={handleChangeLogin} />
                <button type="submit" onClick={handleLogin}>
                    Login
                </button>
            </div>
            <h1>{statusLogin}</h1>
        </div>
    );
}

export default App;
