import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import './ChatContainer.css';

const ChatContainer = ({ messages, isLoading = false }) => {
    const containerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div className="chat-container" ref={containerRef}>
            <div className="chat-messages">
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        content={message.content}
                        role={message.role}
                        timestamp={message.timestamp}
                    />
                ))}
                {isLoading && <TypingIndicator />}
            </div>
        </div>
    );
};

export default ChatContainer;
