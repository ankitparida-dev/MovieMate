import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import styles from './AnalyticsDashboard.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const AnalyticsDashboard = ({ analytics, onOpen }) => {
  // Donut Chart - Genre Distribution
  const genreData = {
    labels: Object.keys(analytics.watchTimeByGenre),
    datasets: [
      {
        data: Object.values(analytics.watchTimeByGenre),
        backgroundColor: ['#2ec4b6', '#ff9f1c', '#e63946', '#4fd1c5', '#ffb347', '#1cecff', '#8892b0'],
        borderWidth: 0,
      },
    ],
  };

  // Bar Chart - Rating Distribution
  const ratingData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      {
        label: 'Number of Movies',
        data: Object.values(analytics.ratingsDistribution),
        backgroundColor: '#2ec4b6',
        borderRadius: 8,
      },
    ],
  };

  // Line Chart - Monthly Activity
  const monthlyData = {
    labels: Object.keys(analytics.monthlyActivity),
    datasets: [
      {
        label: 'Movies Added',
        data: Object.values(analytics.monthlyActivity),
        borderColor: '#2ec4b6',
        backgroundColor: 'rgba(46, 196, 182, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2ec4b6',
        pointBorderColor: '#0a192f',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e6e6e6', font: { size: 12 } } },
      tooltip: { backgroundColor: '#112240', titleColor: '#fff', bodyColor: '#8892b0' }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#e6e6e6' } },
      x: { grid: { display: false }, ticks: { color: '#e6e6e6' } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#e6e6e6', font: { size: 11 } } },
      tooltip: { backgroundColor: '#112240' }
    }
  };

  const hasData = analytics.totalMovies > 0;

  if (!hasData) {
    return (
      <div className={styles.emptyState}>
        <i className="fas fa-chart-line"></i>
        <h3>No Analytics Data Yet</h3>
        <p>Rate some movies and add notes to see your analytics!</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎬</div>
          <div className={styles.statInfo}>
            <h3>{analytics.totalMovies}</h3>
            <p>Movies with Notes</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statInfo}>
            <h3>{analytics.averageRating}</h3>
            <p>Average Rating</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>❤️</div>
          <div className={styles.statInfo}>
            <h3>{analytics.favoriteCount}</h3>
            <p>Favorites</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <h3>{analytics.totalNotes}</h3>
            <p>Total Notes</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3>🎭 Genre Distribution</h3>
          <div className={styles.chartContainer}>
            <Doughnut data={genreData} options={pieOptions} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>⭐ Rating Distribution</h3>
          <div className={styles.chartContainer}>
            <Bar data={ratingData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3>📅 Monthly Activity</h3>
          <div className={styles.chartContainer}>
            <Line data={monthlyData} options={chartOptions} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>🏆 Top Rated Movies</h3>
          <div className={styles.topMoviesList}>
            {analytics.topRatedMovies.map((movie, index) => (
              <div 
                key={index} 
                className={styles.topMovieItem}
                onClick={() => onOpen && onOpen({ id: movie.mediaId, media_type: movie.mediaType, title: movie.title })}
              >
                <span className={styles.rank}>{index + 1}</span>
                <span className={styles.movieTitle}>{movie.title || `Movie ${movie.mediaId}`}</span>
                <span className={styles.movieRating}>⭐ {movie.rating}/10</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className={styles.insightsCard}>
        <h3>📈 Watch Insights</h3>
        <div className={styles.insightsGrid}>
          <div className={styles.insightItem}>
            <i className="fas fa-fire"></i>
            <div>
              <strong>Favorite Genre</strong>
              <p>{analytics.favoriteGenre}</p>
            </div>
          </div>
          <div className={styles.insightItem}>
            <i className="fas fa-calendar-day"></i>
            <div>
              <strong>Most Active Day</strong>
              <p>{analytics.mostActiveDay}</p>
            </div>
          </div>
          <div className={styles.insightItem}>
            <i className="fas fa-chart-line"></i>
            <div>
              <strong>Completion Rate</strong>
              <p>{analytics.totalMovies > 0 ? Math.round((analytics.totalRatings / analytics.totalMovies) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations Section */}
      {analytics.recommendations && analytics.recommendations.length > 0 && (
        <div className={styles.recommendationsCard}>
          <div className={styles.recommendationsHeader}>
            <h3>
              <i className="fas fa-magic"></i>
              Personalized For You
            </h3>
            <span className={styles.recommendationBadge}>
              Based on your taste
            </span>
          </div>
          <p className={styles.recommendSubtitle}>
            Recommendations generated from your • Top rated movies • Favorite genres • Watch history
          </p>
          <div className={styles.recommendationsGrid}>
            {analytics.recommendations.slice(0, 6).map((movie, index) => (
              <div 
                key={movie.id} 
                className={styles.recommendationCard}
                onClick={() => onOpen && onOpen({ id: movie.id, media_type: 'movie', title: movie.title, type: 'movie' })}
              >
                <div className={styles.recommendationPoster}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300?text=🎬';
                    }}
                  />
                  <div className={styles.recommendationRank}>
                    {index + 1}
                  </div>
                  <div className={styles.recommendationOverlay}>
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <div className={styles.recommendationInfo}>
                  <h4>{movie.title}</h4>
                  <div className={styles.recommendationMeta}>
                    <span>{movie.year}</span>
                    <span className={styles.rating}>⭐ {movie.rating}</span>
                  </div>
                  <p className={styles.recommendationReason}>
                    <i className="fas fa-lightbulb"></i> {movie.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;