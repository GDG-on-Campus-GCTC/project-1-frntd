import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';
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
      setError('Only college emails ending with @gcet.edu.in are allowed');
    }
  }, [searchParams]);

  /* Cursor glow */
  useEffect(() => {
    const glow = document.querySelector('.glow-mouse');

    const moveGlow = (e) => {
      if (!glow) return;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', moveGlow);
    return () => window.removeEventListener('mousemove', moveGlow);
  }, []);

  return (
    <div className="login-container">
      {/* Background */}
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
                    <h2 className="signin-heading">Create Account</h2>
                    <p className="signin-subtitle">
                      GCTC Academic Workspace
                    </p>
                  </div>

                  {error && <div className="login-error">{error}</div>}

                  <button
                    className="google-btn"
                    onClick={handleGoogleSignup}
                  >
                    <svg className="google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
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
