const express = require("express");
const router = express.Router();

const {
  registerUser,
  authUser,
  allUser,
} = require("../controllers/userControllers");
const { protect } = require("../middleWare/authMiddleware");

router.route("/").post(registerUser); // this method is of multiple chaining

router.post("/login", authUser);

router.get("/all-user", protect, allUser);

// the controller of each route will be defined in therir controller folder

module.exports = router;
