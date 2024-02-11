const User = require("../models/user");
const post = require("../models/post");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// for finding the account already exists in the database
const findUserByEmail = async (email) => {
  try {
    const existingUser = await User.findOne({ email });

    return existingUser; // Return the user if found
  } catch (error) {
    console.log("Error finding the user", error);
    throw error;
  }
};

// for registering the unew User account
const createUser = async (name, email, password, image) => {
  try {
    const newUser = await User.create({
      name,
      email,
      password,
      profileImage: image,
    });

    // generate the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // save the new user to the database
    await newUser.save();

    // send the verification email to the registered user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
  } catch (error) {
    console.log("Error registering the User", error);
    throw error;
  }
};

// method for sending the Verification Email to the registered user
const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "linkedin@gmail.com",
    to: email,
    subject: "Please verify your email",
    html: `<h1>Please verify your email</h1>
        <a href="http://localhost:8080/user/verify/${verificationToken}">Click here to verify your email</a>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending the verification email", error);
  }
};

// for verification of the email of the user!
const verifyUser = async (token) => {
  try {
    const verifyUser = await User.findOne({ verificationToken: token });

    return verifyUser;
  } catch (error) {
    console.log("Error verification of the token", error);
    throw error;
  }
};

// for logging the user
const loginUser = async (email, password) => {
  try {
    // check if the user exists
    const user = await User.findOne({ email });

    // user does not exist
    if (!user) {
      throw new Error("Invalid email of the user");
    }

    // checking the password
    if (user.password !== password) {
      throw new Error("Invalid email or password");
    }

    return user;
  } catch (error) {
    console.log("Error logging the user", error);
    throw error;
  }
};

// for finding the user by the userId
const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);

    return user;
  } catch (error) {
    console.log("error finding the user by the userId", error);
    throw error;
  }
};

// for fetching the logged-in user connections data from the database
const getUserConnections = async (userId) => {
  try {
    const userConnections = await User.findById(userId).populate(
      "connections",
      "_id"
    );

    return userConnections;
  } catch (error) {
    console.log("error finding the connections of the user", error);
    throw error;
  }
};

// for the users which are not connected to the logged in users account
const findUsersNotConnected = async (loggedInUserId, connectedUsersId) => {
  try {
    const users = await User.find({
      _id: { $ne: loggedInUserId, $nin: connectedUsersId },
    });

    return users;
  } catch (error) {
    console.log(
      "error finding the users which are not connected to the logged in users account",
      error
    );
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  verifyUser,
  loginUser,
  findUserById,
  getUserConnections,
  findUsersNotConnected,
};
