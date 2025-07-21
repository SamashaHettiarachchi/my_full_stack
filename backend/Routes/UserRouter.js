const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");

router.get("/", userController.getAllUsers);
router.post("/", userController.addUser);
router.get("/:id", userController.getById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser); // <-- Add this line

module.exports = router;
