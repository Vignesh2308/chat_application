const express = require("express");
const http = require('http');
const cors = require('cors')
const socketio = require('socket.io')

const authController = require('./controller/auth');
const chatController = require("./controller/chat");

const app = express();
const PORT = 5000;
const server = http.createServer(app);
const io = socketio(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

io.on('connection', (socket, errr)=>{

    socket.on('join', ({roomname})=>{
        io.emit('message', {roomname})
    })

    socket.on('disconnect',()=>{
        console.log("User has left")
    })
})

app.get('/', (req, res) => {
    res.status(200).send({ message: "Response from server" })
})

app.post('/register', authController.register)
app.post('/login', authController.login)
app.post('/join', authController.verifyUser, chatController.join)

app.listen(PORT, () => {
    console.log(`Server started running at ${PORT}`)
})