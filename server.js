require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/db/db")
const initSocketServer = require("./src/sockets/socket.server")
const httpServer = require("http").createServer(app)


connectToDB();

initSocketServer(httpServer)






httpServer.listen(3000, ()=>{
    console.log("server start on port no 3000")
})