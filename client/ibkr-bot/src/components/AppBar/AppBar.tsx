import { Box, Button, Link as ChakraLink, Flex, Text } from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { Company } from '../../../../../types/company';
import { SearchCompany } from '../SearchCompany/SearchCompany';
export const AppBar: React.FC<{ setSelectedStock: React.Dispatch<React.SetStateAction<Company | null>> }> = ({ setSelectedStock }) => {
    const navigate = useNavigate();
    return (
        <Box backgroundColor={'#fff'} display={'flex'} padding={'10px'} justifyContent={'space-between'} boxShadow={'0 2px 4px 0 rgba(0,0,0,.2)'}>
            <Flex justifyContent={'center'} gap={2} alignItems={'center'}>
                <FaHome size={20} />
                <Text color={'black'} fontWeight={'bold'} fontSize={'1.3rem'}>
                    Trading Bot Dashboard
                </Text>
                <ChakraLink as={ReactRouterLink} to="/home">
                    Dashboard
                </ChakraLink>
            </Flex>
            <Flex justifyContent={'center'} gap={2} alignItems={'center'}>
                <SearchCompany setSelectedStock={setSelectedStock} />
                <Button colorScheme="red" onClick={() => navigate('/')} borderRadius={'100px'} fontWeight={'bold'} fontSize={'1rem'}>
                    Logout
                </Button>
            </Flex>
        </Box>
    );
};
