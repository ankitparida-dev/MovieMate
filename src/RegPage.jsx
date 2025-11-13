import { useState } from 'react';
import './RegPage.css'; // <-- Import your new CSS

// This component gets the 'onShowLogin' remote control
export default function RegPage({ onShowLogin }) {
  
  // We need state for all 4 inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages

  const handleSubmit = (event) => {
    event.preventDefault(); // Stop page refresh
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return; // Stop the function
    }
    
    // If they match, clear any old errors and log the data
    setError('');
    console.log('Registering with:', fullName, email, password);
    // Later, you'd call an API here
  };

  return (
    // Use our new "wrapper" class
    <div className="reg-page-wrapper">
      <div className="register-container">
        <div className="form-box">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div className="input-group">
              <input
                type="text"
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <label htmlFor="fullName">Full Name</label>
            </div>

            {/* Email Input */}
            <div className="input-group">
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email Address</label>
            </div>

            {/* Password Input */}
            <div className="input-group">
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>

            {/* Confirm Password Input */}
            <div className="input-group">
              <input
                type="password"
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            
            {/* Show an error message if the 'error' state is not empty */}
            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

            <button type="submit" className="register-btn">Register</button>
            
            <p className="login-link">
              Already have an account? 
              {/* This link now uses the "remote control" prop */}
              <a href="#" onClick={onShowLogin}> Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}