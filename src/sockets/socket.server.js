const { Server } = require("socket.io");
const cookie = require("cookie")
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service")
const messageModel = require("../models/message.model");
const {createMemory, queryMemory} = require("../services/vector.service")


// Initialize and configure the Socket.IO server for real-time chat + AI replies
// This is called from your HTTP server (for example, in `src/app.js`)
function initSocketServer(httpServer) {

    // Create a Socket.IO server instance bound to the existing HTTP server
    const io = new Server(httpServer, {})


    // Authentication middleware: verifies JWT from cookies and attaches user to the socket
    io.use( async (socket, next) => {

        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");


        if(!cookies.token){
            next(new Error("Authentication error: No token provided"));
        }

        try{
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

            const user = await userModel.findById(decoded.id);

            socket.user = user;
            
            next();
        }
        catch(error){
            next(new Error("Authentication error: Invalid token"));
        }
    })



    // New WebSocket connection established for an authenticated user
    io.on("connection", (socket) => {

        // User sent a message to the AI for a specific chat
        // Steps: save user msg -> build chat history -> get AI reply -> save reply -> emit back
        socket.on("ai-message", async (messagePayload) => {
            // 1) Persist the user's message in DB
            await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: messagePayload.content,
                role: "user"
            })

            // 2) Load last 20 messages for this chat (oldest -> newest) to give context to the AI
            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({ createdAt: -1 }).limit(20).lean()).reverse()


            // 3) Ask the AI to generate a response using the formatted chat history
            const response = await aiService.generateResponse(chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [ { text: item.content } ]
                }
            }))

            // 4) Save the AI's response (role: "model")
            await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            })

            // 5) Send the AI response back to the same client over WebSocket
            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })

        })

    })

}


module.exports = initSocketServer;