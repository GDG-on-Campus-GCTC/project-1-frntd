import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_CONFIG } from '../config/api-config';
import './login.css';

export default function Login() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = API_CONFIG.AUTH.GOOGLE;
  };

  return (
    <div className="login-container" onMouseMove={handleMouseMove}>
      {/* Background */}
      <motion.div
        className="dot-pattern"
        animate={{ backgroundPosition: ['0px 0px', '30px 30px'] }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
      />

      {/* Mouse Glow */}
      <motion.div
        className="glow-orb glow-mouse"
        style={{
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
        }}
        animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.15, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Floating Orbs */}
      <motion.div className="glow-orb glow-purple" />
      <motion.div className="glow-orb glow-pink" />

      {/* Content */}
      <div className="content-wrapper">
        <div className="content-container">
          <div className="grid-layout">
            {/* LEFT */}
        <motion.div
        className="left-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
    >
        <motion.div
        className="workspace-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        >
        <h1 className="main-heading">GCTC Workspace</h1>
        <p className="subtitle">
        Your professional workspace for academic excellence
        </p>
        </motion.div>

  {/* ✅ FEATURES LIST (this was missing) */}
        <div className="features-list">
            <motion.div
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ x: 15 }}
        >
            <motion.div
                className="feature-dot"
                whileHover={{
                scale: 1.5,
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.8)',
                }}
            />
            <p>Instant access to exam resources</p>
            </motion.div>

            <motion.div
            className="feature-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ x: 15 }}
            >
            <motion.div
                className="feature-dot"
                whileHover={{
                scale: 1.5,
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.8)',
                }}
                />
                <p>AI-powered study assistance</p>
            </motion.div>

            <motion.div
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                whileHover={{ x: 15 }}
             >
                <motion.div
                    className="feature-dot"
                whileHover={{
                    scale: 1.5,
                    boxShadow: '0 0 15px rgba(236, 72, 153, 0.8)',
                    }}
                />
                <p>Organized learning materials</p>
                </motion.div>
            </div>
            </motion.div>


            {/* RIGHT */}
            <motion.div
              className="right-section"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div className="signin-card">
                <div className="card-content">
                  <div className="card-header">
                    <h2 className="signin-heading">Sign In</h2>
                    <p className="signin-subtitle">Access your workspace</p>
                  </div>

                  <div className="form-section">
                    <motion.button
                      className="google-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGoogleLogin}
                    >
                      <svg className="google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Sign in with Google
                    </motion.button>
                  </div>

                  <div className="signup-text">
                    Don’t have an account?{' '}
                    <span
                        className="signup-link"
                        onClick={() => navigate('/signup')}
                    >
                        Sign up
                    </span>

                  </div>

                  <div className="terms-text">
                    By signing in, you agree to our{' '}
                    <span className="terms-link">Terms</span> and{' '}
                    <span className="terms-link">Privacy Policy</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
