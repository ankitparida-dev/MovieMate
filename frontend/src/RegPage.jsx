// frontend/src/RegPage.jsx

import { useState } from "react";
import styles from "./RegPage.module.css"; // ✅ Keep this
import { registerUser } from "./api/api";
import toast from 'react-hot-toast';

export default function RegPage({ setPage }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (!fullName.trim()) {
      setError("Full name is required");
      setIsLoading(false);
      return;
    }
    
    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }
    
    if (!password) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(fullName, email, password);
      
      if (response && response.user && response.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.accessToken);
        toast.success('Registration Successful! Welcome to MovieMate!');
        setPage("home");
        window.location.reload();
      } else {
        toast.success('Registration Successful! Please login.');
        setPage("login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerPageWrapper}>
      <div className={styles.registerContainer}>
        {/* Register Section */}
        <div className={styles.registerSection}>
          <form onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            
            <label htmlFor="fullName">Full Name</label>
            <div className={styles.inputBox}>
              <input 
                type="text" 
                id="fullName" 
                placeholder="Enter your full name"
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                autoComplete="name"
              />
            </div>

            <label htmlFor="email">Email Address</label>
            <div className={styles.inputBox}>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email"
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className={styles.inputBox}>
              <input 
                type="password" 
                id="password" 
                placeholder="Create a password (min 6 characters)"
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.inputBox}>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="Confirm your password"
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button 
              type="submit" 
              className={styles.registerBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.loadingSpinner}></span>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className={styles.loginLink}>
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => setPage("login")}
                className={styles.linkBtn}
              >
                Sign In
              </button>
            </p>
          </form>
        </div>

        {/* Login Section (Call to Action) */}
        <div className={styles.loginSection}>
          <h2>Welcome Back!</h2>
          <p>Already have an account? Sign in to continue your movie journey.</p>
          <button 
            type="button" 
            className={styles.loginBtn}
            onClick={() => setPage("login")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}