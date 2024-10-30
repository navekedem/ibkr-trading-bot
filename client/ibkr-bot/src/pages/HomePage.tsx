import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { Company } from '../../../../types/company';
import { AppBar } from '../components/AppBar/AppBar';
import { MarketDataGraphs } from '../components/MarketDataGraphs/MarketDataGraphs';
import { SearchCompany } from '../components/SearchCompany/SearchCompany';

export const HomePage: React.FC = () => {
    const [selectedStock, setSelectedStock] = useState<Company | null>(null);

    return (
        <Flex flexDirection={'column'}>
            <AppBar />
            <SearchCompany setSelectedStock={setSelectedStock} />
            <MarketDataGraphs selectedStock={selectedStock} />
        </Flex>
    );
};
