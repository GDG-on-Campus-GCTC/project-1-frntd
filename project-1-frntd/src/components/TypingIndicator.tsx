import './TypingIndicator.css';

const TypingIndicator: React.FC = () => {
  return (
    <div className="chat-message-wrapper assistant">
      <div className="chat-message assistant typing-indicator">
        <div className="typing-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
