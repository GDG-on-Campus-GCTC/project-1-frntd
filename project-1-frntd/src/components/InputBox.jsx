import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './InputBox.css';

const ProjectInputBox = ({ onSendMessage, hasMessages = false }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`projectinput-main ${hasMessages ? 'with-messages' : ''}`}>
            <div className="projectinput-box">
                <TextareaAutosize
                    className="projectinput-textarea"
                    placeholder="Ask a Question..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    minRows={1}
                    maxRows={6}
                />
                <button
                    className="projectinput-send"
                    title="Send message"
                    onClick={handleSend}
                    disabled={!input.trim()}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ProjectInputBox;
