// frontend/src/LoginPage.jsx

import { useState } from "react";
import styles from "./LoginPage.module.css";
import { googleLogin, loginUser } from "./api/api";
import GoogleLoginButton from "./components/GoogleLoginButton";
import toast from 'react-hot-toast';

export default function LoginPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  // ✅ Random Taglines
  const taglines = [
    "One click. Unlimited movies. Start now.",
    "Your next favorite movie is one click away",
    "Discover. Rate. Repeat.",
    "Where movie lovers connect",
    "The ultimate movie companion",
    "Your personal cinema guide",
    "Find your next obsession",
    "Movies made simple",
    "Because every movie deserves a review",
    "Your movie journey starts here",
    "Explore the world of cinema",
    "The best way to discover movies",
    "Your next movie is waiting",
    "Watch. Rate. Share.",
  ];

  const [randomTagline] = useState(taglines[Math.floor(Math.random() * taglines.length)]);

  // ✅ Google Login Handler
  const handleGoogleSuccess = async (credential) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await googleLogin(credential);

      if (response?.success) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.accessToken);
        toast.success('Welcome! 🎬');
        setPage("home");
        window.location.reload();
      } else {
        setError(response.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Failed to login with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login was cancelled or failed");
  };

  // ✅ Email Login Handler
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(email, password);

      if (response?.success) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.accessToken);
        toast.success('Login successful!');
        setPage("home");
        window.location.reload();
      } else {
        setError(response.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.loginSection}>
          <h2>Welcome Back</h2>
          
          {/* ✅ GOOGLE LOGIN BUTTON */}
          <GoogleLoginButton 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          {/* Divider */}
          <div className={styles.divider}>
            <span>or</span>
          </div>

          {/* ✅ EMAIL LOGIN (Backup) */}
          {!showEmailLogin ? (
            <button 
              type="button" 
              className={styles.emailToggleBtn}
              onClick={() => setShowEmailLogin(true)}
            >
              <i className="fas fa-envelope"></i> Sign in with Email
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit}>
              <label>Email Address</label>
              <div className={styles.inputBox}>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <label>Password</label>
              <div className={styles.inputBox}>
                <input 
                  type="password" 
                  placeholder="Enter your password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className={styles.loginBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              <button 
                type="button" 
                className={styles.backToGoogleBtn}
                onClick={() => setShowEmailLogin(false)}
              >
                ← Back to Google Sign In
              </button>
            </form>
          )}

          {error && <div className={styles.errorMessage}>{error}</div>}

          <p className={styles.registerLink}>
            Don't have an account?{' '}
            <button 
              type="button" 
              className={styles.linkBtn}
              onClick={() => setPage('register')}
            >
              Register
            </button>
          </p>
        </div>

        {/* ✅ RANDOM TAGLINE */}
        <div className={styles.signupSection}>
          <h2>Welcome!</h2>
          <p>{randomTagline}</p>
          <button 
            type="button" 
            className={styles.signupBtn}
            onClick={() => setPage('register')}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}