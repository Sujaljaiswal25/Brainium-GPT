# Brainium GPT

A full‑stack chat application with AI assistance, persistent chat history, and real‑time messaging. The backend exposes REST APIs and Socket.IO for chat and AI responses, while the frontend (React + Redux) provides a responsive chat UI with authentication.


## Table of contents
- Overview
- Architecture
- Tech stack
- Features
- Project structure
- Backend
  - Server bootstrap
  - Middleware
  - Routes and controllers
  - Data models
  - Services (AI + Vector DB)
  - Socket events
  - Environment variables
  - Scripts
- Frontend
  - App flow and routes
  - State management
  - Components
  - Scripts
- Local development
- API reference
- Notes and caveats


## Overview
Brainium GPT enables users to register/login, create chats, send messages, and receive AI responses that leverage both short‑term chat history and long‑term vectorized memory. Authentication uses JWT stored in an HTTP cookie. Real‑time communication is handled by Socket.IO.


## Architecture
- Frontend: Vite + React + Redux Toolkit + React Router + Socket.IO client + Axios.
- Backend: Express + Socket.IO + MongoDB (Mongoose) + JWT auth + bcrypt.
- AI/Vector: Google Generative AI SDK (`@google/genai`) for responses and `@pinecone-database/pinecone` for vector memory.
- Transport/security: Cookies for JWT, CORS configured for `http://localhost:5173`.


