import './NewChatButton.css';

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  return (
    <button className="new-chat-button" onClick={onClick} title="Start New Chat">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      <span>New Chat</span>
    </button>
  );
};

export default NewChatButton;
