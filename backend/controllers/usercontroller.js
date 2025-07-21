const User = require("../Model/userModel");

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// POST /users
const addUser = async (req, res) => {
  const { name, email, age, address, profilePicture } = req.body;

  try {
    const user = new User({ name, email, age, address, profilePicture });
    await user.save();
    return res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).json({ message: "Failed to add user", error: err.message });
  }
};

// GET /users/:id
const getById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, age, address, profilePicture } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, age, address, profilePicture },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Error updating user", error: err.message });
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
    return res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  getById,
  updateUser,
  deleteUser,
};
