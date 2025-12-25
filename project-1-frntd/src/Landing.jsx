import React from 'react';
import { useNavigate } from 'react-router-dom';
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
                    <button className="nav-btn" onClick={() => navigate('/login')}>
                        Sign In
                    </button>
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
                    <button className="cta-button" onClick={() => navigate('/login')}>
                        Get Started
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
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
