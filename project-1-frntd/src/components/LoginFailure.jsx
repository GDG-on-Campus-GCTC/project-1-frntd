import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import './Login.css';

const LoginFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <motion.div
                className="login-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center' }}
            >
                <div style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <AlertCircle size={48} />
                </div>

                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Login Failed</h1>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                    We couldn't sign you in using Google. Please make sure you are using a valid <strong>@gcet.edu.in</strong> email address.
                </p>

                <div className="auth-options">
                    <button
                        className="submit-btn"
                        onClick={() => navigate('/login')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <ArrowLeft size={18} />
                        Back to Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginFailure;
