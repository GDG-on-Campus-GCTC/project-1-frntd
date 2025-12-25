import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './InputBox.css';

const InputBox = ({ onSend }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSend(input.trim());
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
        <div className="input-box">
            <TextareaAutosize
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                minRows={1}
                maxRows={6}
            />
            <button onClick={handleSend} disabled={!input.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default InputBox;