## Tech stack
- Node 18+ recommended
- Backend dependencies: `express`, `socket.io`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `cors`, `dotenv`, `@google/genai`, `@pinecone-database/pinecone`
- Frontend dependencies: `react`, `react-dom`, `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `axios`, `socket.io-client`


## Features
- Authentication: Register, Login, Logout (`/api/auth/*`) with JWT cookie
- Chat management: Create chat, list user chats, load messages (`/api/chat/*`)
- Real‑time AI chat: Client emits messages, server streams back AI response via Socket.IO
- Vector memory: Each message is embedded and stored; similar past content is retrieved to augment AI responses
- Responsive UI: Chat layout with sidebar, messages, composer, mobile bar, theme toggle


## Project structure
```
backend/
  public/
  src/
    app.js                # Express app with CORS, cookies, static serving, routes
    controllers/
      auth.controller.js  # register, login, logout
      chat.controller.js  # createChat, getChats, getMessages
    db/
      db.js               # Mongoose connection
    middlewares/
      auth.middleware.js  # authUser (verifies JWT, attaches req.user)
    models/
      user.model.js       # User schema
      chat.model.js       # Chat schema
      message.model.js    # Message schema
    routes/
      auth.routes.js      # /api/auth
      chat.routes.js      # /api/chat
    services/
      ai.service.js       # generateResponse, generateVector
      vector.service.js   # createMemory, queryMemory (Pinecone)
    sockets/
      socket.server.js    # Socket.IO server, auth, ai-message handler
  server.js               # Bootstraps DB, HTTP server, and Socket.IO

frontend/
  src/
    App.jsx, AppRoutes.jsx, main.jsx
    pages/ Home.jsx, Login.jsx, Register.jsx
    store/ store.js, chatSlice.js
    components/
      ThemeToggle.jsx
      chat/ ChatSidebar.jsx, ChatMessages.jsx, ChatComposer.jsx, ChatMobileBar.jsx, aiClient.js
    styles/ and component CSS files
```


## Backend

### Server bootstrap
- `backend/server.js`: loads env, connects Mongo (`src/db/db.js`), initializes Socket.IO (`src/sockets/socket.server.js`), and starts HTTP server at port 3000.

### Express app and middleware
- `backend/src/app.js`
  - CORS: origin `http://localhost:5173`, `credentials: true`
  - JSON body parsing, cookie parser
  - Static files from `backend/public`
  - Routes mounted at `/api/auth` and `/api/chat`
  - Catch‑all serves `public/index.html`

### Routes and controllers
- `backend/src/routes/auth.routes.js`
  - POST `/api/auth/register` → `registerUser`
  - POST `/api/auth/login` → `loginUser`
  - POST `/api/auth/logout` → `logoutUser`

- `backend/src/controllers/auth.controller.js`
  - `registerUser`: checks exists, hashes password, creates user, sets JWT cookie, returns user JSON
  - `loginUser`: verifies password, sets JWT cookie, returns user JSON
  - `logoutUser`: clears cookie (attempts cross‑site options as well)

- `backend/src/routes/chat.routes.js` (protected)
  - POST `/api/chat/` → `createChat`
  - GET `/api/chat/` → `getChats`
  - GET `/api/chat/messages/:id` → `getMessages`

- `backend/src/controllers/chat.controller.js`
  - `createChat(user, title)` → creates chat for authenticated user
  - `getChats(user)` → lists chats for user
  - `getMessages(chatId)` → returns ascending chronological messages

- `backend/src/middlewares/auth.middleware.js`
  - `authUser`: verifies JWT from cookie, attaches `req.user`

### Data models
- `backend/src/models/user.model.js`: `{ fullName: { firstName, lastName }, email, password }`
- `backend/src/models/chat.model.js`: `{ user, title, lastActivity, ... }`
- `backend/src/models/message.model.js`: `{ chat, user, content, role, timestamps }`

### Services (AI + Vector DB)
- `backend/src/services/ai.service.js`
  - `generateVector(text)` → returns embedding for text
  - `generateResponse(messages)` → uses chat history + memory to get AI reply (Google GenAI)
- `backend/src/services/vector.service.js`
  - `createMemory({ vectors, messageId, metadata })` → upserts into Pinecone
  - `queryMemory({ queryVector, limit, metadata })` → retrieves similar items

### Socket events
- `backend/src/sockets/socket.server.js`
  - Auth: Parses `token` cookie; verifies with `JWT_SECRET`; loads user to `socket.user`
  - `connection` → `ai-message` handler
    - Persists user message → vectorize → create memory
    - Fetches: semantic memory + last ~20 messages
    - Builds prompt context and calls `aiService.generateResponse`
    - Emits `ai-response` with `{ content, chat }`
    - Persists AI response and stores its vectors into memory

### Environment variables
Create `backend/.env` with at least:
```
MONGO_URL=mongodb+srv://...         # MongoDB connection string
JWT_SECRET=your_jwt_secret          # Secret for signing JWT
GOOGLE_API_KEY=...                  # For @google/genai
PINECONE_API_KEY=...                # For @pinecone-database/pinecone
PINECONE_INDEX=...                  # Vector index name
```

### Scripts
- Backend `package.json`
  - `dev`: `npx nodemon server.js` (starts on port 3000)


## Frontend

### App flow and routes
- `frontend/src/main.jsx`: Bootstraps React + Redux Provider
- `frontend/src/App.jsx`: Loads global CSS and renders routes
- `frontend/src/AppRoutes.jsx`: React Router
  - `/` → `Home.jsx` (chat UI)
  - `/register` → `Register.jsx`
  - `/login` → `Login.jsx`

Auth pages call the deployed backend base `https://brainium-gpt.onrender.com` with `withCredentials: true` to set/read JWT cookie.

### State management
- `frontend/src/store/store.js`: Creates Redux store
- `frontend/src/store/chatSlice.js`: Chat state (chats, messages, async thunks, etc.)

### Components (chat)
- `ChatSidebar.jsx`: Chat list and creation
- `ChatMessages.jsx`: Displays messages
- `ChatComposer.jsx`: Input area, sends messages
- `ChatMobileBar.jsx`: Mobile controls
- `ThemeToggle.jsx`: Theme switch
- `aiClient.js`: Placeholder for AI client; real replies come via Socket.IO

### Scripts
- Frontend `package.json`
  - `dev`: `vite`
  - `build`: `vite build`
  - `preview`: `vite preview`


## Local development
1) Backend
- Install deps: `npm i` inside `backend/`
- Create `.env` (see above)
- Start: `npm run dev` (listens on `http://localhost:3000`)

2) Frontend
- Install deps: `npm i` inside `frontend/`
- Start: `npm run dev` (Vite on `http://localhost:5173`)
- Ensure CORS origin matches the frontend URL in `backend/src/app.js`

3) End‑to‑end
- Open the frontend, register/login
- Create a chat
- Type a message → frontend sends via Socket.IO, backend replies with `ai-response`


## API reference (REST)
- Auth
  - POST `/api/auth/register`
    - Body: `{ email, password, fullName: { firstName, lastName } }`
    - Sets cookie `token`
  - POST `/api/auth/login`
    - Body: `{ email, password }`
    - Sets cookie `token`
  - POST `/api/auth/logout`
    - Clears cookie

- Chat (requires auth cookie)
  - POST `/api/chat/`
    - Body: `{ title }`
    - Returns created chat
  - GET `/api/chat/`
    - Returns list of user chats
  - GET `/api/chat/messages/:id`
    - Returns messages for a chat

## Socket events
- Client → Server: `ai-message`
  - Payload: `{ chat: <chatId>, content: <text> }`
- Server → Client: `ai-response`
  - Payload: `{ chat: <chatId>, content: <modelText> }`


## Notes and caveats
- Cookies must be sent cross‑site when deployed; ensure `sameSite`/`secure` flags are configured appropriately by your hosting/proxy.
- Update `CORS` origin in `backend/src/app.js` for production domain(s).
- Frontend uses a deployed base URL for auth (`https://brainium-gpt.onrender.com`). For local dev, point Axios/socket to `http://localhost:3000` instead.
- Provide valid Google and Pinecone API keys and index for AI/vector features.


## License
MIT (or your preferred license)
