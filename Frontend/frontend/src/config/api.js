// API Configuration
const config = {
  API_URL:
    process.env.REACT_APP_API_URL ||
    "https://myfullstack-production.up.railway.app",

  // API Endpoints
  endpoints: {
    // Auth endpoints
    login: "/users/login",
    register: "/users/register",

    // User endpoints
    users: "/users",
    userById: (id) => `/users/${id}`,

    // Analytics endpoints
    analytics: "/users/analytics/overview",
  },

  // Helper function to get full URL
  getApiUrl: (endpoint) => {
    return `${config.API_URL}${endpoint}`;
  },
};

export default config;
