import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Hexagon, Circle, Triangle, Square, Database, Shield } from 'lucide-react';
import logo from './assets/logo.png';
import InstallPWA from './components/InstallPWA';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const [userCount, setUserCount] = React.useState(1243);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setUserCount(prev => {
                const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
                return prev + change;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const specialists = [
        { id: 1, name: 'Sarah', role: 'Designer', img: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, name: 'Mike', role: 'Developer', img: 'https://i.pravatar.cc/150?u=2' },
        { id: 3, name: 'Anna', role: 'Marketer', img: 'https://i.pravatar.cc/150?u=3' },
        { id: 4, name: 'John', role: 'Manager', img: 'https://i.pravatar.cc/150?u=4' },
        { id: 5, name: 'Elena', role: 'Analyst', img: 'https://i.pravatar.cc/150?u=5' },
        { id: 6, name: 'David', role: 'Lead', img: 'https://i.pravatar.cc/150?u=6' },
    ];

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="nav-logo">
                        <img src={logo} alt="GCTC" />
                        <span>GCTC Workspace</span>
                    </div>
                    <div className="nav-links">
                        <a href="#about" className="nav-link">About</a>
                        <a href="#features" className="nav-link">Features</a>
                    </div>
                    <div className="nav-auth">
                        <button className="btn-join" onClick={() => navigate('/login')}>Join Now</button>
                    </div>
                </div>
            </nav>

            <main className="landing-main">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hero-content"
                >
                    <h1 className="hero-title">
                        Master EVERY<br />
                        Subject with<br />
                        AI-Powered<br />
                        Intelligence
                    </h1>
                    <div className="hero-actions">
                        <button className="cta-button" onClick={() => navigate('/login')}>
                            Get Started
                            <ArrowRight size={24} />
                        </button>
                        <InstallPWA />
                    </div>
                </motion.div>

                <div className="radar-wrapper">
                    <div className="radar-container">
                        <div className="radar-circle circle-1"></div>
                        <div className="radar-circle circle-2"></div>
                        <div className="radar-circle circle-3"></div>
                        <div className="radar-circle circle-4"></div>

                        <div className="radar-center">
                            <h2>{userCount.toLocaleString()}</h2>
                            <p>Active Students</p>
                        </div>

                        {specialists.map((s, i) => (
                            <div
                                key={s.id}
                                className={`orbit-avatar avatar-${i + 1} ${i % 2 === 0 ? 'glow' : 'sparkle'}`}
                            >
                                <img src={s.img} alt={s.name} />
                            </div>
                        ))}
                    </div>

                    <div className="cursor-preview">
                        <div className="cursor-pointer"></div>
                        <div className="cursor-tag">David</div>
                    </div>
                </div>
            </main>

            {/* ... rest of the component removed footer ... */}
        </div>
    );
};

export default Landing;
