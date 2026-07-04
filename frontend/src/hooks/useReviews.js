import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMovieReviews = async (mediaId) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/reviews/movie/${mediaId}`
      );

      const data = await response.json();

      setReviews(data);

      return data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = (mediaId) => {
    const movieReviews = reviews.filter(
      r => r.mediaId === mediaId
    );

    if (movieReviews.length === 0) return 0;

    const sum = movieReviews.reduce(
      (acc, r) => acc + r.rating,
      0
    );

    return (sum / movieReviews.length).toFixed(1);
  };

  const addReview = async (
    mediaId,
    mediaType,
    title,
    content,
    rating,
    spoiler = false
  ) => {
    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          credentials: "include",
          body: JSON.stringify({
            mediaId,
            mediaType,
            title,
            content,
            rating,
            spoiler
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setReviews(prev => [data.review || data, ...prev]);
      }

      return data;

    } catch (error) {
      console.error(error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include"
        }
      );

      if (response.ok) {
        setReviews(prev =>
          prev.filter(
            r => r._id !== reviewId
          )
        );
      }

    } catch (error) {
      console.error(error);
    }
  };

  const likeReview = async (reviewId) => {
    try {

      const response = await fetch(
        `${API_URL}/api/reviews/${reviewId}/like`,
        {
          method: "POST"
        }
      );

      const updatedReview =
        await response.json();

      setReviews(prev =>
        prev.map(review =>
          review._id === reviewId
            ? updatedReview
            : review
        )
      );

    } catch (error) {
      console.error(error);
    }
  };

  const markHelpful = async (reviewId) => {
    try {

      const response = await fetch(
        `${API_URL}/api/reviews/${reviewId}/helpful`,
        {
          method: "POST"
        }
      );

      const updatedReview =
        await response.json();

      setReviews(prev =>
        prev.map(review =>
          review._id === reviewId
            ? updatedReview
            : review
        )
      );

    } catch (error) {
      console.error(error);
    }
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