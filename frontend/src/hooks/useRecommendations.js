import { useState, useEffect } from 'react';

// Mock Data simulating a Hybrid Recommendation Engine response
const MOCK_RECOMMENDATIONS = [
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    vote_average: 8.4,
    release_date: "2014-11-05",
    reason: "Because you loved 'Inception' and Sci-Fi movies.",
    matchScore: 98
  },
  {
    id: 27205,
    title: "Inception",
    poster_path: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    vote_average: 8.3,
    release_date: "2010-07-15",
    reason: "Highly rated by users with similar tastes in Mind-Bending Thrillers.",
    matchScore: 95
  },
  {
    id: 603,
    title: "The Matrix",
    poster_path: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    vote_average: 8.2,
    release_date: "1999-03-30",
    reason: "Matches your recent watch history (Sci-Fi, Action).",
    matchScore: 92
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 8.5,
    release_date: "2008-07-16",
    reason: "Because you added 'Batman Begins' to your watchlist.",
    matchScore: 89
  }
];

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to your Node.js / Python recommendation engine
    const fetchRecommendations = async () => {
      setIsLoading(true);
      
      // In the future, replace this with:
      // const res = await axios.get('/api/recommendations/me', { headers: { Authorization: `Bearer ${token}` } });
      // setRecommendations(res.data.recommendations);
      
      setTimeout(() => {
        setRecommendations(MOCK_RECOMMENDATIONS);
        setIsLoading(false);
      }, 1500); // Simulate 1.5s network delay
    };

    fetchRecommendations();
  }, []);

  return { recommendations, isLoading };
};