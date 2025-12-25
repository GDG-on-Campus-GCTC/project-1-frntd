import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, Chrome, ArrowRight } from 'lucide-react';
import logo from "../assets/logo.png";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === "Admin" && password === "12345678") {
            sessionStorage.setItem("isLoggedIn", "true");
            navigate("/home");
        } else {
            setError("Invalid credentials");
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card"
            >
                <div className="login-header">
                    <img src={logo} alt="GCTC" className="login-logo" />
                    <h1>Welcome Back</h1>
                    <p>Sign in to GCTC Workspace</p>
                </div>

                {error && (
                    <div className="login-error">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Admin"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <div className="auth-options">
                    <button className="google-auth-btn" onClick={() => console.log('Google Auth Triggered')}>
                        <Chrome size={18} />
                        Google
                    </button>
                    <button className="phone-auth-btn" onClick={() => console.log('Phone Auth Requested')}>
                        <Phone size={18} />
                        Phone
                    </button>
                </div>

                <p className="auth-footer">
                    Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
