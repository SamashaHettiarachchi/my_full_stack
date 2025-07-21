import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRocket,
  faUsers,
  faUserPlus,
  faChartLine,
  faShield,
  faMobile,
  faTachometerAlt,
  faCheck,
  faArrowRight,
  faSignInAlt,
  faCalendar,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faEdit,
  faTrash,
  faSpinner,
  faTriangleExclamation,
  faTimes,
  faPlus,
  faSave,
  faHome,
  faUser,
  faEye,
  faSearch,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "./IconDemo.css";

function IconDemo() {
  return (
    <div className="icon-demo-container">
      <div className="demo-header">
        <h1>
          <FontAwesomeIcon icon={faRocket} className="header-icon" />
          Font Awesome Integration Demo
        </h1>
        <p>Showcasing enhanced icons throughout the UserApp</p>
      </div>

      <div className="demo-section">
        <h2>
          <FontAwesomeIcon icon={faUsers} className="section-icon" />
          Navigation Icons
        </h2>
        <div className="icon-grid">
          <div className="icon-item">
            <FontAwesomeIcon icon={faHome} className="demo-icon primary-icon" />
            <span>Home</span>
          </div>
          <div className="icon-item">
            <FontAwesomeIcon
              icon={faUsers}
              className="demo-icon primary-icon"
            />
            <span>Users</span>
          </div>
          <div className="icon-item">
            <FontAwesomeIcon
              icon={faUserPlus}
              className="demo-icon primary-icon"
            />
            <span>Add User</span>
          </div>
          <div className="icon-item">
            <FontAwesomeIcon
              icon={faChartLine}
              className="demo-icon primary-icon"
            />
            <span>Analytics</span>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>
          <FontAwesomeIcon icon={faShield} className="section-icon" />
          Action Icons
        </h2>
        <div className="action-buttons">
          <button className="demo-btn primary">
            <FontAwesomeIcon icon={faSave} className="btn-icon" />
            Save Changes
          </button>
          <button className="demo-btn success">
            <FontAwesomeIcon icon={faCheck} className="btn-icon" />
            Confirm
          </button>
          <button className="demo-btn warning">
            <FontAwesomeIcon icon={faEdit} className="btn-icon" />
            Edit
          </button>
          <button className="demo-btn danger">
            <FontAwesomeIcon icon={faTrash} className="btn-icon" />
            Delete
          </button>
          <button className="demo-btn loading">
            <FontAwesomeIcon icon={faSpinner} spin className="btn-icon" />
            Loading...
          </button>
        </div>
      </div>

      <div className="demo-section">
        <h2>
          <FontAwesomeIcon icon={faMobile} className="section-icon" />
          Status Icons
        </h2>
        <div className="status-items">
          <div className="status-item success">
            <FontAwesomeIcon icon={faCheck} className="status-icon" />
            <span>Success Message</span>
          </div>
          <div className="status-item warning">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="status-icon"
            />
            <span>Warning Alert</span>
          </div>
          <div className="status-item error">
            <FontAwesomeIcon icon={faTimes} className="status-icon" />
            <span>Error Notification</span>
          </div>
          <div className="status-item info">
            <FontAwesomeIcon icon={faSpinner} spin className="status-icon" />
            <span>Loading State</span>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>
          <FontAwesomeIcon icon={faEnvelope} className="section-icon" />
          Contact Icons
        </h2>
        <div className="contact-grid">
          <div className="contact-item">
            <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
            <div>
              <span className="contact-label">Email</span>
              <span className="contact-value">info@userapp.com</span>
            </div>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faPhone} className="contact-icon" />
            <div>
              <span className="contact-label">Phone</span>
              <span className="contact-value">(555) 123-4567</span>
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

      <div className="demo-section">
        <h2>
          <FontAwesomeIcon icon={faFacebookF} className="section-icon" />
          Social Media Icons
        </h2>
        <div className="social-demo">
          <a href="#" className="social-link facebook">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="#" className="social-link twitter">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="#" className="social-link linkedin">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <a href="#" className="social-link instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="#" className="social-link github">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="#" className="social-link youtube">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </div>

      <div className="demo-section">
        <h2>
          <FontAwesomeIcon icon={faTachometerAlt} className="section-icon" />
          Performance Features
        </h2>
        <div className="feature-showcase">
          <div className="feature-item">
            <FontAwesomeIcon icon={faTachometerAlt} className="feature-icon" />
            <h3>Fast Performance</h3>
            <p>Lightning fast loading with optimized React components</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faShield} className="feature-icon" />
            <h3>Secure</h3>
            <p>Enterprise-grade security with JWT authentication</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faMobile} className="feature-icon" />
            <h3>Responsive</h3>
            <p>Beautiful design that works on all devices</p>
          </div>
        </div>
      </div>

      <div className="demo-footer">
        <p>
          <FontAwesomeIcon icon={faRocket} className="footer-icon" />
          Font Awesome integration complete! Your UserApp now features
          professional icons throughout.
        </p>
      </div>
    </div>
  );
}

export default IconDemo;
