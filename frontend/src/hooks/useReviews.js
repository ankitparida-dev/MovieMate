// import { useState } from 'react';

// const API_URL = import.meta.env.VITE_API_URL;

// export const useReviews = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const getMovieReviews = async (mediaId) => {
//     try {
//       setLoading(true);
    
// console.log("API_URL =", API_URL);

//       const response = await fetch(
//         `${API_URL}/reviews/movie/${mediaId}`
//       );

//       const data = await response.json();

//       setReviews(Array.isArray(data) ? data : []);

//       return data;
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAverageRating = (mediaId) => {
//     const movieReviews = reviews.filter(
//       r => r.mediaId === mediaId
//     );

//     if (movieReviews.length === 0) return 0;

//     const sum = movieReviews.reduce(
//       (acc, r) => acc + r.rating,
//       0
//     );

//     return (sum / movieReviews.length).toFixed(1);
//   };

//   const addReview = async (
//     mediaId,
//     mediaType,
//     title,
//     content,
//     rating,
//     spoiler = false
//   ) => {
//     try {

//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         `${API_URL}/reviews`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             mediaId,
//             mediaType,
//             title,
//             content,
//             rating,
//             spoiler
//           })
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setReviews(prev => [data.review || data, ...prev]);
//       }

//       return data;

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const deleteReview = async (reviewId) => {
//     try {

//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         `${API_URL}/reviews/${reviewId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`
//           },
//           credentials: "include"
//         }
//       );

//       if (response.ok) {
//         setReviews(prev =>
//           prev.filter(
//             r => r._id !== reviewId
//           )
//         );
//       }

//     } catch (error) {
//       console.error(error);
//     }
//   };
// const likeReview = async (reviewId) => {
//   try {

//     const token = localStorage.getItem("token");

//     const response = await fetch(
//       `${API_URL}/reviews/${reviewId}/like`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         credentials: "include"
//       }
//     );

//     const updatedReview = await response.json();

//     setReviews(prev =>
//       prev.map(review =>
//         review._id === reviewId
//           ? updatedReview
//           : review
//       )
//     );

//   } catch (error) {
//     console.error(error);
//   }
// };

//   const markHelpful = async (reviewId) => {
//   try {

//     const token = localStorage.getItem("token");

//     const response = await fetch(
//       `${API_URL}/reviews/${reviewId}/helpful`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         credentials: "include"
//       }
//     );

//     const updatedReview = await response.json();

//     setReviews(prev =>
//       prev.map(review =>
//         review._id === reviewId
//           ? updatedReview
//           : review
//       )
//     );

//   } catch (error) {
//     console.error(error);
//   }
// };

//   return {
//     reviews,
//     loading,
//     getMovieReviews,
//     getAverageRating,
//     addReview,
//     deleteReview,
//     likeReview,
//     markHelpful
//   };
// };
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMovieReviews = async (mediaId) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/reviews/movie/${mediaId}`
      );

      const data = await response.json();

      setReviews(Array.isArray(data) ? data : []);

      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      setReviews([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;

    const sum = reviews.reduce((a, b) => a + b.rating, 0);

    return (sum / reviews.length).toFixed(1);
  };

  const addReview = async (
    mediaId,
    mediaType,
    title,
    content,
    rating,
    spoiler = false
  ) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        mediaId,
        mediaType,
        title,
        content,
        rating,
        spoiler
      })
    });

    const data = await response.json();

    if (response.ok) {
      await getMovieReviews(mediaId);
    }

    return data;
  };

  const deleteReview = async (reviewId, mediaId) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    await getMovieReviews(mediaId);
  };

  const likeReview = async (reviewId, mediaId) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/reviews/${reviewId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    await getMovieReviews(mediaId);
  };

  const markHelpful = async (reviewId, mediaId) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    await getMovieReviews(mediaId);
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