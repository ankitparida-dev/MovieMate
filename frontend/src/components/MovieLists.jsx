import React, { useState } from 'react';
import { useMovieLists } from '../hooks/useMovieLists';
import styles from './MovieLists.module.css';

const MovieLists = () => {
  const { lists, createList, deleteList, likeList, getPublicLists, getUserLists } = useMovieLists();
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
          <div className={styles.emptyState}>No public lists yet.</div>
        ) : (
          allLists.map(list => (
            <div key={list.id} className={styles.listCard}>
              <div className={styles.listHeader}>
                <h3>{list.title}</h3>
                <span className={styles.likeBtn} onClick={() => likeList(list.id)}>
                  ❤️ {list.likes || 0}
                </span>
              </div>
              {list.description && <p className={styles.listDesc}>{list.description}</p>}
              <div className={styles.listStats}>
                <span>📌 {list.movies.length} movies</span>
                <span>👁️ {list.views || 0} views</span>
              </div>
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