    import { useState } from 'react';
import styles from './RegPage.module.css'; // <-- 1. Import as a module

// 2. Expect 'setPage' (this matches App.jsx)
export default function RegPage({ setPage }) { 
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return; 
    }
    setError('');
    console.log('Registering with:', fullName, email, password);
  };

  return (
    // 3. Use 'styles' for all classNames
    <div className={styles.regPageWrapper}>
      <div className={styles.registerContainer}>
        <div className={styles.formBox}>
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text" id="fullName" required
                value={fullName} onChange={(e) => setFullName(e.target.value)}
              />
              <label htmlFor="fullName">Full Name</label>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email" id="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password" id="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password" id="confirmPassword" required
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            
            {error && <p className={styles.errorText}>{error}</p>}

            <button type="submit" className={styles.registerBtn}>Register</button>
            
            <p className={styles.loginLink}>
              Already have an account? 
              {/* 4. Use setPage('login') to go back */}
              <a href="#" onClick={() => setPage('login')}> Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}