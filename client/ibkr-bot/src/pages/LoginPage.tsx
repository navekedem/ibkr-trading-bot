import { Box, Center, Flex,Text  } from "@chakra-ui/react";
import React from "react";
import loginBG from '../assets/login-bg.jpg'

export const LoginPage: React.FC = () => {
    return <Flex color='white' height={'100vh'}>
        <Center flex='1'>
            <Text>Box 1</Text>
        </Center>
        <Box flex='1' bg='tomato' backgroundImage={loginBG}>
        </Box>
    </Flex>
}