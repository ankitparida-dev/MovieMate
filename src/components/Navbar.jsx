import { useState, useEffect } from 'react'; // <-- 1. Import useEffect
import styles from "./Navbar.module.css";
import logoVideo from "../assets/movielight.mp4";
export default function Navbar({ setPage, page, onSearch }) {
  
  const [query, setQuery] = useState("");
  // 2. Add state to check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 3. Check login status when component loads or page changes
  useEffect(() => {
    // Check if user object exists in local storage
    const user = localStorage.getItem("user"); 
    setIsLoggedIn(!!user); // Set to true if user exists, false if null
  }, [page]); // This re-checks every time you change pages

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

  // 4. Create a Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user from storage
    setIsLoggedIn(false); // Update state
    goHome(); // Send user back home
  };

  return (
    <header className={styles.mainHeader}>
      <div className="container">
        <nav className={styles.navbar}>

          {/* LEFT SECTION - Logo */}
          <div className={styles.leftSection}>
            <button
              className={styles.logo}
              onClick={goHome}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <video
                src={logoVideo} 
                autoPlay muted loop playsInline
                width="250" height="80"
              ></video>
            </button>
          </div>

          {/* MIDDLE NAV */}
          <ul className={styles.middleSection}>
            <li className={styles.navItem}>
              <button
                className={getLinkClass("home")}
                onClick={goHome}
              >
                Home
              </button>
            </li>
            <li className={styles.navItem}>
              <button
                className={getLinkClass("movies")}
                onClick={() => {
                  onSearch(""); 
                  setPage("movies");
                }}
              >
                Movies
              </button>
            </li>
            <li className={styles.navItem}>
              <button
                className={getLinkClass("tvshows")}
                onClick={() => {
                  onSearch(""); 
                  setPage("tvshows");
                }}
              >
                TV Shows
              </button>
            </li>
            
            {/* 5. ADDED "MY LIBRARY" LINK (Only shows if logged in) */}
            {isLoggedIn && (
              <li className={styles.navItem}>
                <button
                  className={getLinkClass("library")}
                  onClick={() => {
                    onSearch(""); // Clear search
                    setPage("library");
                  }}
                >
                  My Library
                </button>
              </li>
            )}
            
          </ul>

          {/* RIGHT SIDE - Search + Login/Logout */}
          <div className={styles.rightSection}>
            <div className={styles.searchContainer}>
              <i 
                className={`fas fa-search ${styles.searchIcon}`} 
                onClick={handleSearch} 
              />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search for movies, TV shows..."
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={handleKeyDown} 
              />
            </div>
            
            {/* 6. FIXED: Show "Logout" or "Login" based on state */}
            {isLoggedIn ? (
              <button className={styles.btn} onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className={styles.btn} onClick={() => setPage("login")}>
                Login
              </button>
            )}

          </div>
        </nav>
      </div>
    </header>
  );
}