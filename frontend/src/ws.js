import { io } from 'socket.io-client';

// 1. Get the public backend URL from the environment variable set in Render
//    On Render, this will be: 'https://realchat-backend-mtpa.onrender.com'
const BACKEND_URL = import.meta.env.VITE_API_URL; 

export function connectWS() {
    // 2. Determine the correct protocol: 'wss' for production (Render)
    //    We replace the 'https' part of the URL with 'wss' for the WebSocket connection.
    const wsUrl = BACKEND_URL.replace('https', 'wss');

    // 3. Connect using the secure, public URL
    return io(wsUrl);
}