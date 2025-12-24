import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ content, role, timestamp }) => {
    return (
        <div className={`chat-message-wrapper ${role}`}>
            <div className={`chat-message ${role}`}>
                <div className="message-content">{content}</div>
                {timestamp && (
                    <div className="message-timestamp">
                        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
