import React, { useState } from 'react';
import { useMovieLists } from '../hooks/useMovieLists';
import styles from './MovieLists.module.css';

const MovieLists = ({ movie }) => {
  const { lists, createList, deleteList, likeList, getPublicLists, getUserLists, addToList } = useMovieLists();
  const [showForm, setShowForm] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listTitle.trim()) {
      createList(listTitle, listDescription, isPublic);
      setListTitle('');
      setListDescription('');
      setShowForm(false);
    }
  };

  const allLists = getPublicLists();
  const myLists = getUserLists();

  return (
    <div className={styles.listsContainer}>
      <div className={styles.header}>
        <h2><i className="fas fa-list"></i> Movie Lists</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create List'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.createForm}>
          <input
            type="text"
            placeholder="List Title"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            className={styles.input}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={listDescription}
            onChange={(e) => setListDescription(e.target.value)}
            className={styles.textarea}
            rows={2}
          />
          <label className={styles.checkbox}>
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Make this list public
          </label>
          <button type="submit" className={styles.submitBtn}>Create List</button>
        </form>
      )}

      <div className={styles.listsGrid}>
        {allLists.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-list"></i>
            <p>No public lists yet.</p>
            <small>Create your first list!</small>
          </div>
        ) : (
          allLists.map(list => (
            <div key={list._id} className={styles.listCard}>
              <div className={styles.listHeader}>
                <h3>{list.title}</h3>
                <div className={styles.listHeaderRight}>
                  <button
                    className={styles.likeBtn}
                    onClick={() => likeList(list._id)}
                  >
                    ❤️ {list.likes || 0}
                  </button>
                  <button
                    className={styles.deleteListBtn}
                    onClick={() => deleteList(list._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {list.description && <p className={styles.listDesc}>{list.description}</p>}

              <div className={styles.listStats}>
                <span>📌 {list.movies?.length || 0} movies</span>
                <span>👁️ {list.views || 0} views</span>
              </div>

              {movie && (
                <button
                  className={styles.addMovieBtn}
                  onClick={() => addToList(list._id, movie)}
                >
                  ➕ Add This Movie
                </button>
              )}

              {list.movies && list.movies.length > 0 && (
                <div className={styles.moviePreview}>
                  {list.movies.slice(0, 3).map((m, idx) => (
                    <div key={idx} className={styles.movieItem}>
                      <i className="fas fa-film"></i>
                      <span>{m.title}</span>
                    </div>
                  ))}
                  {list.movies.length > 3 && (
                    <div className={styles.movieItem} style={{ color: '#8892b0', fontStyle: 'italic' }}>
                      +{list.movies.length - 3} more
                    </div>
                  )}
                </div>
              )}

              <div className={styles.listMeta}>
                <span className={styles.author}>by {list.userName || 'Anonymous'}</span>
                <span className={styles.date}>
                  {new Date(list.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieLists;