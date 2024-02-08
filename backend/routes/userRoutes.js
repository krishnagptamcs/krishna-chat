const express = require("express");
const router = express.Router();

const { registerUser, authUser } = require("../controllers/userControllers");

router.route("/").post(registerUser); // this method is of multiple chaining

router.post("/login", authUser);

// the controller of each route will be defined in therir controller folder

module.exports = router;
