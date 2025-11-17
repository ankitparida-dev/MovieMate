const BASE_URL = "http://localhost:5000";

// --- 1. GENERIC FUNCTIONS (For Login & Register) ---

export async function getData(endpoint) {
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return await res.json();
}

export async function postData(endpoint, data) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to post to ${endpoint}`);
  return await res.json();
}

// --- 2. LIBRARY FUNCTIONS ---

// Helper: Get current User ID
function getCurrentUserId() {
  const userString = localStorage.getItem("user");
  if (!userString) return null;
  try {
    const user = JSON.parse(userString);
    return user.id;
  } catch (e) {
    return null;
  }
}

// Add to List
async function addToList(endpoint, movie) {
  const userId = getCurrentUserId();
  if (!userId) {
    alert("Please log in to save movies!");
    return;
  }

  const checkRes = await fetch(`${BASE_URL}/${endpoint}?userId=${userId}&id=${movie.id}`);
  const checkData = await checkRes.json();

  if (checkData.length > 0) {
    alert(`Already in your ${endpoint}!`);
    return;
  }

  await postData(endpoint, { ...movie, userId });
  alert(`Added to ${endpoint}!`);
}

// Get List
async function getUserCollection(endpoint) {
  const userId = getCurrentUserId();
  if (!userId) return [];
  return await getData(`${endpoint}?userId=${userId}`);
}

// --- 3. THE MISSING FUNCTION (DELETE) ---
export async function removeFromCollection(endpoint, movieId) {
  const userId = getCurrentUserId();
  
  // 1. Find the specific record ID (json-server creates a unique ID for every entry)
  const checkRes = await fetch(`${BASE_URL}/${endpoint}?userId=${userId}&id=${movieId}`);
  const data = await checkRes.json();

  // 2. Delete using that unique record ID
  if (data.length > 0) {
    const recordId = data[0].id; 
    await fetch(`${BASE_URL}/${endpoint}/${recordId}`, {
      method: "DELETE"
    });
  }
}

// --- EXPORTS ---
export const addToFavorites = (movie) => addToList("favorites", movie);
export const addToWatchlist = (movie) => addToList("watchlist", movie);
export const addToHistory = (movie) => addToList("history", movie);

export const getFavorites = () => getUserCollection("favorites");
export const getWatchlist = () => getUserCollection("watchlist");
export const getHistory = () => getUserCollection("history");