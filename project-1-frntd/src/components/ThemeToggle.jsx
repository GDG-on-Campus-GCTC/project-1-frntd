import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <button className={`theme-toggle ${theme}`} onClick={toggleTheme}>
            <div className="toggle-track">
                <motion.div
                    className="toggle-thumb"
                    animate={{ x: theme === 'dark' ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                </motion.div>
            </div>
        </button>
    );
};

export default ThemeToggle;
