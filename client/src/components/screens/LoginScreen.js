import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LoginScreen.css";

const LoginScreen = ({ history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push("/");
        }
    }, [history]);

    const loginHandler = async (e) => {
        e.preventDefault();
        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };
        try {
            const { data } = await axios.post(
                "/api/auth/login",
                {
                    email,
                    password,
                },
                config
            );
            localStorage.setItem("authToken", data.token);
            history.push("/");
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <div className="login-screen">
            <form onSubmit={loginHandler} className="login-screen-form">
                <h3 className="login-screen-title">Login</h3>
                {error && <span className="error-msg">{error}</span>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        required
                        id="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        required
                        id="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="button">
                    Login
                </button>
                <br />
                <span className="login-subtext">
                    Don't have an account? <Link to="/register">Register</Link>
                </span>
                <br />
                <span className="login-subtext">
                    Forgot your password? <Link to="/forgotpassword">Reset here</Link>
                </span>
            </form>
        </div>
    );
};

export default LoginScreen;
