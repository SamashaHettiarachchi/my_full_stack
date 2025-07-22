const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/UserRouter"); // 👈 match folder casing

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

// Middleware
app.use(express.json());

// Flexible CORS configuration for development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow any localhost port during development
    if (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("https://localhost:")
    ) {
      return callback(null, true);
    }

    // Production and development allowed origins
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001", 
      "http://localhost:3003",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3003",
      // Add your production frontend URL here after deployment
      process.env.FRONTEND_URL,
      // Common Render.com pattern (update with your actual URL)
      "https://your-frontend-app.onrender.com"
    ].filter(Boolean); // Remove undefined values

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Add logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use("/users", userRoutes);

// Optional root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// MongoDB connection + server start
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb+srv://admin:rxWab3GNPAvW8Rkh@cluster0.qip755s.mongodb.net/myAppDatabase"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
