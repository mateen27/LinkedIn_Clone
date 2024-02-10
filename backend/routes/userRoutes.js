const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// endpoint for registering the users into the database!
router.post("/register", userController.registerUser);
// endpoint for verification of the user
router.get("/verify/:token", userController.verifyUser);
// endpoint for logging in the user into the application
router.post("/login", userController.loginUser);

module.exports = router;
