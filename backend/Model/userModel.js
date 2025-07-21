const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Authentication fields
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile fields
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    age: { type: Number, default: null },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePicture: { type: String, default: "" },

    // Legacy field for backward compatibility
    name: { type: String, default: "" },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);
