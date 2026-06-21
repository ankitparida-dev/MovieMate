import { useState, useEffect } from 'react';

const STORAGE_KEY = 'moviemate_reviews';

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      }
    }
    setLoading(false);
  }, []);

  const saveReviews = (newReviews) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
    setReviews(newReviews);
  };

  const getMovieReviews = (mediaId) => {
    return reviews.filter(r => r.mediaId === mediaId);
  };

  const getAverageRating = (mediaId) => {
    const movieReviews = getMovieReviews(mediaId);
    if (movieReviews.length === 0) return 0;
    const sum = movieReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / movieReviews.length).toFixed(1);
  };

  const addReview = (mediaId, mediaType, title, content, rating, spoiler = false) => {
    const newReview = {
      id: Date.now(),
      userId: 'current-user',
      userName: JSON.parse(localStorage.getItem('user') || '{"name":"User"}').name || 'User',
      mediaId,
      mediaType,
      title: title || 'Movie Review',
      content,
      rating,
      spoiler,
      likes: 0,
      helpful: 0,
      createdAt: new Date().toISOString()
    };

    const newReviews = [newReview, ...reviews];
    saveReviews(newReviews);
    return newReview;
  };

  const deleteReview = (reviewId) => {
    const newReviews = reviews.filter(r => r.id !== reviewId);
    saveReviews(newReviews);
  };

  const likeReview = (reviewId) => {
    const updated = reviews.map(r => 
      r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
    );
    saveReviews(updated);
  };

  const markHelpful = (reviewId) => {
    const updated = reviews.map(r => 
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    );
    saveReviews(updated);
  };

  return {
    reviews,
    loading,
    getMovieReviews,
    getAverageRating,
    addReview,
    deleteReview,
    likeReview,
    markHelpful
  };
};