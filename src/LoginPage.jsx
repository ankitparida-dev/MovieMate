import { useState } from 'react';
import './LoginPage.css'; // <-- Import your new CSS

// This component will be passed a "remote control" prop
// called 'onShowRegister' from App.jsx later
export default function LoginPage({ onShowRegister }) {

  // We use state to control the inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // This is what runs when you click "Sign In"
  const handleSubmit = (event) => {
    event.preventDefault(); // Stops the page from refreshing
    console.log('Logging in with:', email, password);
    // Later, you'd call an API here
  };

  return (
    // We use our new "wrapper" class to get the background
    <div className="login-page-wrapper">
      <div className="container">
        <div className="login-section">
          {/* We use onSubmit to call our function */}
          <form onSubmit={handleSubmit}>
            <h2>Login to Your Account</h2>

            {/* 'for' becomes 'htmlFor' */}
            <label htmlFor="email">E-mail</label>
            <div className="input-box">
              {/* This is a "Controlled Component" */}
              <input
                type="email"
                id="email"
                placeholder="Email"
                required
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                value={email} // The value is locked to our state
                onChange={(e) => setEmail(e.target.value)} // onChange updates our state
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-box">
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

            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>
        </div>

        <div className="signup-section">
          <h2>New Here?</h2>
          <p>Sign up Now!</p>
          {/* This button will be our "remote control" to switch pages */}
          <button onClick={onShowRegister}>Register</button>
        </div>
      </div>
    </div>
  );
}