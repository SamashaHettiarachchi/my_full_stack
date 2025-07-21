// Test script to check if auth modules can be loaded
console.log("Testing auth modules...");

try {
  const authController = require("./controllers/authController");
  console.log("✅ authController loaded successfully");
} catch (error) {
  console.error("❌ Error loading authController:", error.message);
}

try {
  const authRoutes = require("./Routes/authRoutes");
  console.log("✅ authRoutes loaded successfully");
} catch (error) {
  console.error("❌ Error loading authRoutes:", error.message);
}

try {
  const authModel = require("./Model/authUserModel");
  console.log("✅ authUserModel loaded successfully");
} catch (error) {
  console.error("❌ Error loading authUserModel:", error.message);
}

try {
  const authMiddleware = require("./middleware/authMiddleware");
  console.log("✅ authMiddleware loaded successfully");
} catch (error) {
  console.error("❌ Error loading authMiddleware:", error.message);
}

console.log("Auth modules test completed.");
