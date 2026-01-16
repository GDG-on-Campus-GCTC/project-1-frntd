import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';
import { toast } from 'sonner';
import logo from '../assets/logo.png';
import { API_CONFIG } from '../config/api-config';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  const handleGoogleSignup = () => {
    window.location.href = API_CONFIG.AUTH.GOOGLE;
  };

  /* Handle OAuth errors after backend redirect */
  useEffect(() => {
    const err = searchParams.get('error');
    if (err === 'domain_not_allowed') {
      const msg = 'Only college emails ending with @gcet.edu.in are allowed';
      setError(msg);
      toast.error(msg);
    }
  }, [searchParams]);

  /* Cursor glow effect */
  useEffect(() => {
    const moveGlow = (e) => {
      const glow = document.querySelector('.glow-mouse');
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', moveGlow);
    return () => window.removeEventListener('mousemove', moveGlow);
  }, []);

  return (
    <div className="login-container">
      {/* Background Effects */}
      <div className="dot-pattern" />
      <div className="glow-orb glow-mouse" />
      <div className="glow-orb glow-blue" />

      <div className="content-wrapper">
        <div className="content-container">
          <div className="grid-layout signup-layout">
            {/* LEFT — SIGNUP CARD */}
            <motion.div
              className="left-section"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="signin-card"
                whileHover={{
                  boxShadow: '0 0 60px rgba(59,130,246,0.35)',
                }}
              >
                <div className="card-content">
                  <div className="card-header">
                    <img src={logo} alt="GCTC" className="login-logo" style={{ width: '50px', marginBottom: '1rem' }} />
                    <h2 className="signin-heading">Create Account</h2>
                    <p className="signin-subtitle">
                      GCTC Academic Workspace
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="login-error"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    className="google-btn"
                    onClick={handleGoogleSignup}
                  >
                    <Chrome size={20} className="google-icon-svg" />
                    Sign up with Google
                  </button>

                  <p className="signup-text">
                    Already have an account?{' '}
                    <span
                      className="signup-link"
                      onClick={() => navigate('/login')}
                    >
                      Sign in
                    </span>
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT — INFO */}
            <motion.div
              className="right-section"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="workspace-info">
                <h1 className="main-heading">GCTC Workspace</h1>
                <p className="subtitle">
                  A focused and well-organized environment for effective learning
                </p>

                <div className="features-list">
                  {[
                    {
                      text: 'Easy access to essential exam resources',
                      color: 'rgba(59,130,246,0.8)',
                    },
                    {
                      text: 'Intelligent study assistance to support your progress',
                      color: 'rgba(168,85,247,0.8)',
                    },
                    {
                      text: 'A structured space for all learning materials',
                      color: 'rgba(236,72,153,0.8)',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="feature-item"
                      whileHover={{ x: 12 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <motion.span
                        className="feature-dot"
                        whileHover={{
                          scale: 1.5,
                          boxShadow: `0 0 15px ${item.color}`,
                        }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      />
                      <p>{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
