import React, { useState, useEffect } from "react";
import "./UserDetails.css";

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      setError("Error fetching users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("User deleted successfully!");
          fetchUsers(); // Refresh the list
        } else {
          alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error deleting user");
      }
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-details-container">
      <h2>User Details</h2>
      {users.length === 0 ? (
        <p className="no-users">
          No users found. Add some users to see them here!
        </p>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Age:</strong> {user.age}
                </p>
                <p>
                  <strong>Address:</strong> {user.address}
                </p>
                {user.profilePicture && (
                  <img
                    src={user.profilePicture}
                    alt={`${user.name}'s profile`}
                    className="profile-picture"
                  />
                )}
              </div>
              <div className="user-actions">
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDetails;
