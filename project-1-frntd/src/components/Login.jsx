import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, Chrome, ArrowRight } from 'lucide-react';
import logo from "../assets/logo.png";
import "./Login.css";

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [isRegistering]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isRegistering ? 'register' : 'login';

        try {
            const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user", JSON.stringify(data));
                sessionStorage.setItem("isLoggedIn", "true");
                navigate("/home");
            } else {
                setError(data.message || "Authentication failed");
            }
        } catch (err) {
            setError("Cannot connect to server. Ensure backend is running.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <motion.div
                key={isRegistering ? "register" : "login"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="login-card"
            >
                <div className="login-header">
                    <img src={logo} alt="GCTC" className="login-logo" />
                    <h1>{isRegistering ? "Create Account" : "Welcome Back"}</h1>
                    <p>{isRegistering ? "Join GCTC Workspace" : "Sign in to GCTC Workspace"}</p>
                </div>

                {error && (
                    <div className="login-error">{error}</div>
                )}

                <form onSubmit={handleAuth}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
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
                            minLength={6}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Please wait...' : (isRegistering ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isRegistering ? "Already have an account? " : "Don't have an account? "}
                        <span onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? "Sign In" : "Sign Up"}
                        </span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;