import { Box, Text } from "@chakra-ui/react"

export const AppBar:React.FC =() => {
    return <Box backgroundColor={'#333'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={50} boxShadow={"0px 0px 2px"}>
        <Text color={'white'} fontSize={'1.3rem'}>Welcome To Our Trading Bot</Text>
    </Box>
}