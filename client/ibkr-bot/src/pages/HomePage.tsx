import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { Company } from '../../../../types/company';
import { AppBar } from '../components/AppBar/AppBar';
import { MarketDataGraphs } from '../components/MarketDataGraphs/MarketDataGraphs';

export const HomePage: React.FC = () => {
    const [selectedStock, setSelectedStock] = useState<Company | null>(null);

    return (
        <Flex flexDirection={'column'}>
            <AppBar setSelectedStock={setSelectedStock} />
            <MarketDataGraphs selectedStock={selectedStock} />
        </Flex>
    );
};
