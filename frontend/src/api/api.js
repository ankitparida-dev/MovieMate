// frontend/src/api/api.js

import toast from 'react-hot-toast';

const rawApiUrl = import.meta.env.VITE_API_URL;
const rawSocketUrl = import.meta.env.VITE_SOCKET_URL;
const DEFAULT_API_URL = "http://localhost:5000/api";

// ✅ Check if the browser is running online vs locally
const isProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

// ✅ Force the live Render URL if in production, otherwise use env/localhost
const BASE_URL = isProduction 
  ? "https://moviemate-l4ts.onrender.com/api" 
  : (rawApiUrl || (rawSocketUrl ? `${rawSocketUrl.replace(/\/$/, '')}/api` : DEFAULT_API_URL));

const getToken = () => localStorage.getItem("token");

const getHeaders = (hasBody = false) => {
  const headers = {};
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

async function request(endpoint, { method = "GET", body } = {}) {
  const options = {
    method,
    headers: getHeaders(!!body),
  };

  if (body) {
    options.body = JSON.stringify(body);                              
  }

  const res = await fetch(`${BASE_URL}/${endpoint}`, options);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = errorBody?.message || errorBody?.error || res.statusText;
    throw new Error(message || `Request failed: ${endpoint}`);
  }

  return res.json();
}

export function getData(endpoint) {
  return request(endpoint);
}

export function postData(endpoint, data) {
  return request(endpoint, { method: "POST", body: data });
}

export async function loginUser(email, password) {
  return postData("auth/login", { email, password });
}

export async function registerUser(name, email, password) {
  return postData("auth/register", { name, email, password });
}

export function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

// ============================================================
// ✅ LIBRARY FUNCTIONS
// ============================================================

async function addToList(category, movie) {
  const token = getToken();
  if (!token) {
    toast.error("Please log in to add items.");
    return;
  }

  await postData("library/add", {
    movieId: movie.id,
    title: movie.title || movie.name,
    poster_path: movie.poster_path,
    media_type: movie.media_type,
    category,
    watchStatus: movie.watchStatus,
  });

  if (category !== "history") {
    toast.success(`Added to ${category}!`);
  }
}

async function getUserCollection(category) {
  const token = getToken();
  if (!token) return [];

  const items = await getData(`library?category=${category}`);
  return items.map((item) => ({ ...item, id: item.movieId }));
}

export async function removeFromCollection(category, movieId) {
  const token = getToken();
  if (!token) {
    toast.error("Please log in to remove items.");
    return;
  }

  const items = await getData(`library?category=${category}&movieId=${movieId}`);
  if (items.length === 0) return;

  await request(`library/remove/${items[0]._id}`, { method: "DELETE" });
  toast.success(`Removed from ${category}!`);
}

export async function getLibraryItem(movieId, category = "history") {
  const items = await getData(`library?category=${category}&movieId=${movieId}`);
  return items[0] || null;
}

export async function updateLibraryItem(id, data) {
  return request(`library/update/${id}`, {
    method: "PATCH",
    body: data
  });
}

// ============================================================
// ✅ ADD/REMOVE FUNCTIONS
// ============================================================

export const addToFavorites = (movie) => addToList("favorites", movie);
export const addToWatchlist = (movie, watchStatus = "planning") =>
  addToList("watchlist", {
    ...movie,
    watchStatus
  });
export const addToHistory = (movie) =>
  addToList("history", {
    ...movie,
    watchStatus: "completed"
  });

export const getFavorites = () => getUserCollection("favorites");
export const getWatchlist = () => getUserCollection("watchlist");
export const getHistory = () => getUserCollection("history");

// ============================================================
// ✅ CHECK STATUS FUNCTIONS (For HeroBanner)
// ============================================================

export const isInFavorites = async (movieId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(item => item.id === movieId || item.movieId === movieId);
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};

export const isInWatchlist = async (movieId) => {
  try {
    const watchlist = await getWatchlist();
    return watchlist.some(item => item.id === movieId || item.movieId === movieId);
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

export const isInHistory = async (movieId) => {
  try {
    const history = await getHistory();
    return history.some(item => item.id === movieId || item.movieId === movieId);
  } catch (error) {
    console.error('Error checking history:', error);
    return false;
  }
};

// ============================================================
// ✅ BULK STATUS CHECK (For HeroBanner)
// ============================================================

export const getLibraryStatus = async (movieId) => {
  try {
    const [favorites, watchlist, history] = await Promise.all([
      getFavorites(),
      getWatchlist(),
      getHistory()
    ]);
    
    return {
      isFavorite: favorites.some(item => item.id === movieId || item.movieId === movieId),
      isWatchlist: watchlist.some(item => item.id === movieId || item.movieId === movieId),
      isHistory: history.some(item => item.id === movieId || item.movieId === movieId)
    };
  } catch (error) {
    console.error('Error getting library status:', error);
    return { isFavorite: false, isWatchlist: false, isHistory: false };
  }
};

// ============================================================
// ✅ NOTES FUNCTIONS
// ============================================================

export const getNotes = async (movieId) => {
  try {
    const response = await getData(`notes/movie/${movieId}`);
    return response;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

export const saveNote = async (data) => {
  try {
    const response = await postData('notes', data);
    return response;
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await request(`notes/${noteId}`, { method: "DELETE" });
    return response;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const getUserNotes = async () => {
  try {
    const response = await getData('notes/user');
    return response;
  } catch (error) {
    console.error('Error fetching user notes:', error);
    return [];
  }
};

// ============================================================
// ✅ RECOMMENDATIONS
// ============================================================

export const getRecommendations = async () => {
  try {
    const response = await getData('recommendations');
    return response;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

// ============================================================
// ✅ ANALYTICS
// ============================================================

export const getAnalytics = async () => {
  try {
    const response = await getData('analytics');
    return response;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {};
  }
};

// ============================================================
// ✅ REPORT FUNCTIONS (NEW)
// ============================================================

export const submitReport = async (reportData) => {
  try {
    const response = await postData('reports/create', reportData);
    return response;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
};

// ============================================================
// ✅ EXPORT DEFAULT
// ============================================================

export default {
  getData,
  postData,
  loginUser,
  registerUser,
  logoutUser,
  addToFavorites,
  addToWatchlist,
  addToHistory,
  getFavorites,
  getWatchlist,
  getHistory,
  removeFromCollection,
  getLibraryItem,
  updateLibraryItem,
  isInFavorites,
  isInWatchlist,
  isInHistory,
  getLibraryStatus,
  getNotes,
  saveNote,
  deleteNote,
  getUserNotes,
  getRecommendations,
  getAnalytics,
  submitReport // ✅ ADDED
};