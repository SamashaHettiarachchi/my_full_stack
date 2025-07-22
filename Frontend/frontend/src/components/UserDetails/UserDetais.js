import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faEdit,
  faTrash,
  faPlus,
  faSearch,
  faUser,
  faEnvelope,
  faCalendar,
  faLocationDot,
  faTriangleExclamation,
  faSpinner,
  faSort,
  faSortUp,
  faSortDown,
  faFilter,
  faCalendarDays,
  faIdBadge,
} from "@fortawesome/free-solid-svg-icons";
import "./UserDetails.css";

// API Configuration
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://myfullstack-production.up.railway.app";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users when users, searchTerm, or sort options change
  useEffect(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.address &&
          user.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Enhanced sorting logic
    filtered.sort((a, b) => {
      let aVal, bVal;

      if (sortBy === "age") {
        aVal = parseInt(a[sortBy]) || 0;
        bVal = parseInt(b[sortBy]) || 0;
      } else if (sortBy === "createdAt") {
        // Use MongoDB ObjectId creation time or actual createdAt field
        aVal = new Date(a.createdAt || a._id);
        bVal = new Date(b.createdAt || b._id);
      } else {
        // String comparison for name, email, address
        aVal = (a[sortBy] || "").toLowerCase();
        bVal = (b[sortBy] || "").toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data:", data);
        setUsers(data.users || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Error connecting to server: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          alert("User deleted successfully!");
          fetchUsers(); // Refresh the list
        } else {
          const errorData = await response.json();
          alert(
            "Failed to delete user: " + (errorData.message || "Unknown error")
          );
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting user: " + error.message);
      }
    }
  };

  const editUser = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  if (loading)
    return (
      <div className="user-details-container">
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
          <span>Loading users...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="user-details-container">
        <div className="error">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="error-icon"
          />
          <h3>Error:</h3>
          <p>{error}</p>
          <button onClick={fetchUsers} className="retry-btn">
            <FontAwesomeIcon icon={faSpinner} />
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="user-details-container">
      <div className="header-section">
        <h2>
          <FontAwesomeIcon icon={faUsers} className="header-icon" />
          User Details
        </h2>
        <button onClick={fetchUsers} className="refresh-btn">
          <FontAwesomeIcon icon={faSpinner} />
          Refresh
        </button>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <div className="controls-section">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="search-clear-btn"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="sort-controls">
          <div className="sort-label">
            <FontAwesomeIcon icon={faFilter} className="sort-label-icon" />
            <span>Sort by:</span>
          </div>

          <div className="sort-dropdown-container">
            <FontAwesomeIcon icon={faSort} className="sort-dropdown-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">👤 Name (A-Z)</option>
              <option value="age">🎂 Age</option>
              <option value="email">📧 Email</option>
              <option value="address">📍 Address</option>
              <option value="createdAt">📅 Date Added</option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="sort-order-btn"
            title={`Currently sorting ${
              sortOrder === "asc" ? "ascending" : "descending"
            } - Click to ${sortOrder === "asc" ? "descend" : "ascend"}`}
          >
            <FontAwesomeIcon
              icon={sortOrder === "asc" ? faSortUp : faSortDown}
              className="sort-order-icon"
            />
            <span className="sort-order-text">
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </span>
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="no-users">
          <FontAwesomeIcon icon={faUser} className="no-users-icon" />
          <h3>No users found</h3>
          <p>Add some users to see them here!</p>
          <a href="/add-user" className="add-user-link">
            <FontAwesomeIcon icon={faPlus} />
            Add Your First User
          </a>
        </div>
      ) : (
        <>
          <div className="users-stats">
            <p>
              <FontAwesomeIcon icon={faUsers} className="stats-icon" />
              Total Users: <strong>{filteredUsers.length}</strong>
              {searchTerm && (
                <span className="search-info">
                  {" "}
                  (filtered from {users.length})
                </span>
              )}
            </p>
          </div>
          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <h3>
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    {user.name}
                  </h3>
                  <p>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="detail-icon"
                    />
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="detail-icon"
                    />
                    <strong>Age:</strong> {user.age}
                  </p>
                  <p>
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="detail-icon"
                    />
                    <strong>Address:</strong> {user.address}
                  </p>
                  {user.profilePicture && (
                    <div className="profile-picture-container">
                      <img
                        src={user.profilePicture}
                        alt={`${user.name}'s profile`}
                        className="profile-picture"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="user-actions">
                  <button
                    className="edit-btn"
                    onClick={() => editUser(user._id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
