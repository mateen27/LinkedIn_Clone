const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// endpoint for registering the users into the database!
router.post("/register", userController.registerUser);
// endpoint for verification of the user
router.get("/verify/:token", userController.verifyUser);
// endpoint for logging in the user into the application
router.post("/login", userController.loginUser);
// endpoint for user's profile
router.get('/profile/:userId', userController.userProfile);
// for showing all the registered users except the logged in user profile
router.get("/users/:userId", userController.displayRegisteredUsers);

module.exports = router;
