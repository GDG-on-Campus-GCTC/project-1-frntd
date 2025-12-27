import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Lock, User, ArrowLeft, Chrome } from 'lucide-react';
import logo from '../assets/logo.png';
import { API_CONFIG } from '../config/api-config';
import './Login.css'; // Reusing login styles for consistency

const Signup = () => {
    const navigate = useNavigate();

    const handleGoogleSignup = () => {
        window.location.href = API_CONFIG.AUTH.GOOGLE;
    };

    return (
        <div className="login-page">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="login-card"
            >
                <div className="login-header">
                    <img src={logo} alt="GCTC" className="login-logo" />
                    <h1>Create Account</h1>
                    <p>Join GCTC Workspace</p>
                </div>

                <div className="auth-options" style={{ marginTop: '2rem' }}>
                    <button className="google-auth-btn" onClick={handleGoogleSignup} style={{ width: '100%', justifyContent: 'center' }}>
                        <Chrome size={18} />
                        Sign up with Google
                    </button>
                </div>

                <p className="auth-footer">
                    Already have an account? <span onClick={() => navigate('/login')}>Sign In</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
