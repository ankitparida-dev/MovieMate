import { useState, useEffect } from 'react';

export const useStats = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalReviews: 0,
    averageRating: 0,
    favoriteGenre: 'N/A',
    mostActiveDay: 'N/A',
    topActors: [],
    topDirectors: [],
    watchTime: 0,
    completionRate: 0
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const notes = JSON.parse(localStorage.getItem('moviemate_movie_notes') || '[]');
    const reviews = JSON.parse(localStorage.getItem('moviemate_reviews') || '[]');
    const viewed = JSON.parse(localStorage.getItem('moviemate_recently_viewed') || '[]');

    // Total movies with notes
    const totalMovies = notes.length;

    // Total reviews written
    const totalReviews = reviews.length;

    // Average rating from notes
    const ratedNotes = notes.filter(n => n.rating && n.rating > 0);
    const averageRating = ratedNotes.length > 0 
      ? (ratedNotes.reduce((sum, n) => sum + n.rating, 0) / ratedNotes.length).toFixed(1)
      : 0;

    // Favorite genre (from notes)
    const genreCount = {
      'Action': 0, 'Comedy': 0, 'Drama': 0, 'Sci-Fi': 0,
      'Horror': 0, 'Romance': 0, 'Thriller': 0
    };
    notes.forEach(note => {
      const title = (note.title || '').toLowerCase();
      if (title.includes('action') || title.includes('avengers')) genreCount['Action']++;
      else if (title.includes('comedy') || title.includes('funny')) genreCount['Comedy']++;
      else if (title.includes('drama')) genreCount['Drama']++;
      else if (title.includes('sci-fi') || title.includes('interstellar')) genreCount['Sci-Fi']++;
      else if (title.includes('horror')) genreCount['Horror']++;
      else if (title.includes('romance')) genreCount['Romance']++;
      else if (title.includes('thriller')) genreCount['Thriller']++;
    });
    
    let favoriteGenre = 'N/A';
    let maxCount = 0;
    Object.entries(genreCount).forEach(([genre, count]) => {
      if (count > maxCount) { maxCount = count; favoriteGenre = genre; }
    });

    // Most active day
    const dayCount = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
    viewed.forEach(item => {
      if (item.timestamp) {
        const day = new Date(item.timestamp).toLocaleString('default', { weekday: 'long' });
        dayCount[day] = (dayCount[day] || 0) + 1;
      }
    });
    
    let mostActiveDay = 'N/A';
    let maxDay = 0;
    Object.entries(dayCount).forEach(([day, count]) => {
      if (count > maxDay) { maxDay = count; mostActiveDay = day; }
    });

    // Top actors (from notes titles - simplified)
    const actorMap = {};
    notes.forEach(note => {
      const title = (note.title || '').toLowerCase();
      if (title.includes('inception')) { actorMap['Leonardo DiCaprio'] = (actorMap['Leonardo DiCaprio'] || 0) + 1; }
      if (title.includes('interstellar')) { actorMap['Matthew McConaughey'] = (actorMap['Matthew McConaughey'] || 0) + 1; }
      if (title.includes('dark knight')) { actorMap['Christian Bale'] = (actorMap['Christian Bale'] || 0) + 1; }
      if (title.includes('avengers')) { actorMap['Robert Downey Jr'] = (actorMap['Robert Downey Jr'] || 0) + 1; }
    });
    const topActors = Object.entries(actorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    // Completion rate
    const completionRate = totalMovies > 0 ? Math.round((totalReviews / totalMovies) * 100) : 0;

    setStats({
      totalMovies,
      totalReviews,
      averageRating,
      favoriteGenre,
      mostActiveDay,
      topActors,
      topDirectors: ['Christopher Nolan'], // Simplified
      watchTime: totalMovies * 120, // Assuming 2 hours per movie
      completionRate
    });
  };

  return stats;
};