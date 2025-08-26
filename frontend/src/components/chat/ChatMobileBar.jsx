// import React from 'react';
// import './ChatMobileBar.css';
// import './ChatLayout.css';


// const ChatMobileBar = ({ onToggleSidebar, onNewChat }) => (
//   <header className="chat-mobile-bar">
//     <button className="chat-icon-btn" onClick={onToggleSidebar} aria-label="Toggle chat history">☰</button>
//     <h1 className="chat-app-title">Chat</h1>
//     <button className="chat-icon-btn" onClick={onNewChat} aria-label="New chat">＋</button>
//   </header>
// );

// export default ChatMobileBar;




import React from 'react';
import './ChatMobileBar.css';

const ChatMobileBar = ({ onToggleSidebar, onNewChat, title = "Chat AI" }) => {
  return (
    <header className="chat-mobile-bar">
      <button 
        className="chat-icon-btn sidebar-toggle" 
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="mobile-bar-center">
        <div className="app-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="9" r="1" fill="currentColor"/>
              <circle cx="15" cy="9" r="1" fill="currentColor"/>
              <path d="M8 13c0 1.5 1.79 3 4 3s4-1.5 4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="chat-app-title">{title}</h1>
        </div>
        
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span className="status-text">Online</span>
        </div>
      </div>

      <div className="mobile-bar-actions">
        <button 
          className="chat-icon-btn action-btn" 
          onClick={onNewChat}
          aria-label="Start new chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button 
          className="chat-icon-btn action-btn" 
          aria-label="More options"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="19" cy="12" r="1" fill="currentColor"/>
            <circle cx="5" cy="12" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default ChatMobileBar;