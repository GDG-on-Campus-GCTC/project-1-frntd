import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    User,
    Mail,
    Shield,
    Bell,
    Globe,
    Cpu,
    Palette,
    LogOut,
    ChevronRight
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import './Settings.css';

const Settings = ({ isOpen, onClose, theme, toggleTheme, user, onLogout }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="settings-overlay" onClick={onClose}>
                    <motion.div
                        className="settings-modal scriptor-modal"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="settings-header">
                            <div className="header-title-group">
                                <h2>Settings</h2>
                                <p>Manage your account and preferences</p>
                            </div>
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </header>

                        <div className="settings-body">
                            <section className="settings-group">
                                <div className="user-profile-card">
                                    <div className="user-avatar-large">
                                        {user?.name?.[0]}
                                    </div>
                                    <div className="user-text">
                                        <h3>{user?.name || 'User'}</h3>
                                        <p>{user?.email || 'user@gcet.edu.in'}</p>
                                    </div>
                                    <button className="edit-profile-btn">Edit</button>
                                </div>
                            </section>

                            <section className="settings-group">
                                <h4>PREFERENCES</h4>
                                <div className="settings-options">
                                    <div className="option-item">
                                        <div className="option-label">
                                            <Palette size={18} />
                                            <span>Appearance</span>
                                        </div>
                                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                                    </div>
                                    <div className="option-item">
                                        <div className="option-label">
                                            <Globe size={18} />
                                            <span>Language</span>
                                        </div>
                                        <div className="option-value">English <ChevronRight size={14} /></div>
                                    </div>
                                </div>
                            </section>

                            <section className="settings-group">
                                <h4>SYSTEM</h4>
                                <div className="settings-options">
                                    <div className="option-item">
                                        <div className="option-label">
                                            <Cpu size={18} />
                                            <span>Model Engine</span>
                                        </div>
                                        <div className="option-value">Scriptor-Core <ChevronRight size={14} /></div>
                                    </div>
                                    <div className="option-item">
                                        <div className="option-label">
                                            <Shield size={18} />
                                            <span>Privacy & Safety</span>
                                        </div>
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <footer className="settings-footer">
                            <button className="logout-btn" onClick={onLogout}>
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Settings;
