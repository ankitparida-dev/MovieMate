import { useState } from 'react';

// Mock data simulating a vector database return
const MOCK_MOVIES = [
  { id: 1, title: "Interstellar", overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", year: 2014, rating: 8.7, poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { id: 2, title: "Arrival", overview: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.", year: 2016, rating: 7.6, poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg" },
  { id: 3, title: "Eternal Sunshine of the Spotless Mind", overview: "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.", year: 2004, rating: 8.3, poster: "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg" },
  { id: 4, title: "Inception", overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", year: 2010, rating: 8.4, poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg" }
];

export const useSemanticSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate AI Embedding Generation and Vector Database Query
    setTimeout(() => {
      // In reality, the backend filters this based on vector distance
      const filtered = MOCK_MOVIES.filter(m => 
        m.overview.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery.toLowerCase().includes("time travel") || // Mock semantic match
        searchQuery.toLowerCase().includes("emotional") // Mock semantic match
      );
      
      setResults(filtered);
      setIsSearching(false);
    }, 1500); // 1.5 second simulated delay
  };

  return { query, results, isSearching, handleSearch };
};