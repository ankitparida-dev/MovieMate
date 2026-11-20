import { useEffect, useState, useRef } from 'react';
import socket from '../socket'; // ✅ Import the shared socket, do NOT use io() here

export const useWatchParty = () => {
  const [roomCode, setRoomCode] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const isRemoteAction = useRef(false); 

  useEffect(() => {
    // Ensure socket is connected when the hook mounts
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('user-joined', ({ users }) => setUsers(users));
    socket.on('user-left', ({ users }) => setUsers(users));
    
    socket.on('room-closed', () => {
      alert("The host has closed the room.");
      setRoomCode(null);
      setUsers([]);
      setMessages([]);
    });

    return () => {
      socket.off('receive-message');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('room-closed');
    };
  }, []);

  const createRoom = (hostName) => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    socket.emit('create-room', { roomCode: code, hostName }, (res) => {
      if (res.success) setRoomCode(code);
    });
  };

  const joinRoom = (code, userName) => {
    socket.emit('join-room', { roomCode: code, userName }, (res) => {
      if (res.success) {
        setRoomCode(code);
        setUsers(res.users);
        return res.videoState; 
      } else {
        alert(res.message);
        return null;
      }
    });
  };

  const syncVideo = (action, currentTime) => {
    if (!isRemoteAction.current && roomCode) {
      socket.emit('sync-video', { roomCode, action, currentTime });
    }
  };

  const sendMessage = (message, userName) => {
    if (roomCode) {
      socket.emit('send-message', { roomCode, message, userName });
    }
  };

  return { 
    roomCode, users, messages, createRoom, joinRoom, syncVideo, sendMessage, 
    isRemoteAction, socket 
  };
};