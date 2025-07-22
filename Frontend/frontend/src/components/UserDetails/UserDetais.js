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
  faUserShield,
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
  const [currentUser, setCurrentUser] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserPermissions();
  }, []);

  const checkUserPermissions = () => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(userData);
      setCurrentUser(user);

      // SIMPLE PERMISSION SYSTEM - Choose ONE option:
      
      // OPTION 1: Add YOUR email here to become admin
      const adminEmails = [
        'admin@test.com',               // Test admin account
        'your-actual-email@gmail.com',  // Replace with your real email
        'admin@example.com',
        'superuser@company.com'
      ];
      const allowFullAccess = adminEmails.includes(user.email);
      
      // OPTION 2: Everyone gets full access (No Privacy)
      // const allowFullAccess = true;
      
      // OPTION 3: No one gets full access (Maximum Privacy)
      // const allowFullAccess = false;
      
      console.log('Current user:', user.email);
      console.log('Full access granted:', allowFullAccess);
      
      setHasAdminAccess(allowFullAccess);

      if (allowFullAccess) {
        console.log('✅ Loading FULL user details');
        fetchUsers(); // Shows everything
      } else {
        console.log('🔒 Loading LIMITED user details for privacy');
        fetchPublicUsers(); // Hides sensitive info
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      navigate("/login");
    }
  };

  // Filter and sort users when users, searchTerm, or sort options change
  useEffect(() => {
    // Add null/undefined checks
    const validUsers = users.filter(user => user && typeof user === 'object');
    
    let filtered = validUsers.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Enhanced sorting logic with null checks
    filtered.sort((a, b) => {
      let aVal, bVal;

      if (sortBy === "age") {
        aVal = parseInt(a[sortBy]) || 0;
        bVal = parseInt(b[sortBy]) || 0;
      } else if (sortBy === "createdAt") {
        // Use MongoDB ObjectId creation time or actual createdAt field
        aVal = new Date(a.createdAt || a._id || 0);
        bVal = new Date(b.createdAt || b._id || 0);
      } else {
        // String comparison for name, email, address with null checks
        aVal = (a[sortBy] || "").toString().toLowerCase();
        bVal = (b[sortBy] || "").toString().toLowerCase();
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

      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data:", data);
        // Ensure we have valid user data
        const validUsers = (data.users || []).filter(user => user && typeof user === 'object');
        setUsers(validUsers);
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      
      // First try the public endpoint
      try {
        const response = await fetch(`${API_URL}/users/public`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Only show limited public information
          const publicUsers = (data.users || []).map(user => ({
            _id: user._id,
            name: user.name || "Unknown User",
            username: user.username || "unknown",
            // Hide sensitive information
            email: "***@***.***",
            age: "Private",
            address: "Private",
            phone: "Private",
          }));
          setUsers(publicUsers);
        } else {
          throw new Error("Public endpoint not available");
        }
      } catch (publicError) {
        console.log("Public endpoint not available, showing limited data");
        
        // Fallback: Fetch regular users but filter the data
        const response = await fetch(`${API_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter to show only public information
          const publicUsers = (data.users || []).map(user => ({
            _id: user._id || user.id,
            name: user.name || "Unknown User",
            username: user.username || "unknown",
            // Hide sensitive information for privacy
            email: "***@***.***",
            age: "Private",
            address: "Private", 
            phone: "Private",
          }));
          setUsers(publicUsers);
        } else {
          // Final fallback: show only current user
          if (currentUser) {
            setUsers([{
              _id: currentUser._id || currentUser.id,
              name: currentUser.name || "Your Profile",
              username: currentUser.username || "you",
              email: "***@***.***",
              age: "Private",
              address: "Private",
              phone: "Private",
            }]);
          } else {
            setUsers([]);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching public users:", err);
      // Final fallback: show only current user or empty
      if (currentUser) {
        setUsers([{
          _id: currentUser._id || currentUser.id,
          name: currentUser.name || "Your Profile", 
          username: currentUser.username || "you",
          email: "***@***.***",
          age: "Private",
          address: "Private",
          phone: "Private",
        }]);
      } else {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!hasAdminAccess) {
      alert("You don't have permission to delete users.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          alert("User deleted successfully!");
          hasAdminAccess ? fetchUsers() : fetchPublicUsers(); // Refresh the list
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
    if (!hasAdminAccess) {
      alert("You don't have permission to edit other users.");
      return;
    }
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
          <button onClick={hasAdminAccess ? fetchUsers : fetchPublicUsers} className="retry-btn">
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
        <button onClick={hasAdminAccess ? fetchUsers : fetchPublicUsers} className="refresh-btn">
          <FontAwesomeIcon icon={faSpinner} />
          Refresh
        </button>
      </div>

      {/* Access Level Indicator */}
      <div className={`access-notice ${hasAdminAccess ? 'admin' : 'user'}`}>
        <FontAwesomeIcon 
          icon={hasAdminAccess ? faUserShield : faUser} 
          className="access-icon" 
        />
        <div className="access-info">
          <strong>Access Level: {hasAdminAccess ? 'Administrator' : 'Standard User'}</strong>
          <p>
            {hasAdminAccess 
              ? 'You can view all user details and perform admin actions.'
              : 'You can only view limited public information for privacy protection.'
            }
          </p>
        </div>
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
            {filteredUsers.map((user) => {
              // Safety check for user data
              if (!user || !user._id) {
                return null;
              }
              
              return (
                <div key={user._id} className="user-card">
                  <div className="user-info">
                    <h3>
                      <FontAwesomeIcon icon={faUser} className="user-icon" />
                      {user.name || "Unknown User"}
                    </h3>
                    <p>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="detail-icon"
                      />
                      <strong>Email:</strong> {user.email || "Not provided"}
                    </p>
                    <p>
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="detail-icon"
                      />
                      <strong>Age:</strong> {user.age || "Not provided"}
                    </p>
                    <p>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="detail-icon"
                      />
                      <strong>Address:</strong> {user.address || "Not provided"}
                    </p>
                    {user.profilePicture && (
                      <div className="profile-picture-container">
                        <img
                          src={user.profilePicture}
                          alt={`${user.name || "User"}'s profile`}
                          className="profile-picture"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {hasAdminAccess && (
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
                  )}
                </div>
              );
            }).filter(Boolean)} {/* Remove null elements */}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
