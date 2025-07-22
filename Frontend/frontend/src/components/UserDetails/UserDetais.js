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
} from "@fortawesome/free-solid-svg-icons";
import "./UserDetails.css";

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || "https://myfullstack-production.up.railway.app";

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
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort users
    filtered.sort((a, b) => {
      let aVal = sortBy === 'age' ? parseInt(a[sortBy]) : a[sortBy].toLowerCase();
      let bVal = sortBy === 'age' ? parseInt(b[sortBy]) : b[sortBy].toLowerCase();
      
      if (sortOrder === 'asc') {
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

      {/* Search and Filter Controls */}
      <div className="controls-section">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="age">Sort by Age</option>
            <option value="email">Sort by Email</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
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
                <span className="search-info"> (filtered from {users.length})</span>
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
}

export default UserDetails;
