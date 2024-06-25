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

// Store rooms in an object where key is the room ID and value is an array of socket IDs
const rooms = {};

io.on('connection', (socket) => {
  console.log(`user with id ${socket.id} connected`);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(socket.id);
    console.log(`user with id ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
    console.log(`user with id ${socket.id} left room ${roomId}`);
  });

  socket.on('code-change', (code, roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].forEach(memberSocketId => {
        if (memberSocketId !== socket.id) {
          io.to(memberSocketId).emit('code-update', code);
        }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`user with id ${socket.id} disconnected`);
    // Remove socket from all rooms it was part of
    Object.keys(rooms).forEach(roomId => {
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    });
  });
});

server.listen(4000, () => {
  console.log('listening on : 4000');
});
