import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Fetch some stats (mock for now)
    setStats({
      totalUsers: 150,
      newUsersToday: 12,
      activeUsers: 89,
    });
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand-highlight">UserApp</span>
            </h1>
            <p className="hero-subtitle">
              A modern, secure, and scalable user management platform built with
              cutting-edge technologies
            </p>

            {user ? (
              <div className="welcome-back">
                <h2>Welcome back, {user.firstName}! 👋</h2>
                <p>Ready to manage your users?</p>
                <div className="action-buttons">
                  <Link to="/userdetails" className="btn btn-primary">
                    <i className="icon">👥</i>
                    View All Users
                  </Link>
                  <Link to="/add-user" className="btn btn-secondary">
                    <i className="icon">➕</i>
                    Add New User
                  </Link>
                </div>
              </div>
            ) : (
              <div className="cta-section">
                <p className="cta-text">
                  Get started today and experience the future of user management
                </p>
                <div className="action-buttons">
                  <Link to="/register" className="btn btn-primary">
                    <i className="icon">🚀</i>
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn btn-outline">
                    <i className="icon">🔐</i>
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="hero-visual">
            <div className="floating-cards">
              <div className="floating-card card-1">
                <div className="card-icon">👤</div>
                <div className="card-text">User Profiles</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">🔒</div>
                <div className="card-text">Secure Auth</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">�</div>
                <div className="card-text">Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{stats.totalUsers}+</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✨</div>
            <div className="stat-number">{stats.newUsersToday}</div>
            <div className="stat-label">New Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🟢</div>
            <div className="stat-number">{stats.activeUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart User Management</h3>
              <p>
                Efficiently manage user profiles with advanced search,
                filtering, and bulk operations
              </p>
              <Link to="/userdetails" className="feature-link">
                Explore Users →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Enterprise Security</h3>
              <p>
                Bank-level security with JWT authentication, password
                encryption, and session management
              </p>
              <Link to="/login" className="feature-link">
                Secure Login →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>
                Beautiful, mobile-first design that works seamlessly across all
                devices and screen sizes
              </p>
              <span className="feature-link">Try it out →</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>
                Built with modern React and optimized for performance with
                instant loading and smooth interactions
              </p>
              <span className="feature-link">Experience Speed →</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-bottom-section">
        <div className="cta-content">
          <h2>Ready to get started?</h2>
          <p>
            Join thousands of users who trust UserApp for their user management
            needs
          </p>
          {!user && (
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Start Free Trial
              </Link>
              <Link to="/userdetails" className="btn btn-outline btn-large">
                View Demo
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
