const express = require('express');
const http = require('http'); // Import the HTTP module
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app); // Create an HTTP server

const io = new Server(server, {
    cors: true,
});

app.use(express.json());

const emailToSocketMapping = new Map();

const socketToEmailMapping = new Map();

io.on('connection', (socket) => {

    console.log('a user connected', socket.id);

    socket.on('join-room', (data) => {
        
        console.log("join room ke andar");
        const { roomId, emailId } = data;
        emailToSocketMapping.set(emailId, socket.id);

        socketToEmailMapping.set(socket.id, emailId);

        console.log(roomId, emailId);
        socket.join(roomId);

        socket.emit('joined-room', { emailId,roomId });

        socket.broadcast.to(roomId).emit('user-joined',{ emailId });
        
    });



    socket.on('call-user', (data) => {

        // ish emailId ko maine ek offer de diya 

        const { emailId,offer } = data;

        const fromEmail = socketToEmailMapping.get(socket.id);

        const socketId = emailToSocketMapping.get(emailId);

        socket.to(socketId).emit("incomming-call",{ from :fromEmail,offer });


    })



    socket.on("call-accepted",(data)=>{

        const{ans} = data;

        const emailId = data.from;

        console.log("call acepted at the server side ",emailId,ans);

        const socketId = emailToSocketMapping.get(emailId);

        socket.to(socketId).emit("call-accept",{ans});

    })

});


const PORT = 8000;
server.listen(PORT, () => {

    console.log("Express server listening on port", PORT);

});

const SOCKET_PORT = 8001;
io.listen(SOCKET_PORT, () => {

    console.log("Socket.IO server listening on port", SOCKET_PORT);

});


