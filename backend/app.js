const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/UserRouter"); // 👈 match folder casing

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes);

// Optional root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// MongoDB connection + server start
mongoose
  .connect("mongodb+srv://admin:rxWab3GNPAvW8Rkh@cluster0.qip755s.mongodb.net/myAppDatabase") // 👈 add DB name
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
