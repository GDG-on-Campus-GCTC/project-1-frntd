import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, Chrome, ArrowRight } from 'lucide-react';
import logo from "../assets/logo.png";
import { API_CONFIG } from "../config/api-config";
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

                <div className="auth-options" style={{ marginTop: '2rem' }}>
                    <button className="google-auth-btn" onClick={handleGoogleLogin} style={{ width: '100%', justifyContent: 'center' }}>
                        <Chrome size={18} />
                        Sign in with Google
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
