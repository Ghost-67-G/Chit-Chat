import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { ChatState } from "../../Context/ChatProvider";
// import { useDispatch } from "react-redux";

const SignUp = () => {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      if (data.success) {
        toast({
          title: "Registration Successful",
          description: "please verify your email",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        // dispatch({
        //   type: "LOGIN_SUCCESS",
        //   payload: data.user,
        // });
        // setUser(data.user);
        // localStorage.setItem("token", data.token);
      }
      setPicLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const picHandler = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "right",
      });
      return;
    }
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "chatapp");
    data.append("cloud_name", "dgjsh3d3n");
    fetch("https://api.cloudinary.com/v1_1/dgjsh3d3n/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPic(data.url.toString());
        setPicLoading(false);
      })
      .catch((err) => {
        setPicLoading(false);
      });
  };

  return (
    <VStack spacing={5}>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          placeholder="Enter your name"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          placeholder="Enter your Email"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type={show ? "text" : "password"}
            placeholder="Enter your password"
          />
          <InputRightElement>
            <Button
              h="2.4rem"
              onClick={() => {
                setShow(!show);
              }}
              size={"sm"}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Profile Picture</FormLabel>
        <Input
          onChange={(e) => {
            picHandler(e.target.files[0]);
          }}
          type="file"
          accept="image/*"
          placeholder="Enter your the url of Picture"
        />
      </FormControl>
      <Button onClick={submitHandler} isLoading={picLoading} colorScheme="blue">
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
