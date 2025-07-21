import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        navigate("/login");
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditedUser({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        username: parsedUser.username || "",
        age: parsedUser.age || "",
        address: parsedUser.address || "",
        phone: parsedUser.phone || "",
        bio: parsedUser.bio || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading user profile:", error);
      navigate("/login");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editedUser.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!editedUser.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!editedUser.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editedUser.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!editedUser.username?.trim()) {
      newErrors.username = "Username is required";
    }

    if (
      editedUser.age &&
      (isNaN(editedUser.age) || editedUser.age < 1 || editedUser.age > 120)
    ) {
      newErrors.age = "Please enter a valid age between 1 and 120";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `http://localhost:5000/users/${user.id || user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedUser),
        }
      );

      if (response.ok) {
        const updatedUserData = await response.json();

        // Update localStorage with new user data
        const updatedUser = { ...user, ...editedUser };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ general: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      username: user.username || "",
      age: user.age || "",
      address: user.address || "",
      phone: user.phone || "",
      bio: user.bio || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // Handle account deletion logic here
      console.log("Delete account requested");
    }
  };

  const getMemberSince = () => {
    if (user.createdAt) {
      return new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
    return "Recently";
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner">
          <div className="banner-overlay"></div>
        </div>

        <div className="profile-info-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <span className="avatar-text">
                  {(
                    user.firstName?.[0] ||
                    user.username?.[0] ||
                    "U"
                  ).toUpperCase()}
                </span>
              )}
            </div>
            <button className="change-photo-btn">
              <span className="btn-icon">📷</span>
              Change Photo
            </button>
          </div>

          <div className="profile-title">
            <h1>
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username}
            </h1>
            <p className="profile-subtitle">@{user.username}</p>
            <p className="member-since">Member since {getMemberSince()}</p>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                <span className="btn-icon">✏️</span>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <span className="btn-icon">💾</span>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <span className="btn-icon">❌</span>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          Profile updated successfully!
        </div>
      )}

      {errors.general && (
        <div className="error-message">
          <span className="error-icon">❌</span>
          {errors.general}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-sections">
          {/* Personal Information Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">👤</span>
                Personal Information
              </h2>
            </div>

            <div className="section-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>First Name</label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="firstName"
                        value={editedUser.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? "error" : ""}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <span className="field-error">{errors.firstName}</span>
                      )}
                    </div>
                  ) : (
                    <p>{user.firstName || "Not provided"}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Last Name</label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="lastName"
                        value={editedUser.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? "error" : ""}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <span className="field-error">{errors.lastName}</span>
                      )}
                    </div>
                  ) : (
                    <p>{user.lastName || "Not provided"}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Username</label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="username"
                        value={editedUser.username}
                        onChange={handleInputChange}
                        className={errors.username ? "error" : ""}
                        placeholder="Enter your username"
                      />
                      {errors.username && (
                        <span className="field-error">{errors.username}</span>
                      )}
                    </div>
                  ) : (
                    <p>@{user.username}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Age</label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <input
                        type="number"
                        name="age"
                        value={editedUser.age}
                        onChange={handleInputChange}
                        className={errors.age ? "error" : ""}
                        placeholder="Enter your age"
                        min="1"
                        max="120"
                      />
                      {errors.age && (
                        <span className="field-error">{errors.age}</span>
                      )}
                    </div>
                  ) : (
                    <p>{user.age ? `${user.age} years old` : "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">📧</span>
                Contact Information
              </h2>
            </div>

            <div className="section-content">
              <div className="info-grid">
                <div className="info-item full-width">
                  <label>Email Address</label>
                  {isEditing ? (
                    <div className="input-wrapper">
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        className={errors.email ? "error" : ""}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <span className="field-error">{errors.email}</span>
                      )}
                    </div>
                  ) : (
                    <p>{user.email}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedUser.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p>{user.phone || "Not provided"}</p>
                  )}
                </div>

                <div className="info-item full-width">
                  <label>Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={editedUser.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      rows="2"
                    />
                  ) : (
                    <p>{user.address || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">📝</span>
                About Me
              </h2>
            </div>

            <div className="section-content">
              <div className="info-item full-width">
                <label>Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editedUser.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                ) : (
                  <p>
                    {user.bio ||
                      "No bio provided yet. Add a bio to tell others about yourself!"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div className="profile-section danger-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">⚙️</span>
                Account Settings
              </h2>
            </div>

            <div className="section-content">
              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>These actions cannot be undone. Please be careful.</p>
                <button
                  className="delete-account-btn"
                  onClick={handleDeleteAccount}
                >
                  <span className="btn-icon">🗑️</span>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
