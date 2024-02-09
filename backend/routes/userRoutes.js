const express = require("express");
const router = express.Router();

const {
  registerUser,
  authUser,
  allUser,
} = require("../controllers/userControllers");
const { protect } = require("../middleWare/authMiddleware");

// controller to register a user
router.route("/").post(registerUser);

//contorller for login
router.post("/login", authUser);

// controller to find the user according to user query
router.get("/all-user", protect, allUser);

// the controller of each route will be defined in therir controller folder

module.exports = router;
