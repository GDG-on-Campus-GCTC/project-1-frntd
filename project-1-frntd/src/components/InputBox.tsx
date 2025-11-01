import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './InputBox.css';

const ProjectInputBox: React.FC = () => {
  const [input, setInput] = useState('');

  return (
    <div className="projectinput-main">
      <div className="projectinput-box">
        <div className="input-row">
          <TextareaAutosize
            className="projectinput-textarea"
            placeholder="Ask a question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            minRows={1}
            maxRows={6}
            style={{
              resize: "none",
              overflowY: "auto",
              // maxHeight: "180px",
              width: "100%",
              borderRadius: "12px",
              padding: "10px",
              fontSize: "16px",
              background: "transparent",
              border: "1px solid #3e3e42",
            }}
          />

          <button className="projectinput-send" title="Send">
            <span style={{ fontSize: 22 }}>↑</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectInputBox;
