import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const rawSocketUrl = import.meta.env.VITE_SOCKET_URL;
const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

// ✅ Check if the browser is running online vs locally
const isProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

// ✅ Force the live Render URL if in production, otherwise use env/localhost fallback
const API_BASE_URL = isProduction 
  ? "https://moviemate-l4ts.onrender.com/api" 
  : (rawApiUrl || (rawSocketUrl ? `${rawSocketUrl.replace(/\/$/, '')}/api` : DEFAULT_API_BASE_URL));


  // ... leave your getWatchProviders and getAvailableCountries functions exactly as they are

export const platformApi = {
  // Get watch providers for a movie or TV show
  getWatchProviders: async (mediaType, id, country = 'IN') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/platforms/${mediaType}/${id}`, {
        params: { country }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching watch providers:', error);
      return null;
    }
  },
  
  // Get available countries
  getAvailableCountries: async (mediaType, id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/platforms/${mediaType}/${id}/countries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return null;
    }
  }
};