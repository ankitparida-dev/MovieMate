// frontend/src/pages/Main.jsx

import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen'; 
import HeroBanner from '../components/HeroBanner'; 
import SpotlightCarousel from '../components/SpotlightCarousel'; 
import MovieRow from '../components/MovieRow';
import RecentlyViewed from '../components/RecentlyViewed';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

// Home Page Content Component
const HomePageContent = ({ onOpen, searchQuery, recentItems, onRemove, onClearAll, setPage }) => {
  console.log('🏠 HomePage - recentItems:', recentItems.length);
  
  // ✅ Handle Explore Movies
  const handleExploreMovies = () => {
    if (setPage) {
      setPage('movies');
    }
  };

  // ✅ Handle Learn More
  const handleLearnMore = () => {
    // You can customize this - show toast or navigate
    toast.info('🎬 MovieMate helps you discover, rate, and review your favorite movies!');
  };
  
  return (
    <>
      {/* ✅ HeroBanner with setPage and handlers */}
      <HeroBanner 
        onExploreClick={handleExploreMovies}
        setPage={setPage}
      />
      
      <SpotlightCarousel onOpen={onOpen} setPage={setPage} /> 
      
      {/* Recently Viewed - Shows first when not searching */}
      {!searchQuery && recentItems.length > 0 && (
        <RecentlyViewed 
          items={recentItems}
          onItemClick={onOpen}
          onRemove={onRemove}
          onClearAll={onClearAll}
          title="Continue Watching"
        />
      )}
      
      {searchQuery ? (
        <MovieRow 
          key={searchQuery} 
          title={`Results for "${searchQuery}"`}
          path="/search/multi"
          params={{ query: searchQuery }}
          onOpen={onOpen} 
        />
      ) : (
        <>
          <MovieRow title="🔥 Trending Now" path="/trending/movie/week" onOpen={onOpen} />
          <MovieRow title="⭐ Top Rated Movies" path="/movie/top_rated" onOpen={onOpen} />
          <MovieRow title="📺 Popular TV Shows" path="/tv/popular" onOpen={onOpen} />
          <MovieRow title="🚀 Coming Soon" path="/movie/upcoming" onOpen={onOpen} />
        </>
      )}
    </>
  );
};

// Main Component
export default function Main({ onOpen, searchQuery, setPage }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const { recentItems, removeFromRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  console.log('🔍 Main - recentItems:', recentItems.length);

  useEffect(() => {
    const totalDuration = 3000;
    const intervalTime = 30;
    const increment = (intervalTime / totalDuration) * 100;
    
    let progressInterval;
    const updateProgress = () => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + increment;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return newProgress;
      });
    };
    
    progressInterval = setInterval(updateProgress, intervalTime);
    
    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  const handleItemClick = (item) => {
    const type = item.media_type || 'movie';
    onOpen({ ...item, type, media_type: type });
  };

  return (
    <main>
      {isLoading ? (
        <LoadingScreen progress={Math.round(progress)} />
      ) : (
        <HomePageContent 
          onOpen={handleItemClick}
          searchQuery={searchQuery}
          recentItems={recentItems}
          onRemove={removeFromRecentlyViewed}
          onClearAll={clearRecentlyViewed}
          setPage={setPage}  // ✅ Pass setPage to HomePageContent
        />
      )}
    </main>
  );
}