const express = require("express");
const { chats } = require("./dummyData/data");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.get("/", (req, res) => res.send("Apka swagat hai "));

app.get("/api/chats", (req, res) => res.send(chats));

app.get("/api/chats/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});
app.listen(5000, console.log("Server started on PORT 5000"));
