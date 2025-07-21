import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to UserApp</h1>
        <p>A complete user management system built with React and Node.js</p>
        <div className="features">
          <div className="feature">
            <h3>👥 User Management</h3>
            <p>Add, view, edit, and delete users easily</p>
          </div>
          <div className="feature">
            <h3>🔐 Authentication</h3>
            <p>Secure login and registration system</p>
          </div>
          <div className="feature">
            <h3>📱 Responsive Design</h3>
            <p>Works perfectly on all devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
