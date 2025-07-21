import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSignInAlt,
  faSpinner,
  faCheck,
  faExclamationTriangle,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        setShowSuccess(true);

        // Redirect after showing success message
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setServerError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="header-icon">
              <span className="icon-circle">🔐</span>
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">
              Sign in to your account to continue your journey
            </p>
          </div>

          {showSuccess && (
            <div className="alert alert-success">
              <FontAwesomeIcon icon={faCheck} className="alert-icon" />
              <span>Login successful! Redirecting...</span>
            </div>
          )}

          {serverError && (
            <div className="alert alert-error">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="alert-icon"
              />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FontAwesomeIcon icon={faEnvelope} className="label-icon" />
                Email Address
              </label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                <div className="input-focus-effect"></div>
              </div>
              {errors.email && (
                <span className="error-message">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="error-icon"
                  />
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FontAwesomeIcon icon={faLock} className="label-icon" />
                Password
              </label>
              <div className="input-wrapper password-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
                <div className="input-focus-effect"></div>
              </div>
              {errors.password && (
                <span className="error-message">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="error-icon"
                  />
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`login-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="btn-icon" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSignInAlt} className="btn-icon" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="signup-text">
              Don't have an account?
              <Link to="/register" className="signup-link">
                <FontAwesomeIcon icon={faUserPlus} className="link-icon" />
                Create one here
              </Link>
            </p>
            <div className="divider">
             
            </div>
            <div className="social-buttons">
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
