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
router.get("/profile/:userId", userController.userProfile);
// for showing all the registered users except the logged in user profile
router.get("/users/:userId", userController.displayRegisteredUsers);
// for sending the connection request to the people
router.post("/connection-request", userController.sendRequest);
// for showing all the connection request of the logged in user
router.get("/connection-request/:userId", userController.displayRequests);
// for accepting the connection request of the logged in user
router.post("/accept-request", userController.acceptRequest);

module.exports = router;
