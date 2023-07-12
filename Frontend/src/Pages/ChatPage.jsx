import React, { useState } from "react";
import SideDrawer from "../Components/SideDrawer";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { Navigate } from "react-router-dom";
import MyChats from "../Components/MyChats";
import Chatbox from "../Components/ChatBox";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user ? <SideDrawer /> : <Navigate to="/" />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
