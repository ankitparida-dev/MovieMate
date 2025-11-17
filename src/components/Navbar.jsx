import { useState } from 'react'; // <-- Make sure this is imported
import styles from "./Navbar.module.css";
// import logoVideo from '../assets/Media_files/moviemate.mp4'; // <-- Uncomment if you import your video

// Accept 'onSearch' from Main.jsx
export default function Navbar({ setPage, page, onSearch }) {
  
  // This state holds what the user is typing
  const [query, setQuery] = useState("");

  const getLinkClass = (pageName) => {
    return `${styles.navLink} ${page === pageName ? styles.active : ''}`;
  };

  // This function runs when the user clicks the icon or presses Enter
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query); // Send the query up to Main.jsx
    } else {
      onSearch(""); // Clear the search
    }
  };

  // This function handles the "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
      handleSearch();
    }
  };

  // Helper to go home (clears search, sets page)
  const goHome = () => {
    onSearch(""); // Clear search
    setPage("home");
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
                src="/Media files/moviemate.mp4" // <-- Path from 'public' folder
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
                  onSearch(""); // Clear search
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
                  onSearch(""); // Clear search
                  setPage("tvshows");
                }}
              >
                TV Shows
              </button>
            </li>
          </ul>

          {/* RIGHT SIDE - Search + Login */}
          <div className={styles.rightSection}>
            <div className={styles.searchContainer}>
              <i 
                className={`fas fa-search ${styles.searchIcon}`} 
                onClick={handleSearch} // <-- Add click handler
              />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search for movies, TV shows..."
                value={query} // <-- Control the input
                onChange={(e) => setQuery(e.target.value)} // <-- Update state on typing
                onKeyDown={handleKeyDown} // <-- Add keydown handler
              />
            </div>
            
            {/* --- THIS IS THE FIX --- */}
            {/* Back to a simple button like you had */ }
            <button className={styles.btn} onClick={() => setPage("login")}>
              Login
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}