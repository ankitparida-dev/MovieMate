import React, { useState } from 'react';
import styles from './FeedbackModal.module.css';

// This is the array for the stars
const stars = [1, 2, 3, 4, 5];

export default function FeedbackModal({ isOpen, onClose }) {
  // --- State for all the form inputs ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  
  // --- State for the submission process ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // This is the React way to hide the component
  if (!isOpen) {
    return null;
  }

  // --- Form Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the page from reloading
    if (rating === 0 || !feedbackType) {
      setError("Please select a feedback type and rating.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    
    // Fake a 2-second API call, just like your old JS
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you for your feedback!");
      
      // Reset the form and close
      setName("");
      setEmail("");
      setFeedbackType("");
      setRating(0);
      setMessage("");
      onClose(); // Call the function from Main.jsx to close
    }, 2000);
  };

  return (
    <div className={styles.feedbackModal} onClick={onClose}>
      <div 
        className={styles.feedbackContainer} 
        // This stops a click *inside* the modal from closing it
        onClick={(e) => e.stopPropagation()} 
      >
        <button className={styles.closeModal} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className={styles.feedbackHeader}>
          <h2 className={styles.feedbackTitle}>Share Your Feedback</h2>
          <p className={styles.feedbackSubtitle}>Help us improve MovieMate by sharing your thoughts</p>
        </div>
        
        <form className={styles.feedbackForm} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Full Name</label>
              <input 
                type="text" id="name" className={styles.formInput} 
                placeholder="Enter your full name" required 
                value={name} onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <input 
                type="email" id="email" className={styles.formInput} 
                placeholder="Enter your email" required 
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="feedbackType" className={styles.formLabel}>Feedback Type</label>
            <select 
              id="feedbackType" className={styles.formSelect} required
              value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}
            >
              <option value="" disabled>Select feedback type</option>
              <option value="suggestion">Suggestion</option>
              <option value="bug">Bug Report</option>
              <option value="compliment">Compliment</option>
              <option value="general">General Feedback</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Rating</label>
            <div className={styles.ratingGroup}>
              <div className={styles.ratingStars}>
                {stars.map((star) => (
                  <span 
                    key={star}
                    className={`${styles.star} ${star <= (hoverRating || rating) ? styles.active : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span id="ratingValue">{rating}/5</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.formLabel}>Your Feedback</label>
            <textarea 
              id="message" className={styles.formTextarea} 
              placeholder="Tell us what you think about MovieMate..." required
              value={message} onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          
          <div className={styles.formCheckbox}>
            <input 
              type="checkbox" id="subscribe" 
              checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)}
            />
            <label htmlFor="subscribe">Send me updates about new features and improvements</label>
          </div>
          
          {error && <p className={styles.formError}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
            {isSubmitting ? ' Submitting...' : ' Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}