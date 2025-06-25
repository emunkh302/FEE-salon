import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8888';
let socket: Socket;

export const connectSocket = (userId: string) => {
  if (socket) return; // Prevent multiple connections
  
  socket = io(SOCKET_URL, {
    // You can add auth options here if your backend requires them
    // auth: { token: 'your_jwt_token' }
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully!');
    // Join a private room for this user
    socket.emit('joinRoom', userId);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected.');
  });
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => {
    if (!socket) {
        console.warn("Socket not connected. Call connectSocket first.");
    }
    return socket;
}