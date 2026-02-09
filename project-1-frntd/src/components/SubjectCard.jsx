import React from 'react';
import { motion } from 'framer-motion';
import './SubjectCard.css';

const SubjectCard = ({ name, icon, color, desc, count, onClick }) => {
    // Generate an RGB version of the hex color for the pulse effect
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    };

    return (
        <motion.div
            className="subject-card"
            whileHover={{ y: -4 }}
            onClick={onClick}
            style={{ '--color': color, '--color-rgb': hexToRgb(color) }}
        >
            <div className="card-icon">{icon}</div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <div className="card-footer">
                <span>{count} resources</span>
            </div>
        </motion.div>
    );
};

export default SubjectCard;
