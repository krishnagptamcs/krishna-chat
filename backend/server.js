const express = require("express");
const { chats } = require("./dummyData/data");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
app.use(express.json()); // to accept json data

connectDB();

// Import routers
const userRoutes = require("./routes/userRoutes");


app.use(cors());

app.get("/", (req, res) => res.send("Apka swagat hai "));

app.use("/api/user", userRoutes);

app.listen(5000, console.log("Server started on PORT 5000"));
