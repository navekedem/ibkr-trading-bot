import { useQuery } from '@tanstack/react-query';
import { Flex, Space, Typography } from 'antd';
import { useContext, useEffect } from 'react';
import { scanMarket } from '../api/scan-market/scan-market';
import { ScannerResultContext, SelectedStockSetterContext } from '../components/AppLayout/AppLayout';
import { StockTable } from '../components/StockTable/StockTable';

const { Title } = Typography;

export const ScannerPage = () => {
    const setSelectedStock = useContext(SelectedStockSetterContext);
    const { scannerData, setScannerData } = useContext(ScannerResultContext);

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['scan-market'],
        queryFn: async () => await scanMarket(false),
        enabled: !scannerData.length,
    });

    useEffect(() => {
        if (data?.stocks?.length && !scannerData.length) setScannerData(data.stocks);
        console.log('ScannerPage data:', data);
    }, [data, scannerData]);

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Flex gap={20} align="center" justify="center">
                    <Title level={2}>Market Scanner</Title>
                </Flex>

                <StockTable
                    stocks={scannerData.length ? scannerData : data?.stocks || []}
                    loading={isLoading || isFetching}
                    setSelectedStock={setSelectedStock || undefined}
                />
            </Space>
        </div>
    );
};
