const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");

// Authentication routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Analytics routes (placed before parameterized routes)
router.get("/analytics/overview", userController.getAnalyticsOverview);

// User CRUD routes
router.get("/", userController.getAllUsers);
router.post("/", userController.addUser);
router.get("/:id", userController.getById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
