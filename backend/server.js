// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Replace with your frontend origin
      methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('code-change', (code) => {
        // Broadcast code changes to all connected clients except sender
        socket.broadcast.emit('code-update', code);
    });
});

server.listen(4000, () => {
    console.log('listening on *:4000');
});
