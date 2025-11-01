import React from 'react';
import './LogoutButton.css';

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <button className="logout-btn" onClick={handleLogout} title="Logout">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
