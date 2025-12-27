import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Lock, User, ArrowLeft, Chrome } from 'lucide-react';
import logo from '../assets/logo.png';
import './Login.css'; // Reusing login styles for consistency

const Signup = () => {
    const [method, setMethod] = useState('email'); // 'email' or 'phone'
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prepare JSON payload for backend
        const payload = {
            action: method === 'email' ? 'SIGNUP_EMAIL' : 'SIGNUP_PHONE',
            payload: {
                fullName: formData.fullName,
                [method]: formData[method],
                password: formData.password
            }
        };
        console.log('Sending Signup JSON:', JSON.stringify(payload, null, 2));
        // Redirect to OTP if phone, or home if success
        if (method === 'phone') {
            // navigate('/otp-verify'); e.g.
            alert('OTP functionality coming soon! Check console for JSON.');
        } else {
            navigate('/home');
        }
    };

    return (
        <div className="login-page">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="login-card"
            >
                <button className="back-btn" onClick={() => navigate('/login')}>
                    <ArrowLeft size={18} />
                </button>

                <div className="login-header">
                    <img src={logo} alt="GCTC" className="login-logo" />
                    <h1>Create Account</h1>
                    <p>Join GCTC Workspace</p>
                </div>

                <div className="auth-toggle">
                    <button
                        className={method === 'email' ? 'active' : ''}
                        onClick={() => setMethod('email')}
                    >
                        Email
                    </button>
                    <button
                        className={method === 'phone' ? 'active' : ''}
                        onClick={() => setMethod('phone')}
                    >
                        Phone
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-with-icon">
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {method === 'email' ? (
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-with-icon">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-with-icon">
                                <Phone size={18} />
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        Sign Up
                    </button>
                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <button className="google-auth-btn" onClick={() => console.log('Google Auth Triggered')}>
                    <Chrome size={18} />
                    Google
                </button>

                <p className="auth-footer">
                    Already have an account? <span onClick={() => navigate('/login')}>Sign In</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
