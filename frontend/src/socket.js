import { io } from 'socket.io-client';

const rawSocketUrl = import.meta.env.VITE_SOCKET_URL;
const rawApiUrl = import.meta.env.VITE_API_URL;
const defaultSocketUrl = 'http://localhost:5000';

const isProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

// ✅ Force live socket domain if in production
const socketUrl = isProduction
  ? "https://moviemate-l4ts.onrender.com"
  : (rawSocketUrl || (rawApiUrl ? rawApiUrl.replace(/\/api\/?$/, '') : null) || defaultSocketUrl);

const socket = io(socketUrl, {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

export default socket;