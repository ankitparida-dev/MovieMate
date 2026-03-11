import { useState } from "react";
import styles from "./LoginPage.module.css";
import { getData } from "./api/api"; // Import getData

export default function LoginPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // 1️⃣ Check user in JSON server
      // Note: We pass "users?..." as the endpoint string
      const users = await getData(`users?email=${email}&password=${password}`);

      if (users.length > 0) {
        // 2️⃣ Successful Login
        const loggedUser = users[0];
        localStorage.setItem("user", JSON.stringify(loggedUser));
        alert("Login Successful!");
        
        // Force a reload or state update to update the Navbar immediately
        // Ideally, you'd use a context, but simply switching pages works for now
        setPage("home"); 
        window.location.reload(); // Quick hack to update Navbar "Login" -> "My Library"
      } else {
        // 3️⃣ Failed Login
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Is the server running?");
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.loginSection}>
          <form onSubmit={handleSubmit}>
            <h2>Login to Your Account</h2>
            
            {/* Inputs... */}
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputBox}>
              <input type="email" id="email" placeholder="Email" required
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <label htmlFor="password">Password</label>
            <div className={styles.inputBox}>
              <input type="password" id="password" placeholder="Password" required
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <button type="submit" className={styles.loginBtn}>Sign In</button>
          </form>
        </div>

        <div className={styles.signupSection}>
          <h2>New Here?</h2>
          <p>Sign up Now!</p>
          <button type="button" onClick={() => setPage("register")}>Register</button>
        </div>
      </div>
    </div>
  );
}