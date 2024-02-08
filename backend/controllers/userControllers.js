const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    // Check if required fields are missing
    if (!name || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the email already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(403).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });

    // If user creation is successful, send response with user data and token
    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id), // assuming generateToken function is defined elsewhere
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Error while creating user",
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // After finding the user, compare the hashed password
    const comparePassword = await bcrypt.compare(password, user.password);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Authentication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const newauthUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // After finding the user, compare the hashed password
    const comparePassword = await bcrypt.compare(password, user.password);

    if (comparePassword) {
      return res.status(200).json({
        success: true,
        message: "User authenticated successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Password not matched",
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Authentication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { registerUser, authUser };
