import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faRocket,
  faUsers,
  faUserPlus,
  faSignInAlt,
  faShield,
  faMobile,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
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
            <FontAwesomeIcon icon={faRocket} className="brand-icon" />
            UserApp
          </h3>
          <p className="brand-description">
            Complete user management solution with modern design and powerful
            features. Streamline your workflow today.
          </p>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              className="social-link"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://twitter.com"
              className="social-link"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              href="https://linkedin.com"
              className="social-link"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a
              href="https://instagram.com"
              className="social-link"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://github.com"
              className="social-link"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
              href="https://youtube.com"
              className="social-link"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="section-title">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="title-icon" />
            Quick Links
          </h4>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">
                <FontAwesomeIcon icon={faRocket} className="link-icon" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/userdetails" className="footer-link">
                <FontAwesomeIcon icon={faUsers} className="link-icon" />
                Users
              </Link>
            </li>
            <li>
              <Link to="/add-user" className="footer-link">
                <FontAwesomeIcon icon={faUserPlus} className="link-icon" />
                Add User
              </Link>
            </li>
            <li>
              <Link to="/register" className="footer-link">
                <FontAwesomeIcon icon={faSignInAlt} className="link-icon" />
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="section-title">
            <FontAwesomeIcon icon={faTachometerAlt} className="title-icon" />
            Features
          </h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                <FontAwesomeIcon icon={faTachometerAlt} className="link-icon" />
                Fast Performance
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                <FontAwesomeIcon icon={faShield} className="link-icon" />
                Secure Access
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                <FontAwesomeIcon icon={faMobile} className="link-icon" />
                Mobile Ready
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                <FontAwesomeIcon icon={faRocket} className="link-icon" />
                Modern UI
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section contact-section">
          <h4 className="section-title">
            <FontAwesomeIcon icon={faPhone} className="title-icon" />
            Get In Touch
          </h4>
          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
              <div>
                <span className="contact-label">Email</span>
                <a href="mailto:info@userapp.com" className="contact-value">
                  info@userapp.com
                </a>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} className="contact-icon" />
              <div>
                <span className="contact-label">Phone</span>
                <a href="tel:+15551234567" className="contact-value">
                  (555) 123-4567
                </a>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
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
