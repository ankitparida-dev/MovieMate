import { useState } from 'react';
import styles from './LoginPage.module.css'; // <-- 1. Import as a module

// 2. We get 'setPage' from App.jsx
export default function LoginPage({ setPage }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); 
    console.log('Logging in with:', email, password);
    // Later, you'd call an API here
  };

  return (
    // 3. All classNames are now "scoped"
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}> {/* <-- 4. Renamed from .container */}
        
        <div className={styles.loginSection}>
          <form onSubmit={handleSubmit}>
            <h2>Login to Your Account</h2>

            <label htmlFor="email">E-mail</label>
            <div className={styles.inputBox}>
              <input
                type="email"
                id="email"
                placeholder="Email"
                required
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className={styles.inputBox}>
              <input
                type="password"
                id="password"
                placeholder="Password"
                required
                pattern="[A-Za-z\d]{8,16}"
                minLength="8"
                maxLength="16"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.loginBtn}>
              Sign In
            </button>
          </form>
        </div>

        <div className={styles.signupSection}>
          <h2>New Here?</h2>
          <p>Sign up Now!</p>
          {/* 5. This button now uses 'setPage' to go to the register page */}
          <button type="button" onClick={() => setPage("register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}