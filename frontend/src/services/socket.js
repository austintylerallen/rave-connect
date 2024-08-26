// src/services/socket.js
import io from 'socket.io-client';

const socket = io.connect(process.env.REACT_APP_API_URL, {
  transports: ['websocket'], // Force WebSocket transport
});

export default socket;
