import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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

    // Calculate password strength
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Medium";
      case 4:
      case 5:
        return "Strong";
      default:
        return "Weak";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "#e74c3c";
      case 2:
      case 3:
        return "#f39c12";
      case 4:
      case 5:
        return "#27ae60";
      default:
        return "#e74c3c";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

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

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setShowSuccess(true);

        // Redirect after showing success message
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setServerError(data.message || "Registration failed");
        if (data.errors && Array.isArray(data.errors)) {
          setServerError(data.errors.join(", "));
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-shape shape-4"></div>
      </div>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="header-icon">
              <span className="icon-circle">🚀</span>
            </div>
            <h2 className="register-title">Join UserApp</h2>
            <p className="register-subtitle">
              Create your account and start managing users efficiently
            </p>
          </div>

          {showSuccess && (
            <div className="alert alert-success">
              <span className="alert-icon">🎉</span>
              <span>Account created successfully! Welcome to UserApp!</span>
            </div>
          )}

          {serverError && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  <span className="label-icon">👤</span>
                  First Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? "error" : ""}`}
                    placeholder="Enter first name"
                    autoComplete="given-name"
                  />
                  <div className="input-focus-effect"></div>
                </div>
                {errors.firstName && (
                  <span className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  <span className="label-icon">👤</span>
                  Last Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? "error" : ""}`}
                    placeholder="Enter last name"
                    autoComplete="family-name"
                  />
                  <div className="input-focus-effect"></div>
                </div>
                {errors.lastName && (
                  <span className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <span className="label-icon">@</span>
                Username
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? "error" : ""}`}
                  placeholder="Choose a unique username"
                  autoComplete="username"
                />
                <div className="input-focus-effect"></div>
              </div>
              {errors.username && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.username}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <div className="input-wrapper">
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
                  <span className="error-icon">⚠️</span>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  <span>{showPassword ? "🙈" : "👁️"}</span>
                </button>
                <div className="input-focus-effect"></div>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    ></div>
                  </div>
                  <span
                    className="strength-text"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
              {errors.password && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <span className="label-icon">🔐</span>
                Confirm Password
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.confirmPassword ? "error" : ""
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  <span>{showConfirmPassword ? "🙈" : "👁️"}</span>
                </button>
                <div className="input-focus-effect"></div>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`register-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="register-footer">
            <p className="login-text">
              Already have an account?
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
            <div className="divider">
              <span className="divider-text">or continue with</span>
            </div>
            <div className="social-buttons">
              <button className="social-btn google-btn" type="button">
                <span className="social-icon">🔵</span>
                Google
              </button>
              <button className="social-btn github-btn" type="button">
                <span className="social-icon">⚫</span>
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
