const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// POST /users/register
const register = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName: firstName || "",
      lastName: lastName || "",
      name: firstName && lastName ? `${firstName} ${lastName}` : username,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      token,
    });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({
      message: "Failed to register user",
      error: err.message,
    });
  }
};

// POST /users/login
const login = async (req, res) => {
  const { email, emailOrUsername, password } = req.body;

  try {
    // Support both direct email and emailOrUsername fields
    const loginField = email || emailOrUsername;

    if (!loginField || !password) {
      return res
        .status(400)
        .json({ message: "Email/username and password are required" });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: loginField }, { username: loginField }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email/username or password" });
    }

    // Check if user has a password (some older users might not have one)
    if (!user.password) {
      return res
        .status(401)
        .json({
          message:
            "Account requires password setup. Please contact administrator.",
        });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid email/username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({
      message: "Failed to login",
      error: err.message,
    });
  }
};

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

// POST /users
const addUser = async (req, res) => {
  const { name, email, age, address, profilePicture } = req.body;

  try {
    // Generate username from email if not provided
    const username = email ? email.split("@")[0] : `user_${Date.now()}`;

    // Generate a default password (in production, you'd want to handle this differently)
    const defaultPassword = "tempPassword123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = new User({
      name,
      email,
      age,
      address,
      profilePicture,
      username: username,
      password: hashedPassword,
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch (err) {
    console.error("Error saving user:", err);
    return res
      .status(500)
      .json({ message: "Failed to add user", error: err.message });
  }
};

// GET /users/:id
const getById = async (req, res) => {
  const id = req.params.id;

  // Validate ObjectId format before querying
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      message: "Invalid user ID format",
      error: "ID must be a valid 24-character hex string",
    });
  }

  try {
    const user = await User.findById(id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    email,
    age,
    address,
    profilePicture,
    firstName,
    lastName,
    username,
    phone,
    bio,
  } = req.body;

  try {
    // Prepare update object with all possible fields
    const updateData = {};

    // Legacy fields
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (address !== undefined) updateData.address = address;
    if (profilePicture !== undefined)
      updateData.profilePicture = profilePicture;

    // New profile fields
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (username !== undefined) updateData.username = username;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res
      .status(200)
      .json({ message: "User updated successfully", user: userResponse });
  } catch (err) {
    console.error("Error updating user:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message: `${field} already exists`,
      });
    }

    return res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully", user });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};

// GET /users/analytics/overview
const getAnalyticsOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    // Calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

    // Get users registered in different time periods
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const newUsersLast7Days = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    // Calculate growth rates
    const previousMonth = new Date(now - 60 * 24 * 60 * 60 * 1000);
    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: previousMonth, $lt: thirtyDaysAgo },
    });

    const growthRate =
      usersLastMonth > 0
        ? (
            ((newUsersLast30Days - usersLastMonth) / usersLastMonth) *
            100
          ).toFixed(1)
        : 100;

    // Get users by age groups
    const ageGroups = await User.aggregate([
      {
        $match: { age: { $exists: true, $ne: null } },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$age", 18] }, then: "Under 18" },
                { case: { $lte: ["$age", 25] }, then: "18-25" },
                { case: { $lte: ["$age", 35] }, then: "26-35" },
                { case: { $lte: ["$age", 45] }, then: "36-45" },
                { case: { $lte: ["$age", 55] }, then: "46-55" },
                { case: { $gt: ["$age", 55] }, then: "55+" },
              ],
              default: "Unknown",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get recent users
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get daily user registrations for the last 30 days
    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Calculate average age
    const avgAgeResult = await User.aggregate([
      {
        $match: { age: { $exists: true, $ne: null } },
      },
      {
        $group: {
          _id: null,
          averageAge: { $avg: "$age" },
        },
      },
    ]);

    const averageAge =
      avgAgeResult.length > 0 ? Math.round(avgAgeResult[0].averageAge) : 0;

    return res.status(200).json({
      overview: {
        totalUsers,
        newUsersLast30Days,
        newUsersLast7Days,
        newUsersToday,
        growthRate: parseFloat(growthRate),
        averageAge,
      },
      ageGroups,
      recentUsers,
      dailyRegistrations,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return res.status(500).json({
      message: "Error fetching analytics data",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  addUser,
  getById,
  updateUser,
  deleteUser,
  getAnalyticsOverview,
};
