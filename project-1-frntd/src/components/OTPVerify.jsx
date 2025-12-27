import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import logo from '../assets/logo.png';
import './Login.css';

const OTPVerify = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const inputs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = otp.join('');
        console.log('Verifying OTP JSON:', JSON.stringify({
            action: 'VERIFY_OTP',
            payload: { code }
        }, null, 2));

        if (code === '123456') { // Mock success
            sessionStorage.setItem('isLoggedIn', 'true');
            navigate('/home');
        } else {
            alert('Invalid OTP (Try 123456)');
        }
    };

    return (
        <div className="login-page">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="login-card"
            >
                <button className="back-btn" onClick={() => navigate('/signup')}>
                    <ArrowLeft size={18} />
                </button>

                <div className="login-header">
                    <img src={logo} alt="GCTC" className="login-logo" />
                    <h1>Verify OTP</h1>
                    <p>Enter the 6-digit code sent to your phone</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="otp-container">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                ref={el => inputs.current[index] = el}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                className="otp-input"
                            />
                        ))}
                    </div>

                    <button type="submit" className="submit-btn" style={{ marginTop: '2rem' }}>
                        Verify & Continue
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
                    {timer > 0 ? (
                        <p>Resend code in <span>{timer}s</span></p>
                    ) : (
                        <button className="resend-btn" onClick={() => setTimer(30)}>
                            <RefreshCw size={14} /> Resend OTP
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default OTPVerify;
