import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditUser.css";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    profilePicture: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await fetch(`http://localhost:5000/users/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched user data:", data);

      if (data.user) {
        setUser({
          name: data.user.name || "",
          email: data.user.email || "",
          age: data.user.age || "",
          address: data.user.address || "",
          profilePicture: data.user.profilePicture || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setServerError(`Failed to fetch user details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setServerError("");

      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("User updated successfully:", data);

      setShowSuccess(true);

      // Navigate back after showing success message
      setTimeout(() => {
        navigate("/userdetails");
      }, 2000);
    } catch (error) {
      console.error("Error updating user:", error);
      setServerError(error.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/userdetails");
  };

  const handleReset = () => {
    fetchUser(); // Reload original data
  };

  if (loading) {
    return (
      <div className="edit-user-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-circle"></div>
          </div>
          <p className="loading-text">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-user-page">
      <div className="edit-user-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="edit-user-container">
        <div className="edit-user-card">
          <div className="edit-header">
            <div className="header-content">
              <h2 className="page-title">
                <span className="title-icon">✏️</span>
                Edit User Details
              </h2>
              <p className="page-subtitle">
                Update user information and save changes
              </p>
            </div>
            <button type="button" className="back-btn" onClick={handleCancel}>
              <span className="btn-icon">←</span>
              Back to Users
            </button>
          </div>

          {showSuccess && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span>User updated successfully! Redirecting...</span>
            </div>
          )}

          {serverError && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="edit-user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span className="label-icon">📝</span>
                  Full Name *
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? "error" : ""}`}
                    placeholder="Enter full name"
                  />
                  <div className="input-focus-effect"></div>
                </div>
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="label-icon">📧</span>
                  Email Address *
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? "error" : ""}`}
                    placeholder="Enter email address"
                  />
                  <div className="input-focus-effect"></div>
                </div>
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
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={user.age}
                    onChange={handleInputChange}
                    className={`form-input ${errors.age ? "error" : ""}`}
                    placeholder="Enter age"
                    min="1"
                    max="120"
                  />
                  <div className="input-focus-effect"></div>
                </div>
                {errors.age && (
                  <span className="error-message">{errors.age}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="profilePicture" className="form-label">
                  <span className="label-icon">🖼️</span>
                  Profile Picture URL
                </label>
                <div className="input-wrapper">
                  <input
                    type="url"
                    id="profilePicture"
                    name="profilePicture"
                    value={user.profilePicture}
                    onChange={handleInputChange}
                    className={`form-input ${
                      errors.profilePicture ? "error" : ""
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="input-focus-effect"></div>
                </div>
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
              <div className="input-wrapper">
                <textarea
                  id="address"
                  name="address"
                  value={user.address}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.address ? "error" : ""}`}
                  placeholder="Enter full address including city, state, and postal code"
                  rows="4"
                />
                <div className="input-focus-effect"></div>
              </div>
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={saving}
              >
                <span className="btn-icon">🔄</span>
                Reset Changes
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancel}
                disabled={saving}
              >
                <span className="btn-icon">❌</span>
                Cancel
              </button>

              <button
                type="submit"
                className={`btn btn-primary ${saving ? "loading" : ""}`}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">💾</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="form-footer">
            <p className="footer-text">
              * Required fields. All changes will be saved to the database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
