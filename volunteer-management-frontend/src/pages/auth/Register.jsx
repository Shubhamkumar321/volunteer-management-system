import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaHandsHelping,
  FaKey,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaUser
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { registerUser, verifyRegistrationOtp } from "../../services/authService";
import { STATE_CITIES, STATES } from "../../data/locations";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    city: ""
  });
  const [selectedState, setSelectedState] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [step, setStep] = useState("details");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === "mobile"
      ? value.replace(/\D/g, "").slice(0, 10)
      : value;

    setFormData({
      ...formData,
      [name]: nextValue
    });

    if (name === "password" && passwordConfirmation) {
      setPasswordError(
        nextValue === passwordConfirmation ? "" : "Passwords do not match."
      );
    }
  };

  const handlePasswordConfirmationChange = (e) => {
    const value = e.target.value;
    setPasswordConfirmation(value);
    setPasswordError(
      value && value !== formData.password ? "Passwords do not match." : ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== passwordConfirmation) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser(formData);
      setStep("verify");
      await Swal.fire({
        icon: "info",
        title: "Check your email",
        text: `We sent a 6-digit verification code to ${formData.email}. It expires in 5 minutes.`
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Please check your details and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await verifyRegistrationOtp({
        email: formData.email,
        otp
      });
      login(response.data);
      await Swal.fire({
        icon: "success",
        title: "Email verified",
        text: "Your account is ready. Welcome to VolunteerConnect."
      });
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Verification failed",
        text: error.response?.data?.message || "Check the code and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page register-page">
      <section className="login-showcase" aria-label="VolunteerConnect">
        <div className="login-showcase-content">
          <Link to="/" className="login-brand">
            <span className="login-brand-mark" aria-hidden="true"><FaHandsHelping /></span>
            <span>Volunteer<span>Connect</span></span>
          </Link>
          <div className="login-showcase-message">
            <p className="login-eyebrow">Good starts with showing up</p>
            <h1>Find your people. Find your purpose.</h1>
            <p>Create your volunteer profile and discover local causes that matter to you.</p>
          </div>
          <p className="login-showcase-caption">Your next meaningful moment starts here.</p>
        </div>
      </section>

      <section className="login-panel register-panel" aria-labelledby="register-title">
        <div className="register-form-wrap">
          <div className="login-heading register-heading">
            <p className="login-eyebrow">
              {step === "details" ? "Join the community" : "One last step"}
            </p>
            <h2 id="register-title">
              {step === "details" ? "Create your account" : "Verify your email"}
            </h2>
            <p>
              {step === "details"
                ? "A few details to get you started."
                : `Enter the 6-digit code we sent to ${formData.email}.`}
            </p>
          </div>

          {step === "details" ? (
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="register-fields">
              <div className="login-field">
                <label htmlFor="register-name">Full name</label>
                <div className="login-input-wrap">
                  <FaUser className="login-input-icon" aria-hidden="true" />
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="register-email">Email address</label>
                <div className="login-input-wrap">
                  <FaEnvelope className="login-input-icon" aria-hidden="true" />
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="register-password">Password</label>
                <div className="login-input-wrap">
                  <FaLock className="login-input-icon" aria-hidden="true" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="login-field">
                <label htmlFor="register-password-confirmation">Confirm password</label>
                <div className="login-input-wrap">
                  <FaLock className="login-input-icon" aria-hidden="true" />
                  <input
                    id="register-password-confirmation"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={passwordConfirmation}
                    onChange={handlePasswordConfirmationChange}
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? "password-match-error" : undefined}
                    required
                  />
                </div>
                {passwordError && (
                  <p id="password-match-error" className="register-field-error" role="alert">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="login-field">
                <label htmlFor="register-mobile">Mobile number</label>
                <div className="login-input-wrap">
                  <FaPhone className="login-input-icon" aria-hidden="true" />
                  <input
                    id="register-mobile"
                    type="tel"
                    name="mobile"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{1,10}"
                    title="Enter up to 10 digits"
                    placeholder="Up to 10 digits"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="otp-field-hint">Enter up to 10 digits.</p>
              </div>

              <div className="login-field">
                <label htmlFor="register-state">State</label>
                <select
                  id="register-state"
                  className="form-select register-location-select"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setFormData({ ...formData, city: "" });
                  }}
                  required
                >
                  <option value="">Select state</option>
                  {STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="login-field register-city-field">
                <label htmlFor="register-city">City</label>
                <div className="register-location-wrap">
                  <FaMapMarkerAlt className="register-location-icon" aria-hidden="true" />
                  <select
                    id="register-city"
                    name="city"
                    className="form-select register-location-select register-city-select"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!selectedState}
                    required
                  >
                    <option value="">
                      {selectedState ? "Select city" : "Select a state first"}
                    </option>
                    {(STATE_CITIES[selectedState] || []).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              </div>

              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending verification code..." : "Continue"}
                {!isSubmitting && <FaArrowRight aria-hidden="true" />}
              </button>
            </form>
          ) : (
            <form className="login-form register-verify-form" onSubmit={handleVerifyOtp}>
              <div className="login-field">
                <label htmlFor="registration-otp">Verification code</label>
                <div className="login-input-wrap">
                  <FaKey className="login-input-icon" aria-hidden="true" />
                  <input
                    id="registration-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    aria-describedby="registration-otp-hint"
                    required
                  />
                </div>
                <p id="registration-otp-hint" className="otp-field-hint">
                  The code is valid for 5 minutes.
                </p>
              </div>

              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify email"}
                {!isSubmitting && <FaArrowRight aria-hidden="true" />}
              </button>

              <button
                type="button"
                className="auth-text-button"
                onClick={() => {
                  setStep("details");
                  setOtp("");
                }}
              >
                <FaArrowLeft aria-hidden="true" /> Edit registration details
              </button>
            </form>
          )}

          {step === "details" && (
            <p className="login-register-prompt register-login-prompt">
              Already have an account? <Link to="/login">Sign in</Link>
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

export default Register;