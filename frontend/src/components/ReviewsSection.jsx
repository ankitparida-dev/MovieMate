import React, { useState } from 'react';
import { useReviews } from '../hooks/useReviews';
import styles from './ReviewsSection.module.css';

const ReviewsSection = ({ mediaId, mediaType, title }) => {
  const { reviews, getMovieReviews, getAverageRating, addReview, deleteReview, likeReview, markHelpful } = useReviews();
  const [showForm, setShowForm] = useState(false);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const movieReviews = getMovieReviews(mediaId);
  const avgRating = getAverageRating(mediaId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reviewContent.trim() && rating > 0) {
      addReview(mediaId, mediaType, reviewTitle || 'Movie Review', reviewContent, rating);
      setReviewTitle('');
      setReviewContent('');
      setRating(0);
      setShowForm(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
    ));
  };

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.header}>
        <h3>
          <i className="fas fa-star"></i> 
          Reviews ({movieReviews.length})
          {avgRating > 0 && <span className={styles.avgRating}>⭐ {avgRating}/5</span>}
        </h3>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <input
            type="text"
            placeholder="Review Title (optional)"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            className={styles.input}
          />
          <div className={styles.ratingSelector}>
            <span>Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={star <= (hoverRating || rating) ? styles.starBtnActive : styles.starBtn}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
            <span className={styles.ratingValue}>{rating}/5</span>
          </div>
          <textarea
            placeholder="Write your review..."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            className={styles.textarea}
            rows={4}
          />
          <button type="submit" className={styles.submitBtn}>Post Review</button>
        </form>
      )}

      <div className={styles.reviewsList}>
        {movieReviews.length === 0 ? (
          <div className={styles.emptyState}>No reviews yet. Be the first to review!</div>
        ) : (
          movieReviews.map(review => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{review.userName}</span>
                  <span className={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.reviewActions}>
                  <button onClick={() => likeReview(review.id)} className={styles.likeBtn}>
                    <i className="fas fa-heart"></i> {review.likes || 0}
                  </button>
                  <button onClick={() => markHelpful(review.id)} className={styles.helpfulBtn}>
                    <i className="fas fa-thumbs-up"></i> {review.helpful || 0}
                  </button>
                  <button onClick={() => deleteReview(review.id)} className={styles.deleteBtn}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className={styles.stars}>{renderStars(review.rating)}</div>
              <h4 className={styles.reviewTitle}>{review.title}</h4>
              <p className={styles.reviewContent}>{review.content}</p>
              {review.spoiler && <div className={styles.spoilerBadge}>⚠️ Contains Spoilers</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;