const Post = require("../models/post");
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

// for sending connection requests to the people
const sendRequest = async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    const selectedUser = await userService.sendConnectionRequest(
      currentUserId,
      selectedUserId
    );

    if (selectedUser) {
      res.status(200).json({ message: "Connection request sent successfully" });
    }
  } catch (error) {
    console.log("error sending connection request!", error);
    res.status(500).json({ message: "Failed to send connection request!" });
  }
};

//  for displaying the connection requests of the particular user
const displayRequests = async (req, res) => {
  try {
    const currentUserId = req.params.userId;

    // console.log(currentUserId);
    const users = await userService.getUserConnectionRequest(currentUserId);

    res.json(users);
    // console.log(users);
  } catch (error) {
    console.log(
      "error retrieving the connection request of the logged-in user!",
      error
    );
    res.status(500).json({
      message:
        "Failed to retrieve the connection request of the logged-in user!",
    });
  }
};

// for accepting the connection requests from a user
const acceptRequest = async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    const sender = await userService.findUserById(senderId);
    const receiver = await userService.findUserById(recepientId);

    sender.connections.push(recepientId);
    receiver.connections.push(senderId);

    // modify the sentConnectionRequest and connection Request of the both sender and receiver
    receiver.connectionRequest = receiver.connectionRequest.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentConnectionRequests = sender.sentConnectionRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    // saving the data to the backend
    await sender.save();
    await receiver.save();

    // sending the response back
    res
      .status(200)
      .json({ message: "Connection request accepted successfully" });
  } catch (error) {
    console.log("error accepting the connection request of the logged-in user");
    res.status(500).json({
      message: "Failed to accept the connection request of the logged-in user!",
    });
  }
};

// for displaying all the connected users
const displayConnections = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userService.findUserById(userId);
    // .populate("connections", "name email profileImage createdAt")
    // .exec();

    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    if (user) {
      const userInfo = await user.populate(
        "connections",
        "name email profileImage createdAt"
      );
      res.status(200).json(userInfo.connections);
      // console.log(userInfo.connections);
    }
  } catch (error) {
    console.log("error fetching the connections of the logged-in user", error);
    res.status(500).json({
      message: "Failed to fetch the connections of the logged-in user!",
    });
  }
};

// for posting the post on linkedin
const createPost = async (req, res) => {
  try {
    const { description, imageUrl, userId } = req.body;
    const newPost = new Post({
      description,
      imageUrl,
      user: userId,
    });

    //  save post to the database
    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log("error creating the post", error);
    res.status(500).json({ message: "Failed to create the post!" });
  }
};

// endpoint for fetching all the posts
const fetchPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profileImage");

    res.status(200).json({ posts });
  } catch (error) {
    console.log("error fetching all the posts", error);
    res.status(500).json({ message: "Failed to fetch all the posts!" });
  }
};

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  userProfile,
  displayRegisteredUsers,
  sendRequest,
  displayRequests,
  acceptRequest,
  displayConnections,
  createPost,
  fetchPosts,
};
