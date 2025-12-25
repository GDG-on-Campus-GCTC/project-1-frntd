import React from 'react';
import { motion } from 'framer-motion';
import './SubjectCard.css';

const SubjectCard = ({ name, emoji, color, desc, count, onClick }) => {
    return (
        <motion.div
            className="subject-card"
            whileHover={{ y: -4 }}
            onClick={onClick}
            style={{ '--color': color }}
        >
            <div className="card-emoji">{emoji}</div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <div className="card-footer">
                <span>{count} resources</span>
            </div>
        </motion.div>
    );
};

export default SubjectCard;
