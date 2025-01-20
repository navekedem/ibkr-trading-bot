import { Flex } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Company } from '../../../../../types/company';
import { AppBar } from '../AppBar/AppBar';
import { SideNav } from '../SideNav/SideNav';

export const AppLayout: React.FC = () => {
    const [selectedStock, setSelectedStock] = useState<Company | null>(null);

    return (
        <Flex vertical={true} style={{ height: '100vh' }}>
            <AppBar setSelectedStock={setSelectedStock} />
            <Flex flex={1} style={{ position: 'relative', gap: '10px' }}>
                <SideNav />
                <div style={{ flex: 1 }}>
                    <Outlet />
                </div>
            </Flex>
        </Flex>
    );
};
