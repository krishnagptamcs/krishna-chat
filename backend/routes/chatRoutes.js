const express = require("express");
const { protect } = require("../middleWare/authMiddleware");
const { accessChat, createGroupChat, fetchChats } = require("../controllers/chatsController");

const router = express.Router();

//route and controll to access or to create chat
router.route("/").post(protect, accessChat);

//route and controll to fetch chat
router.route("/").get(protect, fetchChats);

//route and controll to create group
router.route("/group").post(protect, createGroupChat);

//route and controll to rename group
router.route("/rename").put(protect, renameGroup);

//route and controll to remove  member from the group
router.route("/groupremove").put(protect, removeFromGroup);

//route and controll to add member  in group
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
