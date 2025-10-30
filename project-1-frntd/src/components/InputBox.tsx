import React, { useState, useRef } from 'react';
import './InputBox.css';

const ProjectInputBox: React.FC = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow height function
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className="projectinput-main">
      <h1 className="projectinput-title">What can I help you ship?</h1>
      <div className="projectinput-box">
        <div className="input-row">
          <textarea
            ref={inputRef}
            className="projectinput-textarea"
            placeholder="Ask a question..."
            value={input}
            onChange={handleInputChange}
            rows={1}
            style={{ resize: "none", overflow: "hidden", minHeight: "36px" }}
          />
          <button className="projectinput-send" title="Send">
            <span style={{fontSize:22}}>↑</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectInputBox;
