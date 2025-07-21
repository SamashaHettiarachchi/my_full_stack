import React, { useState, useEffect } from "react";
import "./Nav.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Nav() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    setUser(null);
    setShowUserDropdown(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🚀</span>
          <span className="logo-text">UserApp</span>
        </Link>

        <div className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${isActiveLink("/") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </Link>

            <Link
              to="/userdetails"
              className={`nav-link ${
                isActiveLink("/userdetails") ? "active" : ""
              }`}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">👥</span>
              <span>Users</span>
            </Link>

            <Link
              to="/add-user"
              className={`nav-link ${
                isActiveLink("/add-user") ? "active" : ""
              }`}
              onClick={closeMobileMenu}
            >
              <span className="nav-icon">➕</span>
              <span>Add User</span>
            </Link>
          </div>

          <div className="nav-auth">
            {user ? (
              <div className="user-profile">
                <button
                  className="user-avatar"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <span className="avatar-icon">👤</span>
                  <span className="user-name">
                    {user.firstName || user.username}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {showUserDropdown && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <span className="user-full-name">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username}
                        </span>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <span className="dropdown-icon">⚙️</span>
                      Profile Settings
                    </Link>
                    <button
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <span className="dropdown-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link
                  to="/login"
                  className={`nav-btn login-btn ${
                    isActiveLink("/login") ? "active" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  <span className="btn-icon">🔑</span>
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`nav-btn register-btn ${
                    isActiveLink("/register") ? "active" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  <span className="btn-icon">📝</span>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </nav>
  );
}

export default Nav;
