import { useState } from 'react';
import AppLayout from './AppLayout';   // <-- Import the new layout
import LandingPage from './LandingPage'; // <-- Import the new home page
import LoginPage from './LoginPage';
import RegPage from './RegPage';
// We will create these next
// import MoviesPage from './MoviesPage';
// import TvShowsPage from './TvShowsPage';
// import AboutPage from './AboutPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);

  // --- Remote Control Functions ---
  const showHome = () => { setCurrentPage('home'); setSelectedItem(null); };
  const showLogin = () => { setCurrentPage('login'); setSelectedItem(null); };
  const showRegister = () => { setCurrentPage('register'); setSelectedItem(null); };
  const showMovies = () => { setCurrentPage('movies'); setSelectedItem(null); };
  const showTvShows = () => { setCurrentPage('tvShows'); setSelectedItem(null); };
  const handleShowDetails = (id, type) => {
    setSelectedItem({ id, type });
    setCurrentPage('about');
  };

  // --- Render Logic ---
  
  // 1. Check for standalone "Auth" pages
  if (currentPage === 'login') {
    return <LoginPage onShowRegister={showRegister} />;
  } 
  if (currentPage === 'register') {
    return <RegPage onShowLogin={showLogin} />;
  }

  // 2. For ALL other pages, wrap them in the AppLayout
  return (
    <AppLayout
      currentPage={currentPage} // Pass this to set the "active" link
      onShowHome={showHome}
      onShowLogin={showLogin}
      onShowMovies={showMovies}
      onShowTvShows={showTvShows}
    >
      {/* This shows the correct page *inside* the layout */}
      {currentPage === 'home' && <LandingPage onShowMovies={showMovies} onShowDetails={handleShowDetails} />}
      {/* {currentPage === 'movies' && <MoviesPage onShowDetails={handleShowDetails} />} */}
      {/* {currentPage === 'tvShows' && <TvShowsPage onShowDetails={handleShowDetails} />} */}
      {/* {currentPage === 'about' && <AboutPage item={selectedItem} onShowDetails={handleShowDetails} />} */}
    
    </AppLayout>
  );
}

export default App;