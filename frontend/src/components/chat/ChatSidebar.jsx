// import React from 'react';
// import './ChatSidebar.css';


// const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open }) => {


  
//   return (
//     <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">
//       <div className="sidebar-header">
//         <h2>Chats</h2>
//         <button className="small-btn" onClick={onNewChat}>New</button>
//       </div>
//       <nav className="chat-list" aria-live="polite">
//         {chats.map(c => (
//           <button
//             key={c._id}
//             className={"chat-list-item " + (c._id === activeChatId ? 'active' : '')}
//             onClick={() => onSelectChat(c._id)}
//           >
//             <span className="title-line">{c.title}</span>
//           </button>
//         ))}
//         {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
//       </nav>
//     </aside>
//   );
// };

// export default ChatSidebar;




import React from 'react';
import './ChatSidebar.css';

const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="sidebar-backdrop" onClick={() => {}} />}
      
      <aside className={`chat-sidebar ${open ? 'open' : ''}`} aria-label="Previous chats">
        <div className="sidebar-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="logo-text">Chats</h1>
            </div>
            <button className="new-chat-btn" onClick={onNewChat} aria-label="Start new chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>New</span>
            </button>
          </div>
        </div>

        <div className="chat-list-container">
          <nav className="chat-list" aria-live="polite">
            {chats.map((chat, index) => (
              <button
                key={chat._id}
                className={`chat-item ${chat._id === activeChatId ? 'active' : ''}`}
                onClick={() => onSelectChat(chat._id)}
                aria-label={`Select chat: ${chat.title}`}
              >
                <div className="chat-item-content">
                  <div className="chat-avatar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="chat-details">
                    <span className="chat-title">{chat.title}</span>
                    <span className="chat-time">2 hours ago</span>
                  </div>
                </div>
                <div className="chat-actions">
                  <div className="chat-action-btn" aria-label="More options" role="img">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1" fill="currentColor"/>
                      <circle cx="19" cy="12" r="1" fill="currentColor"/>
                      <circle cx="5" cy="12" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </button>
            ))}
            
            {chats.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 9h8M8 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="empty-title">No conversations yet</h3>
                <p className="empty-description">Start a new chat to begin your conversation</p>
              </div>
            )}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="upgrade-card">
            <div className="upgrade-content">
              <span className="upgrade-text">Upgrade to Pro</span>
              <span className="upgrade-subtext">Unlimited chats & more</span>
            </div>
            <button className="upgrade-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;