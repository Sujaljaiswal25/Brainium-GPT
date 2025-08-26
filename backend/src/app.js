const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const path= require("path")

const authRoute = require("./routes/auth.route")
const chatRoute = require("./routes/chat.route")

const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use("/api/auth", authRoute)
app.use("/api/chat", chatRoute)


app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
