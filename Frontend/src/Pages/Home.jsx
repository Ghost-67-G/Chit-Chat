import React, { useEffect } from "react";
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import Login from "../Components/auth/Login";
import SignUp from "../Components/auth/SignUp";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { user, setUser } = ChatState();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      navigate("/chats");
    } else {
      if (token) {
        axios.get("/api/user/check-session?token=" + token).then(({ data }) => {
          if (data.success) {
            toast({
              title: "Login Successful",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setUser(data.user);
          } else {
            toast({
              title: "Please Login",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
        });
      }
    }
  }, [navigate, setUser, toast, token, user]);

  return (
    <Container maxW="xl">
      <Box
        d="flex"
        justifyContent="center"
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"xl"}
        borderWidth={"1px"}
        px="3"
        py="1"
      >
        <Text
          fontSize="4xl"
          fontWeight="semibold"
          fontFamily="work sans"
          textAlign="center"
        >
          Chit Chat
        </Text>
      </Box>
      <Box bg="white" w="100%" p="4" borderRadius="lg">
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
