const User = require("../models/user");
const userService = require("../services/userService");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// for registration purposes only
const registerUser = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    // check if the user is already registered
    const user = await userService.findUserByEmail(email);

    // user is already registered
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // if the user does not already exist then register the user
    const newUser = await userService.createUser(name, email, password, image);

    res.status(201).json({
      message:
        "User registered successfully , Please check your Mail for verification!",
      user: newUser,
    });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Failed to register user!" });
  }
};

// for verification purposes
const verifyUser = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await userService.verifyUser(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    // save
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.log("Error veryfing the user", error);
    res.status(500).json({ message: "Failed to verify the user!" });
  }
};

// for login purposes
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if the user's password is correct
    const user = await userService.loginUser(email, password);

    // If user authentication is successful, generate JWT token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ user, token });
  } catch (error) {
    console.log("Error logging the user", error);
    res.status(500).json({ message: "Failed to login the user!" });
  }
};

// function for generating the secret key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

// for fetching the user Profile data purposes only
const userProfile = async (req, res) => {
  try {
    // accessing the userId through the req parameter
    const userId = req.params.userId;

    // checking the user if present
    const user = await userService.findUserById(userId);

    // user is not found
    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    // user is found
    res.status(200).json({ user });
  } catch (error) {
    console.log("error retrieving user profile", error);
    res.status(500).json({ message: "Failed to retrieve user profile!" });
  }
};

// for displaying the registered user profile except the logged-in user profile
const displayRegisteredUsers = async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    // fetch the logged-in user profile connection
    const loggedInUser = await userService.getUserConnections(loggedInUserId);

    if (!loggedInUser) {
      res.status(404).json({ message: "User not found!" });
    }

    // get the ID's of the connected users
    const connectedUsersId = loggedInUser.connections.map(
      (connection) => connection._id
    );

    // find the users that are connected to this user
    const users = await userService.findUsersNotConnected(
      loggedInUserId,
      connectedUsersId
    );

    res.status(200).json(users);
  } catch (error) {
    console.log("error displaying user profile", error);
    res.status(500).json({ message: "Failed to display user profiles!" });
  }
};

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  userProfile,
  displayRegisteredUsers,
};
