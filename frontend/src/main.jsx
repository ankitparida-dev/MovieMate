// frontend/src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'

import App from './App.jsx'
import "./styles/globals.css";

// ✅ Google Client ID from environment
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log('🔑 Google Client ID:', GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not Set');

if (!GOOGLE_CLIENT_ID) {
  console.warn('⚠️ VITE_GOOGLE_CLIENT_ID is not set in .env file');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)