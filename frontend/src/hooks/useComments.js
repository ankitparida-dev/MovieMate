import { useState, useEffect } from 'react';

const STORAGE_KEY = 'moviemate_comments';

export const useComments = (movieId, movieTitle) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    loadComments();
  }, [movieId]);

  const loadComments = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allComments = JSON.parse(stored);
        const movieComments = allComments.filter(c => c.movieId === movieId) || [];
        setComments(movieComments.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    }
    setLoading(false);
  };

  const saveComments = (allComments) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
  };

  const addComment = (text, userName, userAvatar = null) => {
    if (!text.trim()) return null;
    
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const newComment = {
      id: Date.now(),
      movieId,
      movieTitle,
      content: text.trim(),
      username: userName || 'Anonymous',
      userAvatar,
      createdAt: Date.now(),
      likes: 0,
      replies: []
    };
    
    allComments.push(newComment);
    saveComments(allComments);
    loadComments();
    return newComment;
  };

  // ✅ ADD THIS: Update comment function
  const updateComment = (commentId, newText) => {
    if (!newText.trim()) return;
    
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const commentIndex = allComments.findIndex(c => c.id === commentId);
    
    if (commentIndex !== -1) {
      allComments[commentIndex].content = newText.trim();
      allComments[commentIndex].updatedAt = Date.now();
      saveComments(allComments);
      loadComments();
    }
  };

  const deleteComment = (commentId) => {
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = allComments.filter(c => c.id !== commentId);
    saveComments(filtered);
    loadComments();
  };

  const getCommentCount = () => {
    return comments.length;
  };

  return {
    comments,
    loading,
    addComment,
    updateComment,  // ✅ EXPORT THIS
    deleteComment,
    getCommentCount
  };
};