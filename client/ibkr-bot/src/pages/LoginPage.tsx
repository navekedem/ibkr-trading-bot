import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import loginBG from '../assets/login-bg.jpg'
import IBKR from '../assets/IBKR.png'

export const LoginPage: React.FC = () => {
    return <Flex color='white' height={'100vh'}>
        <Center flex='1'>
            <Box display={"flex"} textAlign={'center'} color={"#000"} flexDirection={"column"} padding={"0 5rem"}>
                <img src={IBKR} style={{ height: 200, width: 200, objectFit: "contain", margin: 'auto' }}></img>
                <Heading as='h1' margin={"1rem 0"} size='xl'>Welcome to Interactive Brokers Trading Bot</Heading>
                <Text fontSize={"1.3rem"}>Before you are login into the system, Download the TWS desktop app and login to your interactive brokers account</Text>
                <Button colorScheme='red' margin={"3rem auto"} fontSize={"1.3rem"} width={"30%"} onClick={() =>{}}>
                    Login
                </Button>
            </Box>
        </Center>
        <Box flex='1' bg='tomato' backgroundImage={loginBG}>
        </Box>
    </Flex>
}