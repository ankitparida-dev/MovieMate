// src/pages/About.jsx
import { useEffect, useState } from "react";
import styles from "./About.module.css";
import { getMovieDetails, getTvDetails, getCredits, getRecommendations, IMG } from "../api/tmdb";

export default function About({ selected, setPage }) {
  // selected: { id, type } where type is "movie" or "tv"
  const [data, setData] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const id = selected?.id;
  const type = selected?.type ?? "movie";

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);

    async function fetchAll() {
      try {
        if (type === "movie") {
          const d = await getMovieDetails(id);
          if (!mounted) return;
          setData(d);
          const c = await getCredits(id, "movie");
          if (!mounted) return;
          setCredits(c);
          const r = await getRecommendations(id, "movie");
          if (!mounted) return;
          setRecs(r.results ?? []);
        } else {
          const d = await getTvDetails(id);
          if (!mounted) return;
          setData(d);
          const c = await getCredits(id, "tv");
          if (!mounted) return;
          setCredits(c);
          const r = await getRecommendations(id, "tv");
          if (!mounted) return;
          setRecs(r.results ?? []);
        }
      } catch (err) {
        console.error("About fetch error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => { mounted = false; };
  }, [id, type]);

  if (!id) return null;
  if (loading) return <div className={styles.loading}>Loading details…</div>;

  const title = data?.title ?? data?.name ?? "Untitled";
  const poster = data?.poster_path ? `${IMG}${data.poster_path}` : "/placeholder.png";
  const overview = data?.overview ?? "No overview available.";
  const year = (data?.release_date || data?.first_air_date || "").slice(0, 4) || "N/A";
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
            <span className={styles.boxItem}>⭐ {rating}</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.btnWatch}>Trailer</button>
            <button className={styles.btnList}>Add to List</button>
            <button className={styles.favBtn}>❤</button>
          </div>

          <section className={styles.overview}>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
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
                <p>{person.character ?? person.job ?? ""}</p>
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
              <article className={styles.showCard} key={r.id}>
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
      </main>
    </div>
  );
}
