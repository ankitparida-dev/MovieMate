import { useEffect, useState } from "react";
import styles from "./About.module.css";
import { getMovieDetails, getTvDetails, getCredits, getRecommendations, IMG } from "../api/tmdb";
import { addToFavorites, addToWatchlist, addToHistory } from "../api/api";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import RecentlyViewed from "../components/RecentlyViewed";
import WatchPlatforms from "../components/WatchPlatforms";
import MovieNotes from "../components/MovieNotes";
import ReviewsSection from "../components/ReviewsSection";  // ✅ ADD THIS
import { useMovieNotes } from "../hooks/useMovieNotes";
import CommentSection from "../components/CommentSection";

export default function About({ selected, setPage, onOpen }) {
  const [data, setData] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');  // ✅ ADD THIS
  
  const { addToRecentlyViewed, recentItems, clearRecentlyViewed, removeFromRecentlyViewed } = useRecentlyViewed();
  const { getNote, saveNote, deleteNote } = useMovieNotes();
  
  const id = selected?.id;
  const type = selected?.type || selected?.media_type || "movie";
  const existingNote = getNote(id, type);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    window.scrollTo(0, 0);

    async function fetchAll() {
      try {
        let d;
        if (type === "movie") {
          d = await getMovieDetails(id);
        } else {
          d = await getTvDetails(id);
        }
        if (!mounted) return;
        setData(d);

        try {
          await addToHistory({
            id: d.id,
            title: d.title || d.name,
            poster_path: d.poster_path,
            media_type: type
          });
        } catch (historyErr) {
          console.error("History error:", historyErr);
        }

        const c = await getCredits(id, type);
        if (!mounted) return;
        setCredits(c);

        const r = await getRecommendations(id, type);
        if (!mounted) return;
        setRecs(r.results ?? []);
      } catch (err) {
        console.error("About fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => { mounted = false; };
  }, [id, type]);

  const getMovieObject = () => {
    return {
      id: data.id,
      title: data.title || data.name,
      poster_path: data.poster_path,
      vote_average: data.vote_average,
      release_date: data.release_date || data.first_air_date,
      media_type: type 
    };
  };

  const handleFav = async () => {
    if (!data) return;
    try {
      await addToFavorites(getMovieObject());
    } catch (err) {
      console.error("FAVORITE ERROR:", err);
    }
  };

  const handleWatchlist = async () => {
    if (!data) return;
    try {
      await addToWatchlist(getMovieObject());
    } catch (err) {
      console.error("WATCHLIST ERROR:", err);
    }
  };

  const handleTrailer = () => {
    if (!data) return;
    const query = `${data.title || data.name} trailer`;
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
  };

  const handleSaveNote = (mediaId, mediaType, noteData) => {
    const title = data?.title || data?.name || "Untitled";
    saveNote(
      mediaId, 
      mediaType, 
      title, 
      data?.poster_path, 
      noteData.rating, 
      noteData.note, 
      noteData.isFavorite
    );
  };

  const handleDeleteNote = (mediaId, mediaType) => {
    deleteNote(mediaId, mediaType);
  };

  if (!id) return null;
  if (loading) return <div className={styles.loading}>Loading details…</div>;

  const title = data?.title ?? data?.name ?? "Untitled";
  const poster = data?.poster_path ? `${IMG}${data.poster_path}` : "/placeholder.png";
  const overview = data?.overview ?? "No overview available.";
  const runtime = data?.runtime ?? data?.episode_run_time?.[0] ?? null;
  const rating = data?.vote_average ? Number(data.vote_average).toFixed(1) : "N/A";
  const genres = (data?.genres || []).map(g => g.name).join(", ");
  const companies = (data?.production_companies || []).map(c => c.name).join(", ");

  return (
    <div className={styles.page}>
      <div className={styles.backNav}>
        <button onClick={() => setPage("movies")} className={styles.backBtn}>← Back</button>
      </div>

      <header className={styles.hero}>
        <div className={styles.posterWrap}>
          <img src={poster} alt={title} />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.showBoxes}>
            <span className={styles.boxItem}>{type === "tv" ? "TV Series" : "Movie"}</span>
            {runtime && <span className={styles.boxItem}>{runtime}m</span>}
            <span className={styles.boxItem}> {rating}</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.btnWatch} onClick={handleTrailer}>Trailer</button>
            <button className={styles.btnList} onClick={handleWatchlist}>+ Watchlist</button>
            <button className={styles.favBtn} onClick={handleFav}>❤</button>
          </div>

          <section className={styles.overview}>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <WatchPlatforms mediaType={type} id={id} title={title} />

          {/* ✅ TABS SECTION */}
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-info-circle"></i> Overview
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'cast' ? styles.active : ''}`}
              onClick={() => setActiveTab('cast')}
            >
              <i className="fas fa-users"></i> Cast & Crew
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'notes' ? styles.active : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <i className="fas fa-pen"></i> My Notes
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <i className="fas fa-star"></i> Reviews
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'comments' ? styles.active : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <i className="fas fa-comments"></i> Comments
            </button>
          </div>

          {/* ✅ TAB CONTENT */}
          <div className={styles.tabContent}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <MovieNotes 
                  movie={{
                    id: id,
                    mediaType: type,
                    title: title,
                    poster_path: data?.poster_path,
                    existingNote: existingNote,
                    onSave: handleSaveNote,
                    onDelete: handleDeleteNote
                  }}
                />
              </div>
            )}

            {/* Cast Tab */}
            {activeTab === 'cast' && (
              <div>
                <section className={styles.castSection}>
                  <h3>Cast</h3>
                  <div className={styles.cast}>
                    {credits.cast?.slice(0,6).map(person => (
                      <div className={styles.castItem} key={person.cast_id ?? person.id}>
                        <img src={person.profile_path ? `${IMG}${person.profile_path}` : "/placeholder.png"} alt={person.name} />
                        <h4>{person.name}</h4>
                        <p>{person.character ?? ""}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div>
                <MovieNotes 
                  movie={{
                    id: id,
                    mediaType: type,
                    title: title,
                    poster_path: data?.poster_path,
                    existingNote: existingNote,
                    onSave: handleSaveNote,
                    onDelete: handleDeleteNote
                  }}
                />
              </div>
            )}

            {/* ✅ REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsTab}>
                <ReviewsSection 
                  mediaId={id}
                  mediaType={type}
                  title={title}
                />
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className={styles.commentsTab}>
                <CommentSection 
                  movieId={id}
                  movieTitle={title}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>Details</h2>
        <section className={styles.details}>
          <article className={styles.detailItem}><h3>Original Title</h3><p>{data?.original_title ?? data?.original_name ?? "—"}</p></article>
          <article className={styles.detailItem}><h3>First Air / Release</h3><p>{data?.release_date ?? data?.first_air_date ?? "—"}</p></article>
          <article className={styles.detailItem}><h3>Duration</h3><p>{runtime ? `${runtime}m` : "-"}</p></article>
          <article className={styles.detailItem}><h3>Status</h3><p>{data?.status ?? "-"}</p></article>
          <article className={styles.detailItem}><h3>Rating</h3><p>{rating}</p></article>
          <article className={styles.detailItem}><h3>Genres</h3><p>{genres || "-"}</p></article>
          <article className={styles.detailItem}><h3>Production</h3><p>{companies || "-"}</p></article>
        </section>

        <section className={styles.castSection}>
          <h2 className={styles.sectionTitle}>Cast & Staff</h2>
          <h3>Cast</h3>
          <div className={styles.cast}>
            {credits.cast?.slice(0,6).map(person => (
              <div className={styles.castItem} key={person.cast_id ?? person.id}>
                <img src={person.profile_path ? `${IMG}${person.profile_path}` : "/placeholder.png"} alt={person.name} />
                <h4>{person.name}</h4>
                <p>{person.character ?? ""}</p>
              </div>
            ))}
          </div>

          <hr className={styles.divider} />

          <h3>Staff</h3>
          <div className={styles.staff}>
            {credits.crew?.filter(c => c.job === "Director").slice(0,1).map(d => (
              <div className={styles.staffItem} key={d.credit_id || d.id}>
                <img src={d.profile_path ? `${IMG}${d.profile_path}` : "/placeholder.png"} alt={d.name} />
                <h4>{d.name}</h4>
                <p>{d.job}</p>
              </div>
            ))}
            {credits.crew?.filter(c => c.job === "Writer" || c.job === "Screenplay").slice(0,6).map(w => (
              <div className={styles.staffItem} key={w.credit_id || w.id}>
                <img src={w.profile_path ? `${IMG}${w.profile_path}` : "/placeholder.png"} alt={w.name} />
                <h4>{w.name}</h4>
                <p>{w.job}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.recommended}>
          <h2 className={styles.sectionTitle}>Recommended</h2>
          <div className={styles.showGrid}>
            {recs.slice(0,6).map(r => (
              <article 
                className={styles.showCard} 
                key={r.id} 
                onClick={() => onOpen({ ...r, media_type: type, type: type })}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.recImgWrap}>
                  <img src={r.poster_path ? `${IMG}${r.poster_path}` : "/placeholder.png"} alt={r.title ?? r.name} />
                </div>
                <div className={styles.showContent}>
                  <h4>{r.title ?? r.name}</h4>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Recently Viewed Section */}
        {recentItems.length > 1 && (
          <div className={styles.recentlyViewedSection}>
            <RecentlyViewed 
              items={recentItems.filter(item => item.id !== id)}
              onItemClick={(item) => {
                const mediaType = item.media_type || 'movie';
                onOpen({ ...item, media_type: mediaType, type: mediaType });
                window.scrollTo(0, 0);
              }}
              onRemove={removeFromRecentlyViewed}
              onClearAll={clearRecentlyViewed}
              title="Recently Viewed"
            />
          </div>
        )}

        <div className={styles.commentsSection}>
          <CommentSection 
            movieId={id}
            movieTitle={title}
          />
        </div>
      </main>
    </div>
  );
}