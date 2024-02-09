const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// FUNCTION TO ACCESS THE CHAT PF USER IF IT IS PRESENT , OT CREATE A NEW CHAT
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    // 1.) We have to check the user id in the chat db , if the user id present in chat db , then chat is already present of the user , then access the chat

    // 2.) if the user id not found in the chat db then  create a new one with this userId and set it to an empty array

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User id  is required",
      });
    }

    // CHECKING IF THERE IS AN EXISTING CHAT FOR THE GIVEN USER ID
    var isChat = await Chat.find({
      // first check that is not a group chat
      isGroupChat: false,
      // this logic will compare the user _id from db and userId which is coming in req body
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: req.userId } } },
      ],
    })
      .populate("users", "-password") // return the user data (name, email , token , pic)
      .populate("latestMessage"); // return the latest message of the user

    // populate is a mongodb db method to show the value of the refrence , which is given

    // after getting the value of isChat
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      // if the earlier chats found return the chats data
      res.send(isChat[0]);
    } else {
      // create new private chat between two users
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        // creating a new chat and storing in db
        const createdChat = await Chat.create(chatData);

        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );

        res.status(200).send(FullChat);
      } catch (error) {
        console.log("error coming while saving/fetch chats from db", error);
        res.status(400).send(error);
      }
    }
  } catch (error) {
    console.log("error in access chat ", error);
  }
};
