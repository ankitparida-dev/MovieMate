import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen'; 
import HeroBanner from '../components/HeroBanner'; 
import SpotlightCarousel from '../components/SpotlightCarousel'; 
import MovieRow from '../components/MovieRow';

// This component just *receives* searchQuery
const HomePageContent = ({ onOpen, searchQuery }) => {
  return (
    <>
      <HeroBanner />
      <SpotlightCarousel onOpen={onOpen} /> 
      
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
          <MovieRow title=" Trending Now" path="/trending/movie/week" onOpen={onOpen} />
          <MovieRow title=" Top Rated Movies" path="/movie/top_rated" onOpen={onOpen} />
          <MovieRow title=" Popular TV Shows" path="/tv/popular" onOpen={onOpen} />
          <MovieRow title=" Coming Soon" path="/movie/upcoming" onOpen={onOpen} />
        </>
      )}
    </>
  );
};

// This component just *receives* searchQuery
export default function Main({ onOpen, searchQuery }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // ... loading logic ...
    const totalDuration = 3000;
    const intervalTime = 30;
    const increment = (intervalTime / totalDuration) * 100;
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
    const progressInterval = setInterval(updateProgress, intervalTime);
    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <main>
      {isLoading ? (
        <LoadingScreen progress={Math.round(progress)} />
      ) : (
        <HomePageContent onOpen={onOpen} searchQuery={searchQuery} />
      )}
    </main>
  );
}