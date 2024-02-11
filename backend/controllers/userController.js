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

module.exports = { registerUser, verifyUser, loginUser };