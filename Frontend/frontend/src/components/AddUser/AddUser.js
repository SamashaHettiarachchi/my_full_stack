import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";

function AddUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    profilePicture: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!user.name.trim()) {
      newErrors.name = "Name is required";
    } else if (user.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!user.age) {
      newErrors.age = "Age is required";
    } else if (user.age < 1 || user.age > 120) {
      newErrors.age = "Age must be between 1 and 120";
    }

    if (!user.address.trim()) {
      newErrors.address = "Address is required";
    } else if (user.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    if (user.profilePicture && !isValidUrl(user.profilePicture)) {
      newErrors.profilePicture = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setShowSuccess(true);
        setUser({
          name: "",
          email: "",
          age: "",
          address: "",
          profilePicture: "",
        });

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || "Failed to add user" });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUser({
      name: "",
      email: "",
      age: "",
      address: "",
      profilePicture: "",
    });
    setErrors({});
  };

  return (
    <div className="add-user-page">
      <div className="add-user-container">
        <div className="form-header">
          <div className="header-content">
            <h2 className="page-title">
              <span className="title-icon">👤</span>
              Add New User
            </h2>
            <p className="page-subtitle">
              Fill in the details below to create a new user profile
            </p>
          </div>
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/userdetails")}
          >
            <span className="btn-icon">←</span>
            Back to Users
          </button>
        </div>

        {showSuccess && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <span>User added successfully!</span>
          </div>
        )}

        {errors.submit && (
          <div className="alert alert-error">
            <span className="alert-icon">❌</span>
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <span className="label-icon">📝</span>
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age" className="form-label">
                <span className="label-icon">🎂</span>
                Age *
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={user.age}
                onChange={handleChange}
                className={`form-input ${errors.age ? "error" : ""}`}
                placeholder="Enter age"
                min="1"
                max="120"
              />
              {errors.age && (
                <span className="error-message">{errors.age}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="profilePicture" className="form-label">
                <span className="label-icon">🖼️</span>
                Profile Picture URL
              </label>
              <input
                type="url"
                id="profilePicture"
                name="profilePicture"
                value={user.profilePicture}
                onChange={handleChange}
                className={`form-input ${errors.profilePicture ? "error" : ""}`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.profilePicture && (
                <span className="error-message">{errors.profilePicture}</span>
              )}
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="address" className="form-label">
              <span className="label-icon">📍</span>
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={user.address}
              onChange={handleChange}
              className={`form-textarea ${errors.address ? "error" : ""}`}
              placeholder="Enter full address including city, state, and postal code"
              rows="4"
            />
            {errors.address && (
              <span className="error-message">{errors.address}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={isLoading}
            >
              <span className="btn-icon">🔄</span>
              Reset Form
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="btn-icon">➕</span>
                  Add User
                </>
              )}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p className="footer-text">
            * Required fields. Make sure all information is accurate before
            submitting.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
