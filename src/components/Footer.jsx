import styles from "./Footer.module.css";
// 1. Import the TMDB logo (you'll need to download it)
import tmdbLogo from "../assets/tmdb-logo.svg"; 

export default function Footer({ setPage }) {
  return (
    <footer className={styles.mainFooter}>
      <div className="container">
        <div className={styles.footerContent}>
          
          {/* SECTION 1 (No changes) */}
          <div className={styles.footerSection}>
            <h3>MovieMate</h3>
            <p className={styles.footerDescription}>
              Your ultimate destination for discovering and exploring movies and TV shows from around the world.
            </p>
            <div className={styles.socialLinks}>
              {/* Note: These require Font Awesome to be linked in your main index.html */}
              <a href="#" className={styles.socialLink}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className={styles.socialLink}><i className="fab fa-twitter"></i></a>
              <a href="#" className={styles.socialLink}><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          {/* SECTION 2 (No changes, this was correct) */}
          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li>
                <button onClick={() => setPage("home")}>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setPage("movies")}>
                  Movies
                </button>
              </li>
              <li>
                <button onClick={() => setPage("tvshows")}>
                  TV Shows
                </button>
              </li>
            </ul>
          </div>

          {/* SECTION 3 (CHANGED TO BUTTONS) */}
          <div className={styles.footerSection}>
            <h3>Genres</h3>
            <ul className={styles.footerLinks}>
              {/* These are now buttons to match your app's logic */}
              <li><button onClick={() => setPage("genre-action")}>Action</button></li>
              <li><button onClick={() => setPage("genre-comedy")}>Comedy</button></li>
              <li><button onClick={() => setPage("genre-drama")}>Drama</button></li>
              <li><button onClick={() => setPage("genre-sci-fi")}>Sci-Fi</button></li>
              <li><button onClick={() => setPage("genre-horror")}>Horror</button></li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM BAR (UPDATED) --- */}
        <div className={styles.footerBottom}>
          <p>&copy; 2025 MovieMate. All rights reserved.</p>
          
          {/* 2. Added TMDB attribution */}
          <div className={styles.tmdbCredit}>
            <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            <img src={tmdbLogo} alt="The Movie Database" className={styles.tmdbLogo} />
          </div>
        </div>

      </div>
    </footer>
  );
}