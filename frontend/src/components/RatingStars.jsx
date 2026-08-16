import React, { useState } from 'react';
import styles from './RatingStars.module.css';

const RatingStars = ({ rating, onRatingChange, size = 'medium', readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoverRating(0);
  };

  const displayRating = hoverRating || rating || 0;

  return (
    <div className={`${styles.starsContainer} ${styles[size]}`}>
      {[1, 2, 3, 4, 5,6,7,8,9,10].map((value) => (
        <span
          key={value}
          className={`${styles.star} ${value <= displayRating ? styles.filled : ''} ${readonly ? styles.readonly : ''}`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
      {rating > 0 && !readonly && (
        <span className={styles.ratingValue}>{rating}/10</span>
      )}
    </div>
  );
};

export default RatingStars;