import React, { useEffect } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";


const ChatsPage = () => {
  const { user } = ChatState(); // using the user state from chatPage context api

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer/>  }

      <Box>
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatsPage;
