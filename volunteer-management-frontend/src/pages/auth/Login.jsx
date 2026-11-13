import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaHandsHelping,
  FaKey,
  FaLock
} from "react-icons/fa";

import Swal from "sweetalert2";

import {
  loginUser,
  requestPasswordResetOtp,
  resetPassword
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";


const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, password });
      login(response.data);

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!"
      });

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid Credentials"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestResetOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await requestPasswordResetOtp(resetEmail);
      setMode("reset");
      await Swal.fire({
        icon: "info",
        title: "Check your email",
        text: "We sent a 6-digit password reset code. It expires in 5 minutes."
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to send code",
        text: error.response?.data?.message || "Check your email address and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resetPassword({
        email: resetEmail,
        otp: resetOtp,
        newPassword
      });
      setEmail(resetEmail);
      setPassword("");
      setResetOtp("");
      setNewPassword("");
      setMode("login");
      await Swal.fire({
        icon: "success",
        title: "Password updated",
        text: "Sign in with your new password."
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Password reset failed",
        text: error.response?.data?.message || "Check the code and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const enterPasswordReset = () => {
    setResetEmail(email);
    setMode("request-reset");
  };

  return (
    <main className="login-page">
      <section className="login-showcase" aria-label="VolunteerConnect">
        <div className="login-showcase-content">
          <Link to="/" className="login-brand">
            <span className="login-brand-mark" aria-hidden="true"><FaHandsHelping /></span>
            <span>Volunteer<span>Connect</span></span>
          </Link>
          <div className="login-showcase-message">
            <p className="login-eyebrow">A little time can go a long way</p>
            <h1>Make room for good.</h1>
            <p>Find meaningful ways to help, meet people who care, and make a difference in your community.</p>
          </div>
          <p className="login-showcase-caption">Local opportunities. Lasting impact.</p>
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-form-wrap">
          <div className="login-heading">
            <p className="login-eyebrow">
              {mode === "login" ? "Welcome back" : "Account recovery"}
            </p>
            <h2 id="login-title">
              {mode === "login"
                ? "Sign in to your account"
                : mode === "request-reset"
                  ? "Reset your password"
                  : "Verify your email"}
            </h2>
            <p>
              {mode === "login"
                ? "Pick up where you left off and find your next way to help."
                : mode === "request-reset"
                  ? "We'll email you a code to securely reset your password."
                  : `Enter the 6-digit code sent to ${resetEmail} and choose a new password.`}
            </p>
          </div>

          {mode === "login" && (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <div className="login-input-wrap">
                <FaEnvelope className="login-input-icon" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <FaLock className="login-input-icon" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-visibility-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((isVisible) => !isVisible)}
                >
                  {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                </button>
              </div>
            </div>
            <div className="login-recovery-row">
              <button type="button" className="auth-text-button" onClick={enterPasswordReset}>
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
              {!isSubmitting && <FaArrowRight aria-hidden="true" />}
            </button>
          </form>
          )}

          {mode === "request-reset" && (
            <form className="login-form" onSubmit={handleRequestResetOtp}>
              <div className="login-field">
                <label htmlFor="reset-email">Email address</label>
                <div className="login-input-wrap">
                  <FaEnvelope className="login-input-icon" aria-hidden="true" />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending code..." : "Send reset code"}
                {!isSubmitting && <FaArrowRight aria-hidden="true" />}
              </button>

              <button type="button" className="auth-text-button auth-back-button" onClick={() => setMode("login")}>
                <FaArrowLeft aria-hidden="true" /> Back to sign in
              </button>
            </form>
          )}

          {mode === "reset" && (
            <form className="login-form" onSubmit={handleResetPassword}>
              <div className="login-field">
                <label htmlFor="reset-otp">Verification code</label>
                <div className="login-input-wrap">
                  <FaKey className="login-input-icon" aria-hidden="true" />
                  <input
                    id="reset-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="6-digit code"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                </div>
                <p className="otp-field-hint">The code is valid for 5 minutes.</p>
              </div>

              <div className="login-field">
                <label htmlFor="new-password">New password</label>
                <div className="login-input-wrap">
                  <FaLock className="login-input-icon" aria-hidden="true" />
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Choose a new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-visibility-toggle"
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    aria-pressed={showNewPassword}
                    onClick={() => setShowNewPassword((isVisible) => !isVisible)}
                  >
                    {showNewPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating password..." : "Reset password"}
                {!isSubmitting && <FaArrowRight aria-hidden="true" />}
              </button>

              <button type="button" className="auth-text-button auth-back-button" onClick={() => setMode("request-reset")}>
                <FaArrowLeft aria-hidden="true" /> Use a different email
              </button>
            </form>
          )}

          {mode === "login" && (
            <p className="login-register-prompt">
              New to VolunteerConnect? <Link to="/register">Create an account</Link>
            </p>
          )}

          <Link to="/" className="login-home-link">
            <FaArrowLeft aria-hidden="true" /> Back to home
          </Link>
        </div>
      </section>
    </main>
  );

};

export default Login;