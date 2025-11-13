import { useState, useEffect } from 'react';
import './LandingPage.css'; // <-- Import the page-specific CSS
import API_TOKEN from './apiToken.js'; // (We'll need this)

// --- Data for the Carousel (from your landing.js) ---
const carouselData = [
  {
    id: 157336, type: 'movie', name: "INTERSTELLAR",
    overview: "When Earth becomes uninhabitable...",
    background: "linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url('Media_files/InterSteller.jpg')"
  },
  {
    id: 27205, type: 'movie', name: "INCEPTION",
    overview: "A thief who steals corporate secrets...",
    background: "linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url('https://images.unsplash.com/photo-1489599809505-f2fbe02d41e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto-format&fit=crop&w=2070&q=80')"
  },
  {
    id: 155, type: 'movie', name: "THE DARK KNIGHT",
    overview: "When the menace known as the Joker...",
    background: "linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url('https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80')"
  }
];

// --- Data for the Typing Animation ---
const typingTexts = ["Cinematic Experience", "Movie Discovery", "TV Show Paradise"];

// --- Card Components (from your landing.js) ---
function TrendingCard({ item, onShowDetails }) {
  const isMovie = item.media_type === 'movie' || (item.title && !item.name);
  const mediaType = item.media_type ? item.media_type : (isMovie ? 'movie' : 'tv');
  if (mediaType === 'person') return null; // Skip people

  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder-poster.png';

  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onShowDetails(item.id, mediaType); }} className="content-card interactive-feature">
      <img src={poster} alt={title} className="card-image" loading="lazy" />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-meta">
          <span>{releaseDate ? releaseDate.split('-')[0] : 'TBA'}</span>
          <div className="card-rating">
            <i className="fas fa-star"></i>
            <span>{item.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// --- Main Page Component ---
export default function LandingPage({ onShowMovies, onShowDetails }) {

  // --- State for all the logic ---
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  // --- useEffect to fetch data on load ---
  useEffect(() => {
    // 1. Fake Loading Screen
    const timer = setTimeout(() => setIsLoading(false), 3000);

    // 2. Fetch API Data
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_TOKEN}` // Make sure apiToken.js is in /src
      }
    };
    
    // Fetch Trending
    fetch('https://api.themoviedb.org/3/trending/all/week', options)
      .then(res => res.json())
      .then(data => setTrending(data.results.slice(0, 4))) // Get top 4
      .catch(err => console.error('Error fetching trending:', err));
      
    // Fetch Upcoming
    fetch('https://api.themoviedb.org/3/movie/upcoming', options)
      .then(res => res.json())
      .then(data => setUpcoming(data.results.slice(0, 4))) // Get top 4
      .catch(err => console.error('Error fetching upcoming:', err));

    return () => clearTimeout(timer); // Cleanup
  }, []); // [] = Run once on load

  // --- useEffect for Typing Animation ---
  useEffect(() => {
    if (isLoading) return; // Don't start until loading is done
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout;

    function type() {
      const currentText = typingTexts[textIndex];
      let newText, typingSpeed = 100;

      if (isDeleting) {
        newText = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        newText = currentText.substring(0, charIndex + 1);
        charIndex++;
      }
      setTypedText(newText);

      if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000; isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false; textIndex = (textIndex + 1) % typingTexts.length; typingSpeed = 500;
      }
      typeTimeout = setTimeout(type, typingSpeed);
    }
    
    typeTimeout = setTimeout(type, 1000); // Start after 1s
    return () => clearTimeout(typeTimeout);
  }, [isLoading]); // [isLoading] = Run once loading is finished

  // --- Carousel Handlers ---
  const handleCarouselNext = () => setCarouselIndex(prev => (prev + 1) % carouselData.length);
  const handleCarouselPrev = () => setCarouselIndex(prev => (prev - 1 + carouselData.length) % carouselData.length);

  // --- RENDER ---
  // 1. Show Loading Screen
  if (isLoading) {
    return (
      <div className="loading-screen" id="loadingScreen">
        {/* ... (Paste your full loading-screen HTML here, converted to JSX) ... */}
      </div>
    );
  }

  // 2. Show Main Content
  const currentSlide = carouselData[carouselIndex];
  return (
    <div className="main-content" id="mainContent" style={{ display: 'block', opacity: 1 }}>
      
      {/* ===== Hero Section ===== */}
      <section className="hero-section">
        {/* ... (Paste your full hero-section HTML here, converted to JSX) ... */}
        {/* Make sure to replace the hard-coded typing span with: */}
        <div className="typing-container">
          <span className="type-text" id="type-text">{typedText}</span>
          <span className="cursor">|</span>
        </div>
        {/* And wire up the button: */}
        <button className="hero-btn play-btn" onClick={onShowMovies}>
          <i className="fas fa-play"></i> Explore Movies
        </button>
      </section>
      
      {/* ===== Movie Carousel Section ===== */}
      <section className="movie-section">
        <div className="carousel-image" style={{ backgroundImage: currentSlide.background }}>
          <div className="overlay"></div>
          <div className="movie-items">
            <span className="spotlight">#1 Spotlight</span>
            <h1 className="show-name">{currentSlide.name}</h1>
            <p className="overview">{currentSlide.overview}</p>
            <div className="interstellar-buttons">
              <button className="trailer"><i className="fas fa-play"></i> Watch Trailer</button>
              <button className="detail-button" onClick={() => onShowDetails(currentSlide.id, currentSlide.type)}>
                <i className="fas fa-info-circle"></i> View Details
              </button>
            </div>
          </div>
          <div className="next-prev">
            <button className="prev" onClick={handleCarouselPrev}>&#10094;</button>
            <button className="next" onClick={handleCarouselNext}>&#10095;</button>
          </div>
        </div>
      </section>

      {/* ===== Content Section (Trending) ===== */}
      <section className="content-section">
        <div className="container">
          <div className="content-header">
            <h2 className="content-title">Trending Movies and Shows</h2>
            <a href="#" onClick={onShowMovies} className="content-link">
              View All <i className="fas fa-chevron-right"></i>
            </a>
          </div>
          <div className="content-grid">
            {/* We .map() over the state to render the cards */}
            {trending.map(item => (
              <TrendingCard key={item.id} item={item} onShowDetails={onShowDetails} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Upcoming Section ===== */}
      <section className="upcoming-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Coming Soon</h2>
            <p className="section-subtitle">Get ready for these...</p>
          </div>
          <div className="upcoming-grid">
            {/* We .map() over the state to render the cards */}
            {/* (You'll need to make an <UpcomingCard> component just like <TrendingCard>) */}
          </div>
        </div>
      </section>
      
      {/* ===== Feedback Modal ===== */}
      <div className="feedback-icon" onClick={() => setIsModalOpen(true)}>
        <i className="fas fa-comment-alt"></i>
      </div>
      {isModalOpen && (
        <div className="feedback-modal active" onClick={() => setIsModalOpen(false)}>
          <div className="feedback-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
            {/* ... (Paste your feedback-form HTML here) ... */}
          </div>
        </div>
      )}
    </div>
  );
}