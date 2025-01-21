import { Flex } from 'antd';
import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Company } from '../../../../../types/company';
import EmptyState from '../../assets/empty_state.png';
import { AppBar } from '../AppBar/AppBar';
import { SideNav } from '../SideNav/SideNav';

export const SelectedStockContext = createContext<Company | null>(null);

export const AppLayout: React.FC = () => {
    const [selectedStock, setSelectedStock] = useState<Company | null>(null);

    return (
        <SelectedStockContext.Provider value={selectedStock}>
            <Flex vertical={true} style={{ height: '100%' }}>
                <AppBar setSelectedStock={setSelectedStock} />
                <Flex flex={1} style={{ position: 'relative', gap: '10px', overflowY: 'auto', overflowX: 'hidden' }}>
                    <SideNav />
                    <div style={{ flex: 1 }}>{!selectedStock ? <NoSelectedStockContent /> : <Outlet />}</div>
                </Flex>
            </Flex>
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
