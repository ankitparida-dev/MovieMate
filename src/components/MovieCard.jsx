// src/components/MovieCard.jsx
import styles from "./MovieCard.module.css";
import { IMG } from "../api/tmdb";

export default function MovieCard({ movie, onClick }) {
  const poster = movie.poster_path ? IMG + movie.poster_path : "/placeholder.png";
  const title = movie.title ?? movie.name ?? "Untitled";
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4) || "N/A";

  return (
    <button
      className={styles.card}
      onClick={() => onClick?.(movie)}
      type="button"
      aria-label={`Open details for ${title}`}
      style={{ background: "none", border: "none", textAlign: "left", padding: 0 }}
    >
      <div className={styles.poster} style={{ backgroundImage: `url(${poster})` }} />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>{year}</div>
      </div>
    </button>
  );
}