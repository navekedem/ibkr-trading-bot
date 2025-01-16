import {
    Button,
    Center,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    ModalProps,
    Text,
} from '@chakra-ui/react';
import { CompanyAnalysisResponse } from '../../../../../types/company';

type ModalAnalysisProps = ModalProps & {
    title: string;
    showFooter?: boolean;
};

export const ModalAnalysis: React.FC<ModalAnalysisProps> = ({ isOpen, onClose, title, children, showFooter = true }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody padding={'0 20px 20px'}>{children}</ModalBody>

                {showFooter && (
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                )}
            </ModalContent>
        </Modal>
    );
};

export const AnalysisContent: React.FC<CompanyAnalysisResponse> = ({ buyPrice, sellPrice, keyInsights, confidenceScore, stoploss, riskLevel, position }) => {
    return (
        <>
            <Center marginBottom={8}>{keyInsights}</Center>
            <Flex flexDirection={'column'} gap={5}>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontWeight={'bold'} fontSize="md">
                        Position
                    </Text>
                    <Text fontSize="md">{position}</Text>
                </Flex>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontWeight={'bold'} fontSize="md">
                        Buy Price
                    </Text>
                    <Text fontSize="md">${buyPrice}</Text>
                </Flex>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontWeight={'bold'} fontSize="md">
                        Sell Price
                    </Text>
                    <Text fontSize="md">${sellPrice}</Text>
                </Flex>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontWeight={'bold'} fontSize="md">
                        Confidence Score (0-100%)
                    </Text>
                    <Text fontSize="md">{confidenceScore}%</Text>
                </Flex>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontWeight={'bold'} fontSize="md">
                        Stoploss
                    </Text>
                    <Text fontSize="md">${stoploss}</Text>
                </Flex>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontWeight={'bold'} fontSize="md">
                        Risk Level
                    </Text>
                    <Text fontSize="md">{riskLevel}</Text>
                </Flex>
            </Flex>
        </>
    );
};
