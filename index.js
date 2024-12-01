const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

// Configure CORS to allow requests from the client
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST'],
  credentials: true // Allow credentials if needed
}));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST'],
    credentials: true // Allow credentials if needed
  }
});

// Start the server on port 4000
server.listen(4000, () => {
  console.log('Server is running on port 4000');
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Determine if this is the first client to connect (Peer A)
  if (io.engine.clientsCount === 1) {
    socket.emit('initiate'); // Notify Peer A to start the offer process
  }

  // Relay signaling data between peers
  socket.on('signal', (data) => {
    // Broadcast the signal data to all other connected clients
    socket.broadcast.emit('signal', data);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});