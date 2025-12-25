import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from './assets/logo.png';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="nav-logo">
                        <img src={logo} alt="GCTC Workspace" />
                        <span>GCTC Workspace</span>
                    </div>
                    <div className="nav-actions">
                        <div className="nav-right">
                            <button className="nav-btn" onClick={() => navigate('/login')}>
                                Sign In
                            </button>

                            {/* added Sign Up button — uses same class and position */}
                            <button
                                className="nav-btn"
                                onClick={() => navigate('/signup')}
                                style={{ marginLeft: 8 }}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="landing-main">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hero"
                >
                    <h1 className="hero-title">
                        GCTC Workspace
                    </h1>
                    <p className="hero-subtitle">
                        Ask anything, create anything
                    </p>
                    <div className="hero-cta">
                        <Link to="/signup" className="cta-btn" aria-label="Get Started">
                            Get Started &rarr;
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="features"
                >
                    {[
                        { icon: '🤖', title: 'AI Assistant', desc: 'Instant answers from GCTC exam papers' },
                        { icon: '📚', title: 'Study Resources', desc: 'Previous papers and study materials' },
                        { icon: '🎯', title: 'Subject-Wise', desc: 'Organized by subject - DAA, OS, DBMS' }
                    ].map((feature, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </main>

            <footer className="landing-footer">
                © 2025 GDG on Campus GCTC
            </footer>
        </div>
    );
};

export default Landing;
