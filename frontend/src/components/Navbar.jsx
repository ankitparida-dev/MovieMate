import { useState, useEffect } from 'react';
import styles from "./Navbar.module.css";
import logoVideo from "../assets/movielight.mp4";
import Avatar from './Avatar';
import NotificationBell from './NotificationBell';
import socket from '../socket';

export default function Navbar({ setPage, page, onSearch }) {
  
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user"); 
    setIsLoggedIn(!!user);
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.email || 'User');
       setIsAdmin(userData.isAdmin === true);
        
        console.log('🔴 NAVBAR - userData:', userData);
       
console.log('🔴 NAVBAR - isAdmin:', userData.isAdmin);
        
      } catch {
        setUserName('User');
      }
    }
  }, [page]);

  // Socket.io listeners
  useEffect(() => {
    socket.on('onlineUsers', (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off('onlineUsers');
    };
  }, []);

  const getLinkClass = (pageName) => {
    return `${styles.navLink} ${page === pageName ? styles.active : ''}`;
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    } else {
      onSearch("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const goHome = () => {
    onSearch(""); 
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_avatar");
    localStorage.removeItem("avatar_type");
    localStorage.removeItem("cartoon_avatar_svg");
    setIsLoggedIn(false);
    goHome();
  };

  return (
    <header className={styles.mainHeader}>
      <div className={styles.navbar}>
        {/* LEFT SECTION - Logo + Online Users */}
        <div className={styles.leftSection}>
          <button className={styles.logo} onClick={goHome}>
            <video src={logoVideo} autoPlay muted loop playsInline />
          </button>
          {isLoggedIn && (
            <div className={styles.onlineBadge}>
              <span className={styles.onlineDot}></span>
              <span>{onlineUsers} Online</span>
            </div>
          )}
        </div>

        {/* MIDDLE NAV - Icons Removed to Save Space */}
        <ul className={styles.middleSection}>
          <li className={styles.navItem}>
            <button className={getLinkClass("home")} onClick={goHome}>Home</button>
          </li>
          <li className={styles.navItem}>
            <button className={getLinkClass("movies")} onClick={() => { onSearch(""); setPage("movies"); }}>Movies</button>
          </li>
          <li className={styles.navItem}>
            <button className={getLinkClass("tvshows")} onClick={() => { onSearch(""); setPage("tvshows"); }}>TV Shows</button>
          </li>
          
          {isLoggedIn && (
            <>
              <li className={styles.navItem}>
                <button className={getLinkClass("library")} onClick={() => { onSearch(""); setPage("library"); }}>Library</button>
              </li>
              <li className={styles.navItem}>
                <button className={getLinkClass("mynotes")} onClick={() => { onSearch(""); setPage("mynotes"); }}>Notes</button>
              </li>
              <li className={styles.navItem}>
                <button className={getLinkClass("analytics")} onClick={() => { onSearch(""); setPage("analytics"); }}>Analytics</button>
              </li>
              <li className={styles.navItem}>
                <button className={getLinkClass("profile")} onClick={() => { onSearch(""); setPage("profile"); }}>Profile</button>
              </li>
              {/* ✅ ADMIN LINK - Orange color */}
              {isAdmin && (
                <li className={styles.navItem}>
                  <button 
                    className={`${getLinkClass("admin")} ${styles.adminLink}`} 
                    onClick={() => { onSearch(""); setPage("admin"); }}
                  >
                    Admin
                  </button>
                </li>
              )}
            </>
          )}
        </ul>

        {/* RIGHT SIDE */}
        <div className={styles.rightSection}>
          <div className={styles.searchContainer}>
            <i className={`fas fa-search ${styles.searchIcon}`} onClick={handleSearch} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              onKeyDown={handleKeyDown} 
            />
          </div>
          
          {isLoggedIn && <Avatar name={userName} size="medium" />}
          {isLoggedIn && <NotificationBell />}
          
          {isLoggedIn ? (
            <button className={styles.btn} onClick={handleLogout}>Logout</button>
          ) : (
            <button className={styles.btn} onClick={() => setPage("login")}>Login</button>
          )}
        </div>
      </div>
    </header>
  );
}