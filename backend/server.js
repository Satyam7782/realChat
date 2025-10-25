import { createServer } from 'node:http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

// Use a specific frontend URL for security in production, or '*' for wide testing.
// NOTE: For a secure, permanent solution, replace '*' with your frontend Render URL:
// const FRONTEND_URL = "https://your-frontend-name.onrender.com"; 
// const io = new Server(server, { cors: { origin: FRONTEND_URL } });
const io = new Server(server, {
    cors: {
        origin: '*', // Allows all origins for testing across devices
    },
});

const ROOM = 'group';

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('joinRoom', async (userName) => {
        console.log(`${userName} is joining the group.`);

        await socket.join(ROOM);

        // Notify others in the room that a new user joined (excluding the sender)
        socket.to(ROOM).emit('roomNotice', `${userName} has joined the chat.`);
    });

    socket.on('chatMessage', (msg) => {
        // FIX: Use io.to(ROOM).emit() to send the message to ALL members 
        // in the room, INCLUDING the sender, so they see their own message.
        io.to(ROOM).emit('chatMessage', msg);
    });

    socket.on('typing', (userName) => {
        // Exclude sender (correct for typing indicator)
        socket.to(ROOM).emit('typing', userName); 
    });

    socket.on('stopTyping', (userName) => {
        // Exclude sender (correct for typing indicator)
        socket.to(ROOM).emit('stopTyping', userName);
    });
    
    // Optional: Handle disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        // You might want to broadcast a 'user left' message here
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Chat Server is Running</h1>');
});

// Use process.env.PORT for Render deployment, or default to a local port
const PORT = process.env.PORT || 4600;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});