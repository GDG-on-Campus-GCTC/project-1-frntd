import React from 'react';
import { motion } from 'framer-motion';
import './ChatMessage.css';

const ChatMessage = ({ content, role, time }) => {
    return (
        <motion.div
            className={`message ${role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="message-content">{content}</div>
            {time && (
                <div className="message-time">
                    {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </motion.div>
    );
};

export default ChatMessage;
