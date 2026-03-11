import { API_TOKEN } from "../apiToken";

const BASE = "https://api.themoviedb.org/3";

export async function request(path, params = {}) {
  const url = new URL(BASE + path);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== "Default") {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
  return res.json();
}

export function discoverMovies(params) {
  return request("/discover/movie", params);
}

export function getGenres() {
  return request("/genre/movie/list");
}

export function discoverTv(params = {}) {
  return request("/discover/tv", params);
}
export function searchTv(query, params = {}) {
  if (!query) return Promise.resolve({ results: [], total_pages: 0, page: 1 });
  return request("/search/tv", { query, ...params });
}
export function getTvGenres() {
  return request("/genre/tv/list");
}

// details endpoints
export function getMovieDetails(id) {
  return request(`/movie/${id}`, { append_to_response: "videos" });
}
export function getTvDetails(id) {
  return request(`/tv/${id}`, { append_to_response: "videos" });
}

// credits
export function getCredits(id, type = "movie") {
  return request(`/${type}/${id}/credits`);
}

// recommendations
export function getRecommendations(id, type = "movie", params = {}) {
  return request(`/${type}/${id}/recommendations`, params);
}
// ADD THIS NEW, CORRECT FUNCTION
export function getLanguages() {
  return request("/configuration/languages");
}

export const IMG = "https://image.tmdb.org/t/p/w500";