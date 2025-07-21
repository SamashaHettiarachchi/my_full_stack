import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faChartLine,
  faChartBar,
  faChartPie,
  faUserClock,
  faCalendarDay,
  faCalendarWeek,
  faCalendarAlt,
  faCircle,
  faBirthdayCake,
  faSpinner,
  faExclamationTriangle,
  faSync,
  faEdit,
  faEye,
  faTrendingUp,
  faTrendingDown,
} from "@fortawesome/free-solid-svg-icons";
import "./UserAnalytics.css";

const UserAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    activeUsers: 0,
    averageAge: 0,
    growthRate: 0,
    userGrowthData: [],
    recentUsers: [],
    usersByAge: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setAnalytics((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Fetch analytics data from dedicated endpoint
        const response = await fetch(
          "http://localhost:5000/users/analytics/overview",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Process the received data
        const processedAnalytics = {
          totalUsers: data.overview.totalUsers,
          newUsersToday: data.overview.newUsersToday || 0,
          newUsersThisWeek: data.overview.newUsersLast7Days,
          newUsersThisMonth: data.overview.newUsersLast30Days,
          activeUsers: data.overview.newUsersLast7Days, // Using weekly as active proxy
          averageAge: data.overview.averageAge,
          growthRate: data.overview.growthRate,
          userGrowthData: processGrowthData(data.dailyRegistrations),
          recentUsers: data.recentUsers.map((user) => ({
            id: user._id,
            name:
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username || user.name || "Unknown User",
            email: user.email,
            joinDate: user.createdAt || user._id,
            avatar: user.profilePicture || null,
          })),
          usersByAge: data.ageGroups.reduce((acc, group) => {
            acc[group._id] = group.count;
            return acc;
          }, {}),
          loading: false,
          error: null,
        };

        setAnalytics(processedAnalytics);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setAnalytics((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to fetch analytics data",
        }));
      }
    };

    fetchData();
  }, []);

  const processGrowthData = (dailyData) => {
    if (!dailyData || dailyData.length === 0) return [];

    return dailyData.slice(-7).map((day) => ({
      label: new Date(day._id).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      users: day.count,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (analytics.loading) {
    return (
      <div className="analytics-container">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faSpinner} spin className="spinner-icon" />
          <h3>Loading Analytics...</h3>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (analytics.error) {
    return (
      <div className="analytics-container">
        <div className="error-message">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="error-icon"
          />
          <h3>Error Loading Analytics</h3>
          <p>{analytics.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            <FontAwesomeIcon icon={faSync} className="retry-icon" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>
          <FontAwesomeIcon icon={faChartLine} className="header-icon" />
          User Analytics Dashboard
        </h1>
        <p>Real-time insights from your user database</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card total-users">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="metric-content">
            <h3>{analytics.totalUsers}</h3>
            <p>Total Users</p>
            <span
              className={`metric-growth ${
                analytics.growthRate >= 0 ? "positive" : "negative"
              }`}
            >
              <FontAwesomeIcon
                icon={analytics.growthRate >= 0 ? faTrendingUp : faTrendingDown}
                className="growth-icon"
              />
              {analytics.growthRate >= 0 ? "+" : ""}
              {analytics.growthRate}% growth
            </span>
          </div>
        </div>

        <div className="metric-card new-today">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
          <div className="metric-content">
            <h3>{analytics.newUsersThisMonth}</h3>
            <p>New This Month</p>
            <span className="metric-detail">
              <FontAwesomeIcon icon={faCalendarWeek} className="detail-icon" />
              {analytics.newUsersThisWeek} this week
            </span>
          </div>
        </div>

        <div className="metric-card active-users">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faUserClock} />
          </div>
          <div className="metric-content">
            <h3>{analytics.activeUsers}</h3>
            <p>Recent Activity</p>
            <span className="metric-detail">
              <FontAwesomeIcon icon={faCalendarWeek} className="detail-icon" />
              Last 7 days
            </span>
          </div>
        </div>

        <div className="metric-card average-age">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faBirthdayCake} />
          </div>
          <div className="metric-content">
            <h3>{analytics.averageAge}</h3>
            <p>Average Age</p>
            <span className="metric-detail">Years old</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>
            <FontAwesomeIcon icon={faChartBar} className="chart-icon" />
            User Growth Over Time
          </h3>
          {analytics.userGrowthData.length > 0 ? (
            <div className="simple-chart">
              {analytics.userGrowthData.map((point, index) => (
                <div key={index} className="chart-bar">
                  <div
                    className="bar"
                    style={{
                      height: `${
                        (point.users /
                          Math.max(
                            ...analytics.userGrowthData.map((p) => p.users)
                          )) *
                        100
                      }%`,
                    }}
                    title={`${point.label}: ${point.users} users`}
                  ></div>
                  <span className="bar-label">{point.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <FontAwesomeIcon icon={faChartLine} className="no-data-icon" />
              <p>No growth data available yet</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h3>
            <FontAwesomeIcon icon={faChartPie} className="chart-icon" />
            User Demographics
          </h3>
          {Object.keys(analytics.usersByAge).length > 0 ? (
            <div className="age-distribution">
              {Object.entries(analytics.usersByAge).map(([ageGroup, count]) => (
                <div key={ageGroup} className="age-bar">
                  <span className="age-label">{ageGroup}</span>
                  <div className="age-bar-container">
                    <div
                      className="age-bar-fill"
                      style={{
                        width: `${
                          (count /
                            Math.max(...Object.values(analytics.usersByAge))) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="age-count">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <FontAwesomeIcon icon={faUsers} className="no-data-icon" />
              <p>No demographic data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="recent-users-section">
        <h3>
          <FontAwesomeIcon icon={faUsers} className="section-icon" />
          Recent Users
        </h3>
        {analytics.recentUsers.length > 0 ? (
          <div className="recent-users-grid">
            {analytics.recentUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span className="avatar-initials">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <span className="join-date">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="date-icon"
                    />
                    Joined {formatDate(user.joinDate)}
                  </span>
                </div>
                <div className="user-actions">
                  <Link
                    to={`/edit-user/${user.id}`}
                    className="user-action edit"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <Link to={`/user/${user.id}`} className="user-action view">
                    <FontAwesomeIcon icon={faEye} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <FontAwesomeIcon icon={faUsers} className="no-data-icon" />
            <p>No recent users available</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>
          <FontAwesomeIcon icon={faUserPlus} className="section-icon" />
          Quick Actions
        </h3>
        <div className="action-buttons">
          <Link to="/add-user" className="action-btn primary">
            <FontAwesomeIcon icon={faUserPlus} className="btn-icon" />
            Add New User
          </Link>
          <Link to="/userdetails" className="action-btn secondary">
            <FontAwesomeIcon icon={faUsers} className="btn-icon" />
            Manage Users
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="action-btn outline"
          >
            <FontAwesomeIcon icon={faSync} className="btn-icon" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
