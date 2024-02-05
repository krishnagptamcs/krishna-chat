import React, { useEffect } from "react";
import axios from "axios";

const ChatsPage = () => {
  const fetchChats = async () => {
    // const chatData = await apiConnector(
    //   "GET",
    //   "http://localhost:5000/api/chats"
    // );
    const chatData = await axios.get("http://localhost:5000/api/chats");

    console.log(chatData?.data);
  };

  useEffect(() => {
    fetchChats();
  }, []);
  return <div>ChatsPage</div>;
};

export default ChatsPage;
