import { useState } from "react";
import styles from "./LoginPage.module.css";
import { loginUser, verifyOtp, resendOtp } from "./api/api";

export default function LoginPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [step, setStep] = useState("credentials");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setIsLoading(true);

    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(email, password);

      if (response?.otpRequired) {
        setPendingEmail(email);
        setStep("otp");
        setInfo("Check your email for the OTP code to complete login.");
      } else if (response?.accessToken && response?.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.accessToken);
        alert("Login successful! Welcome back.");
        setPage("home");
        window.location.reload();
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setIsLoading(true);

    if (!otp.trim()) {
      setError("OTP code is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await verifyOtp(pendingEmail, otp);

      if (response?.accessToken && response?.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.accessToken);
        alert("Login successful! Welcome back.");
        setPage("home");
        window.location.reload();
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingEmail) {
      setError("No email to resend OTP to.");
      return;
    }

    try {
      setIsLoading(true);
      await resendOtp(pendingEmail);
      setInfo("A new OTP was sent to your email.");
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep("credentials");
    setOtp("");
    setInfo("");
    setError("");
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}>
        {/* Login Section */}
        <div className={styles.loginSection}>
          <form onSubmit={step === "credentials" ? handleSubmit : handleVerifyOtp}>
            <h2>{step === "credentials" ? "Welcome Back" : "Enter OTP"}</h2>
            
            {step === "credentials" ? (
              <>
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
                    placeholder="Enter your password"
                    required
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
              </>
            ) : (
              <>
                <p className={styles.infoText}>
                  A one-time code was sent to <strong>{pendingEmail}</strong>. Enter it below to sign in.
                </p>

                <label htmlFor="otp">OTP Code</label>
                <div className={styles.inputBox}>
                  <input 
                    type="text" 
                    id="otp" 
                    placeholder="Enter OTP code"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading}
                    inputMode="numeric"
                    pattern="\d{6}"
                  />
                </div>
              </>
            )}

            {(error || info) && (
              <div className={styles.messageRow}>
                {error && <div className={styles.errorMessage}>{error}</div>}
                {info && <div className={styles.infoMessage}>{info}</div>}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.loginBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.loadingSpinner}></span>
                  {step === "credentials" ? "Signing In..." : "Verifying..."}
                </>
              ) : (
                step === "credentials" ? "Sign In" : "Verify OTP"
              )}
            </button>

            {step === "otp" && (
              <div className={styles.otpActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={handleBackToLogin}
                  disabled={isLoading}
                >
                  Back to Login
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Sign Up Section */}
        <div className={styles.signupSection}>
          <h2>New Here?</h2>
          <p>Create an account and start your cinematic journey with MovieMate!</p>
          <button 
            type="button" 
            className={styles.signupBtn}
            onClick={() => setPage("register")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}