import './App.css';

function App() {
    return (
        <div className="App">
            <div className="register">
                <h1>Register</h1>
                <label>Username</label>
                <input type="text" />
                <label>Password</label>
                <input type="password" />
                <button type="submit">Register</button>
            </div>
            <div className="login">
                <h1>Login</h1>
                <input type="text" />
                <input type="password" />
                <button type="submit">Login</button>
            </div>
        </div>
    );
}

export default App;
