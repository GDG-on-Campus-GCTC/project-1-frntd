import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Lock, User, ArrowLeft, Chrome } from 'lucide-react';
import { toast } from 'sonner';
import logo from '../assets/logo.png';
import { API_CONFIG } from '../config/api-config';
import { authService } from '../services/auth.service';
import './Login.css'; // Reusing login styles for consistency

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleSignup = () => {
        window.location.href = API_CONFIG.AUTH.GOOGLE;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { firstName, lastName, email, password } = formData;

        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        // Domain Validation for GCET
        const domainPattern = /@gcet\.edu\.in$/;
        if (!domainPattern.test(email)) {
            setError('Please use your college email ending with @gcet.edu.in');
            setLoading(false);
            return;
        }

        try {
            await authService.register(formData);
            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed');
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
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

                {error && <div className="login-error">{error}</div>}

                <div className="auth-options">
                    <button className="google-auth-btn" onClick={handleGoogleSignup}>
                        <Chrome size={20} />
                        <span>Sign up with Google</span>
                    </button>
                </div>

                <div className="divider">
                    <span>or</span>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-row">
                        <div className="form-group">
                            <label>First name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn blue" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign up'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <span onClick={() => navigate('/login')}>Sign In</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
