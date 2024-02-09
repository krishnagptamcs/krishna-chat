const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log(req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //splitting the bearear token
      token = req.headers.authorization.split(" ")[1];
      console.log("token", token);

      // decoding token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // finding the user from Users db, and not selecing its password
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed", error);
    }
  } else {
    res.status(401);
    throw new Error("No token prsent");
  }
});

module.exports = { protect };
