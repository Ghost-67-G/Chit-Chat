import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const emailVerify = async () => {
    try {
      const { data } = await axios.get(`/api/user/verify-email?token=${token}`);
      if (data.success) {
        toast({
          title: "Verified",
          description: "Email verified please login",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to verify please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      navigate("/");
    }
  };

  useEffect(() => {
    emailVerify();
  });
  return <div>Hello</div>;
};

export default VerifyEmail;
