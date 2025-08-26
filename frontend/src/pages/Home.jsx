import React, { useCallback, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { fakeAIReply } from '../components/chat/aiClient.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ensureInitialChat,
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  addUserMessage,
  addAIMessage,
  setChats
} from '../store/chatSlice.js';

const Home = () => {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const input = useSelector(state => state.chat.input);
  const isSending = useSelector(state => state.chat.isSending);
  const [ sidebarOpen, setSidebarOpen ] = React.useState(false);
  const [ socket, setSocket ] = useState(null);
  const navigate = useNavigate();

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const [ messages, setMessages ] = useState([
    // {
    //   type: 'user',
    //   content: 'Hello, how can I help you today?'
    // },
    // {
    //   type: 'ai',
    //   content: 'Hi there! I need assistance with my account.'
    // }
  ]);

  const handleNewChat = async () => {
    // Prompt user for title of new chat, fallback to 'New Chat'
    let title = window.prompt('Enter a title for the new chat:', '');
    if (title) title = title.trim();
    if (!title) return

    const response = await axios.post("https://brainium-gpt.onrender.com/api/chat", {
      title
    }, {
      withCredentials: true
    })
    getMessages(response.data.chat._id);
    dispatch(startNewChat(response.data.chat));
    setSidebarOpen(false);
  }

  // Ensure user is authenticated, then load chats and init socket
  useEffect(() => {
    let cancelled = false;

    axios
      .get("https://brainium-gpt.onrender.com/api/chat", { withCredentials: true })
      .then(response => {
        if (cancelled) return;
        dispatch(setChats(response.data.chats.reverse()));

        const tempSocket = io("https://brainium-gpt.onrender.com", { withCredentials: true });

        tempSocket.on("ai-response", (messagePayload) => {
          console.log("Received AI response:", messagePayload);
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'ai', content: messagePayload.content }
          ]);
          dispatch(sendingFinished());
        });

        setSocket(tempSocket);
      })
      .catch(err => {
        const status = err?.response?.status;
        if (status === 401) {
          navigate('/login', { replace: true });
        } else {
          console.error('Failed to fetch chats:', err);
        }
      });

    return () => {
      cancelled = true;
      if (socket) {
        try { socket.disconnect(); } catch {}
      }
    };
  }, []);

  const sendMessage = async () => {

    const trimmed = input.trim();
    console.log("Sending message:", trimmed);
    if (!trimmed || !activeChatId || isSending) return;
    dispatch(sendingStarted());

    const newMessages = [ ...messages, {
      type: 'user',
      content: trimmed
    } ];

    console.log("New messages:", newMessages);

    setMessages(newMessages);
    dispatch(setInput(''));

    socket.emit("ai-message", {
      chat: activeChatId,
      content: trimmed
    })

    // try {
    //   const reply = await fakeAIReply(trimmed);
    //   dispatch(addAIMessage(activeChatId, reply));
    // } catch {
    //   dispatch(addAIMessage(activeChatId, 'Error fetching AI response.', true));
    // } finally {
    //   dispatch(sendingFinished());
    // }
  }

  const getMessages = async (chatId) => {

   const response = await  axios.get(`https://brainium-gpt.onrender.com/api/chat/messages/${chatId}`, { withCredentials: true })

   console.log("Fetched messages:", response.data.messages);

   setMessages(response.data.messages.map(m => ({
     type: m.role === 'user' ? 'user' : 'ai',
     content: m.content
   })));

  }


return (
  <div className="chat-layout minimal">
    <ChatMobileBar
      onToggleSidebar={() => setSidebarOpen(o => !o)}
      onNewChat={handleNewChat}
    />
    <ChatSidebar
      chats={chats}
      activeChatId={activeChatId}
      onSelectChat={(id) => {
        dispatch(selectChat(id));
        setSidebarOpen(false);
        getMessages(id);
      }}
      onNewChat={handleNewChat}
      open={sidebarOpen}
    />
    <main className="chat-main" role="main">
      {messages.length === 0 && (
        <div className="chat-welcome" aria-hidden="true">
          <div className="chip">Early Preview</div>
          <h1>Branium AI</h1>
          <p>Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.</p>
          <div className="welcome-actions">
            <button className="prompt-card" type="button" onClick={() => dispatch(setInput('Summarize this article: '))}>
              <span className="prompt-title">Summarize this article</span>
              <span className="prompt-desc">Paste a link and get key takeaways</span>
            </button>
            <button className="prompt-card" type="button" onClick={() => dispatch(setInput('Brainstorm ideas about: '))}>
              <span className="prompt-title">Brainstorm ideas</span>
              <span className="prompt-desc">Generate creative directions quickly</span>
            </button>
            <button className="prompt-card" type="button" onClick={() => dispatch(setInput('Help me fix this code: '))}>
              <span className="prompt-title">Fix my code</span>
              <span className="prompt-desc">Explain errors and propose a patch</span>
            </button>
            <button className="prompt-card" type="button" onClick={() => dispatch(setInput('Draft an email about: '))}>
              <span className="prompt-title">Write an email</span>
              <span className="prompt-desc">Professional, concise tone</span>
            </button>
          </div>
        </div>
      )}
      <ChatMessages messages={messages} isSending={isSending} />
      {
        activeChatId &&
        <ChatComposer
          input={input}
          setInput={(v) => dispatch(setInput(v))}
          onSend={sendMessage}
          isSending={isSending}
        />}
    </main>
    {sidebarOpen && (
      <button
        className="sidebar-backdrop"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      />
    )}
  </div>
);
};

export default Home;
