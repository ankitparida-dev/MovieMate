import React, { useState, useEffect } from 'react';
import { useComments } from '../hooks/useComments';
import styles from './CommentSection.module.css';

const CommentSection = ({ movieId, movieTitle }) => {
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const {
    comments,
    loading,
    addComment,
    updateComment,
    deleteComment,
    getCommentCount
  } = useComments(movieId, movieTitle);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ name: 'User' });
      }
    }
  }, []);

  const getUserName = () => {
    if (user?.name) return user.name;
    return 'Guest User';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment, getUserName());
      setNewComment('');
    }
  };

  const handleUpdateComment = (id) => {
    if (!editText.trim()) return;
    updateComment(id, editText);
    setEditingId(null);
    setEditText('');
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#2ec4b6', '#ff9f1c', '#e63946', '#4fd1c5', '#ffb347', '#1cecff'];
    const index = (name?.length || 0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading comments...</p>
      </div>
    );
  }

  // ✅ FIX: Ensure comments is always an array
  const commentsArray = Array.isArray(comments) ? comments : [];

  return (
    <div className={styles.commentSection}>
      <div className={styles.header}>
        <h3>
          <i className="fas fa-comments"></i>
          Comments ({commentsArray.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className={styles.commentForm}>
        <div className={styles.avatar}>
          {user?.avatar ? (
            <img src={user.avatar} alt={getUserName()} />
          ) : (
            <div 
              className={styles.avatarPlaceholder}
              style={{ backgroundColor: getAvatarColor(getUserName()) }}
            >
              {getInitials(getUserName())}
            </div>
          )}
        </div>
        <div className={styles.formContent}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className={styles.commentInput}
            rows={3}
          />
          <button type="submit" className={styles.submitBtn} disabled={!newComment.trim()}>
            <i className="fas fa-paper-plane"></i> Post Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className={styles.commentsList}>
        {commentsArray.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-comment-dots"></i>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          commentsArray.map(comment => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentAvatar}>
                {comment.userAvatar ? (
                  <img src={comment.userAvatar} alt={comment.username} />
                ) : (
                  <div 
                    className={styles.avatarPlaceholder}
                    style={{ backgroundColor: getAvatarColor(comment.username || comment.userName) }}
                  >
                    {getInitials(comment.username || comment.userName)}
                  </div>
                )}
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                  <span className={styles.username}>{comment.username || comment.userName}</span>
                  <span className={styles.commentTime}>{formatDate(comment.createdAt)}</span>
                </div>
                
                {editingId === comment.id ? (
                  <div className={styles.editSection}>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={styles.commentInput}
                      rows={3}
                    />
                    <div className={styles.editActions}>
                      <button className={styles.saveEditBtn} onClick={() => handleUpdateComment(comment.id)}>
                        Save
                      </button>
                      <button 
                        className={styles.cancelEditBtn} 
                        onClick={() => {
                          setEditingId(null);
                          setEditText('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={styles.commentText}>{comment.content || comment.text}</p>
                )}
                
                <div className={styles.commentActions}>
                  {comment.username === getUserName() && (
                    <>
                      <button 
                        className={styles.editBtn}
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditText(comment.content || comment.text);
                        }}
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteComment(comment.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;