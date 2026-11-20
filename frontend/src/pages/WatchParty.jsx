import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useWatchParty } from '../hooks/useWatchParty';
import styles from './WatchParty.module.css';

const WatchParty = () => {
  const { 
    roomCode, users, messages, createRoom, joinRoom, syncVideo, sendMessage, isRemoteAction, socket 
  } = useWatchParty();

  const [inputCode, setInputCode] = useState('');
  const [userName, setUserName] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); 
  
  const playerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    
    socket.on('video-synced', ({ action, currentTime }) => {
      isRemoteAction.current = true; 
      
      if (action === 'play') setPlaying(true);
      if (action === 'pause') setPlaying(false);
      if (action === 'seek') {
        playerRef.current.seekTo(currentTime, 'seconds');
      }

      setTimeout(() => {
        isRemoteAction.current = false;
      }, 500);
    });

    return () => socket.off('video-synced');
  }, [socket]);

  const handlePlay = () => {
    if (isRemoteAction.current) return;
    syncVideo('play', playerRef.current.getCurrentTime());
    setPlaying(true);
  };

  const handlePause = () => {
    if (isRemoteAction.current) return;
    syncVideo('pause', playerRef.current.getCurrentTime());
    setPlaying(false);
  };

  const handleSeek = (seconds) => {
    if (isRemoteAction.current) return;
    syncVideo('seek', seconds);
  };

  if (!roomCode) {
    return (
      <div className={styles.lobbyContainer}>
        <h2>🍿 Create or Join a Watch Party</h2>
        
        <div className={styles.inputGroup}>
          <input 
            placeholder="Enter your name" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)} 
          />
        </div>

        <div className={styles.actionButtons}>
          <button onClick={() => createRoom(userName)} disabled={!userName}>
            Create New Room
          </button>
          
          <span className={styles.divider}>OR</span>
          
          <div className={styles.joinGroup}>
            <input 
              placeholder="Enter Room Code" 
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())} 
            />
            <button onClick={() => joinRoom(inputCode, userName)} disabled={!userName || !inputCode}>
              Join Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.watchPartyLayout}>
      <div className={styles.videoSection}>
        <div className={styles.roomHeader}>
          <h3>Room Code: <span>{roomCode}</span></h3>
          <input 
            type="text" 
            value={videoUrl} 
            onChange={(e) => setVideoUrl(e.target.value)} 
            placeholder="Paste video URL here..."
            className={styles.urlInput}
          />
        </div>
        
        <div className={styles.playerWrapper}>
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            playing={playing}
            controls
            width="100%"
            height="100%"
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
          />
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.participants}>
          <h4>Participants ({users.length})</h4>
          <ul>{users.map((u, i) => <li key={i}>🟢 {u.name}</li>)}</ul>
        </div>
        
        <div className={styles.chatSection}>
          <h4>Live Chat</h4>
          <div className={styles.chatBox}>
            {messages.map((m, i) => (
              <div key={i} className={styles.chatMessage}>
                <strong>{m.userName}:</strong> {m.message}
              </div>
            ))}
          </div>
          <div className={styles.chatInputGroup}>
            <input 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)} 
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && chatInput && sendMessage(chatInput, userName) && setChatInput('')}
            />
            <button onClick={() => { sendMessage(chatInput, userName); setChatInput(''); }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchParty;