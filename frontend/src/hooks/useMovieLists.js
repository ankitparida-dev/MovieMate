import { useState, useEffect } from 'react';

const STORAGE_KEY = 'moviemate_lists';

export const useMovieLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLists(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading lists:', error);
        setLists([]);
      }
    }
    setLoading(false);
  }, []);

  const saveLists = (newLists) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLists));
    setLists(newLists);
  };

  const createList = (title, description, isPublic = true) => {
    const newList = {
      id: Date.now(),
      userId: 'current-user',
      userName: JSON.parse(localStorage.getItem('user') || '{"name":"User"}').name || 'User',
      title,
      description,
      movies: [],
      isPublic,
      likes: 0,
      views: 0,
      tags: [],
      createdAt: new Date().toISOString()
    };
    const newLists = [newList, ...lists];
    saveLists(newLists);
    return newList;
  };

  const addToList = (listId, movie) => {
    const updated = lists.map(list => {
      if (list.id === listId) {
        const exists = list.movies.some(m => m.mediaId === movie.id);
        if (!exists) {
          return {
            ...list,
            movies: [...list.movies, {
              mediaId: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              mediaType: movie.media_type || 'movie',
              addedAt: new Date().toISOString()
            }]
          };
        }
      }
      return list;
    });
    saveLists(updated);
  };

  const removeFromList = (listId, mediaId) => {
    const updated = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          movies: list.movies.filter(m => m.mediaId !== mediaId)
        };
      }
      return list;
    });
    saveLists(updated);
  };

  const deleteList = (listId) => {
    const newLists = lists.filter(l => l.id !== listId);
    saveLists(newLists);
  };

  const likeList = (listId) => {
    const updated = lists.map(list => 
      list.id === listId ? { ...list, likes: list.likes + 1 } : list
    );
    saveLists(updated);
  };

  const getPublicLists = () => {
    return lists.filter(l => l.isPublic);
  };

  const getUserLists = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return lists.filter(l => l.userId === user.id || l.userName === user.name);
  };

  return {
    lists,
    loading,
    createList,
    addToList,
    removeFromList,
    deleteList,
    likeList,
    getPublicLists,
    getUserLists
  };
};