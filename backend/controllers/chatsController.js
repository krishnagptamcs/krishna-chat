const User = require("../models/userModel");
const Chat = require("../models/chatModel");


// FUNCTION TO ACCESS THE CHAT of USER IF IT IS PRESENT , Or CREATE A NEW CHAT --> ONE ON ONE CHAT <----
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

// FETCH ALL THE CHAT OF THE USER, taking  the user id and finding all the chat , where the user is present inside the users , in the chat model
const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage", "-password")
      .sort({ updateAt: -1 }) // showing the latest message 
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "something went wrong",
    });
  }
};

// FUNCTION TO CREATE A GROUP CHAT
const createGroupChat = async (req, res) => {
  try {
    // check the name and user , should not be empty
    if (!req.body.users || req.body.name) {
      return res.status(400).json({
        message: "Pls provide all  the fields",
      });
    }

    //parsing the all the user , from an array , to string
    var users = JSON.parse(req.body.users);

    // check the user length , for the group chat the user must be greater than 2
    if (users.length < 2) {
      return res
        .status(400)
        .json({ success: false, message: "required more than two users " });
    }

    // since , while creating the group chat , the login user is also going to be in a group , by default , suppose if there is 2 member in array , then it going to be an 2 selected member + login user

    users.push(req.user);

    // creatig a new group chat
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user, // the login user
      });

      // after getting the id of the group chat

      const fullGroupChat = await Chat.findOne({
        _id: groupChat._id,
      })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    } catch (error) {
      console.log(`Error in creating Group Chat ${error}`);
      res.status(401).json({
        success: false,
        message: "error while group chat ",
      });
    }
  } catch (error) {
    console.log("error in group chat");

    res.status(401).json({
      success: false,
      message: "Auth failed",
    });
  }
};

// FUNCTION TO RENAM THE GROUP
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

// FUNCTION TO ADD NEW USER IN GROUP
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId }, // adding the new user
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
};

// FUCNTION TO REMOVE USER FROM GROUP
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId }, // puul-> to remove an element from array , deleting the user from group
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
};


module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
