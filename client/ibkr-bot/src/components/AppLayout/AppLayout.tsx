import { Company, CompanyNewsHeadline } from '@app-types/company';
import { MarketData } from '@app-types/market-data';
import { TextClassificationSingle } from '@huggingface/transformers';
import { Flex } from 'antd';
import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import EmptyState from '../../assets/empty_state.png';
import { useStockSelection } from '../../hooks/useStockSelection';
import { AppBar } from '../AppBar/AppBar';
import { SideNav } from '../SideNav/SideNav';
import { StockTitle } from '../StockTitle/StockTitle';

export const SelectedStockContext = createContext<Company | null>(null);
export const SelectedStockDataContext = createContext<{
    dailyChartData: MarketData[];
    hourlyChartData: MarketData[];
    minutesChartData: MarketData[];
    newsHeadlines: CompanyNewsHeadline[];
    sentiments: Record<string, TextClassificationSingle[]>;
    setSentiments: React.Dispatch<React.SetStateAction<Record<string, TextClassificationSingle[]>>>;
}>({ dailyChartData: [], hourlyChartData: [], minutesChartData: [], newsHeadlines: [], sentiments: {}, setSentiments: () => {} });

export const AppLayout: React.FC = () => {
    const [selectedStock, setSelectedStock] = useState<Company | null>(null);
    const stockData = useStockSelection({ selectedStock });

    return (
        <SelectedStockContext.Provider value={selectedStock}>
            <SelectedStockDataContext.Provider value={stockData}>
                <Flex vertical={true} style={{ height: '100%' }}>
                    <AppBar setSelectedStock={setSelectedStock} />
                    <Flex flex={1} style={{ position: 'relative', gap: '10px', overflowX: 'hidden' }}>
                        <SideNav />
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                            {!selectedStock ? (
                                <NoSelectedStockContent />
                            ) : (
                                <>
                                    <StockTitle selectedStock={selectedStock} />
                                    <Outlet />
                                </>
                            )}
                        </div>
                    </Flex>
                </Flex>
            </SelectedStockDataContext.Provider>
        </SelectedStockContext.Provider>
    );
};

const NoSelectedStockContent = () => {
    return (
        <Flex vertical={true} gap={4} style={{ height: '100%' }} align="center" justify="center">
            <h2 style={{ margin: 0 }}>No Selected Stock</h2>
            <h4 style={{ margin: 0 }}>Please choose a stock for research and trade</h4>
            <img style={{ height: 400, width: 400 }} src={EmptyState} alt="" />
        </Flex>
    );
};
