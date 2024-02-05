import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Show,
  VStack,
  useStatStyles,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  return (
    <>
      <VStack spacing={"5px"}>
        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputRightElement width="4.5rem">
              <Button h={"1.75rem"} size={"sm"} onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic">
          <FormLabel>Upload Your Picture</FormLabel>

          <Input
            type="file"
            p={1.5}
            accept="image"
            onChange={(e) => setPic(e.target.value[0])}
          />
        </FormControl>

        <Button bg={"skyblue"} w={"100%"}>
          Submit
        </Button>
      </VStack>
    </>
  );
};

export default Signup;
