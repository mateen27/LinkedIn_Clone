// imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const cors = require("cors");
const connectToDatabase = require("./database/config");
const userRoutes = require('./routes/userRoutes')

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

// connecting to the database
connectToDatabase();


// endpoints for the application
app.use('/user' , userRoutes);

// setting the server
const port = 8080 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
