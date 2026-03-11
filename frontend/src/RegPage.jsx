import { useState } from "react";
import styles from "./RegPage.module.css";
import { getData, postData } from "./api/api";

export default function RegPage({ setPage }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // 1. Check if email exists
      const existingUser = await getData(`users?email=${email}`);
      
      if (existingUser.length > 0) {
        setError("Email already registered!");
        return;
      }

      // 2. Register new user
      const newUser = { fullName, email, password };
      
      // Pass endpoint "users" and the data object
      await postData("users", newUser);

      alert("Registration Successful! Please login.");
      setPage("login");
    } catch (err) {
      setError("Registration failed. Is the server running?");
    }
  };

  return (
    <div className={styles.regPageWrapper}>
      <div className={styles.registerContainer}>
        <div className={styles.formBox}>
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            {/* ... Your Inputs stay exactly the same ... */}
            <div className={styles.inputGroup}>
              <input type="text" id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <label htmlFor="fullName">Full Name</label>
            </div>
            <div className={styles.inputGroup}>
              <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="email">Email Address</label>
            </div>
            <div className={styles.inputGroup}>
              <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <label htmlFor="password">Password</label>
            </div>
            <div className={styles.inputGroup}>
              <input type="password" id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <button type="submit" className={styles.registerBtn}>Register</button>

            <p className={styles.loginLink}>
              Already have an account? <a href="#" onClick={() => setPage("login")}>Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}