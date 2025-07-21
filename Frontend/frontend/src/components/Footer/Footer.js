import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-waves">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
      <div className="footer-content">
        <div className="footer-section brand-section">
          <h3 className="brand-title">
            <span className="brand-icon">🚀</span>
            UserApp
          </h3>
          <p className="brand-description">
            Complete user management solution with modern design and powerful
            features. Streamline your workflow today.
          </p>
          <div className="social-icons">
            <a href="#" className="social-link" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="section-title">
            <span className="title-icon">📍</span>
            Quick Links
          </h4>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">
                <span className="link-icon">🏠</span>
                Home
              </Link>
            </li>
            <li>
              <Link to="/userdetails" className="footer-link">
                <span className="link-icon">👥</span>
                Users
              </Link>
            </li>
            <li>
              <Link to="/add-user" className="footer-link">
                <span className="link-icon">➕</span>
                Add User
              </Link>
            </li>
            <li>
              <Link to="/register" className="footer-link">
                <span className="link-icon">📝</span>
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="section-title">
            <span className="title-icon">🎯</span>
            Features
          </h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                <span className="link-icon">⚡</span>
                Fast Performance
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                <span className="link-icon">🔒</span>
                Secure Access
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                <span className="link-icon">📱</span>
                Mobile Ready
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                <span className="link-icon">🌙</span>
                Modern UI
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section contact-section">
          <h4 className="section-title">
            <span className="title-icon">📞</span>
            Get In Touch
          </h4>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <span className="contact-label">Email</span>
                <a href="mailto:info@userapp.com" className="contact-value">
                  info@userapp.com
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <div>
                <span className="contact-label">Phone</span>
                <a href="tel:+15551234567" className="contact-value">
                  (555) 123-4567
                </a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <span className="contact-label">Location</span>
                <span className="contact-value">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; 2025 <span className="brand-name">UserApp</span>. All rights
            reserved.
          </p>
          <div className="footer-links-inline">
            <a href="#" className="footer-link-inline">
              Privacy Policy
            </a>
            <span className="separator">|</span>
            <a href="#" className="footer-link-inline">
              Terms of Service
            </a>
            <span className="separator">|</span>
            <a href="#" className="footer-link-inline">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
