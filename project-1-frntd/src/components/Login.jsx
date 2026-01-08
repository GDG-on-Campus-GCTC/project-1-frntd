import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, Chrome, ArrowRight } from 'lucide-react';
import logo from "../assets/logo.png";
import { API_CONFIG } from "../config/api-config";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        window.location.href = API_CONFIG.AUTH.GOOGLE;
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

                <form className="auth-form" onSubmit={(e) => { e.preventDefault(); navigate('/home'); }}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" placeholder="Admin" className="form-input" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" className="form-input" />
                    </div>

                    <button type="submit" className="submit-btn">
                        Sign In
                    </button>

                    {/* <div className="divider">
                        <span>or</span>
                    </div> */}

                    {/* Keeping Google Auth hidden or secondary if not in screenshot, 
                        or user said "like sign in with google kind of great ui". 
                        The screenshot had manual fields primarily. 
                        I'll leave it out for now to match screenshot EXACTLY, 
                        User can request it back effortlessly. 
                        Wait, earlier user said "sign in with google kind of great ui", 
                        but effectively showed a screenshot with fields. 
                        The screenshot for Login shows fields. 
                        I will stick to the screenshot. */ }
                </form>

                <p className="auth-footer">
                    Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
