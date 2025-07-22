import React, { useState, useEffect } from "react";
import "./Nav.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUser,
  faChartLine,
  faUsers,
  faUserPlus,
  faHome,
  faRocket,
  faCaretDown,
  faSignOutAlt,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";

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
          <FontAwesomeIcon icon={faRocket} className="logo-icon" />
          <span className="logo-text">UserApp</span>
        </Link>

        <div className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${isActiveLink("/") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span>Home</span>
            </Link>

            <Link
              to="/userdetails"
              className={`nav-link ${
                isActiveLink("/userdetails") ? "active" : ""
              }`}
              onClick={closeMobileMenu}
            >
              <FontAwesomeIcon icon={faUsers} className="nav-icon" />
              <span>Users</span>
            </Link>

            <Link
              to="/add-user"
              className={`nav-link ${
                isActiveLink("/add-user") ? "active" : ""
              }`}
              onClick={closeMobileMenu}
            >
              <FontAwesomeIcon icon={faUserPlus} className="nav-icon" />
              <span>Add User</span>
            </Link>

            <Link
              to="/analytics"
              className={`nav-link ${
                isActiveLink("/analytics") ? "active" : ""
              }`}
              onClick={closeMobileMenu}
            >
              <FontAwesomeIcon icon={faChartLine} className="nav-icon" />
              <span>Analytics</span>
            </Link>
          </div>

          <div className="nav-auth">
            {user ? (
              <div className="user-profile">
                <button
                  className="user-avatar"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="avatar-circle">
                    {user.firstName 
                      ? user.firstName.charAt(0).toUpperCase()
                      : user.username 
                        ? user.username.charAt(0).toUpperCase()
                        : user.name
                          ? user.name.charAt(0).toUpperCase()
                          : "U"
                    }
                  </div>
                  <span className="user-name">
                    {user.firstName || user.username || user.name}
                  </span>
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className="dropdown-arrow"
                  />
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
                      <FontAwesomeIcon
                        icon={faUser}
                        className="dropdown-icon"
                      />
                      Profile Settings
                    </Link>
                    <Link
                      to="/analytics"
                      className="dropdown-item"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <FontAwesomeIcon
                        icon={faChartLine}
                        className="dropdown-icon"
                      />
                      User Analytics
                    </Link>
                    <button
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className="dropdown-icon"
                      />
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
                  <FontAwesomeIcon icon={faSignInAlt} className="btn-icon" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`nav-btn register-btn ${
                    isActiveLink("/register") ? "active" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="btn-icon" />
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
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>
    </nav>
  );
}

export default Nav;
