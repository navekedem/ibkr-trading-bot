import { Company } from '@/types/company';
import { ScannerData } from '@/types/market-data';
import { Avatar, Button, Table, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { HiOutlineChartSquareBar } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

interface StockTableProps {
    stocks: ScannerData[];
    loading?: boolean;
    setSelectedStock?: React.Dispatch<React.SetStateAction<Company | null>>;
}

export const StockTable: React.FC<StockTableProps> = ({ stocks, loading = false, setSelectedStock }) => {
    const navigate = useNavigate();

    // Function to convert ScannerData to Company format
    const convertToCompany = (scannerData: ScannerData): Company => {
        return {
            active: true,
            cik: '', // Not available in ScannerData
            composite_figi: '', // Not available in ScannerData
            currency_name: 'USD',
            last_updated_utc: new Date().toISOString(),
            locale: 'us',
            market: 'stocks',
            name: scannerData.companyName,
            primary_exchange: 'NASDAQ', // Default assumption
            share_class_figi: '', // Not available in ScannerData
            ticker: scannerData.ticker,
            type: 'CS', // Common Stock
        };
    };

    const handleSelectStock = (record: ScannerData) => {
        if (setSelectedStock) {
            const company = convertToCompany(record);
            setSelectedStock(company);
            navigate('/charts');
        }
    };

    const columns: ColumnsType<ScannerData> = [
        {
            title: 'Company',
            dataIndex: 'ticker',
            key: 'company',
            render: (ticker: string, record: ScannerData) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar src={`https://financialmodelingprep.com/image-stock/${ticker}.png`} alt={ticker} size={40} style={{ backgroundColor: '#f0f0f0' }} />
                    <div>
                        <Text strong>{ticker}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.companyName}
                        </Text>
                    </div>
                </div>
            ),
            width: 300,
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            render: (position: string) => <Tag color={position === 'Long' ? 'green' : 'red'}>{position}</Tag>,
            width: 100,
        },
        {
            title: 'Entry Price',
            dataIndex: 'entryPrice',
            key: 'entryPrice',
            render: (price: number) => <Text>${price.toFixed(2)}</Text>,
            sorter: (a, b) => a.entryPrice - b.entryPrice,
            width: 120,
        },
        {
            title: 'Target Exit',
            dataIndex: 'targetExitPrice',
            key: 'targetExitPrice',
            render: (price: number) => <Text>${price.toFixed(2)}</Text>,
            sorter: (a, b) => a.targetExitPrice - b.targetExitPrice,
            width: 120,
        },
        {
            title: 'Stop Loss',
            dataIndex: 'stopLoss',
            key: 'stopLoss',
            render: (price: number) => <Text>${price.toFixed(2)}</Text>,
            sorter: (a, b) => a.stopLoss - b.stopLoss,
            width: 120,
        },
        {
            title: 'Profit Potential',
            dataIndex: 'estimatedProfitPotential',
            key: 'estimatedProfitPotential',
            render: (potential: number) => <Text style={{ color: potential > 0 ? '#52c41a' : '#ff4d4f' }}>{potential.toFixed(2)}%</Text>,
            sorter: (a, b) => a.estimatedProfitPotential - b.estimatedProfitPotential,
            width: 130,
        },
        {
            title: 'Key Drivers',
            dataIndex: 'keyDrivers',
            key: 'keyDrivers',
            render: (drivers: string) => <Text style={{ fontSize: '12px' }}>{drivers}</Text>,
            ellipsis: true,
        },
        // Conditionally add the Action column only if setSelectedStock is available
        ...(setSelectedStock
            ? [
                  {
                      title: 'Action',
                      key: 'action',
                      render: (_: any, record: ScannerData) => (
                          <Button type="primary" icon={<HiOutlineChartSquareBar />} onClick={() => handleSelectStock(record)} size="small" title="View Charts">
                              Charts
                          </Button>
                      ),
                      width: 100,
                      fixed: 'right' as const,
                  },
              ]
            : []),
    ];

    return (
        <Table
            columns={columns}
            dataSource={stocks}
            loading={loading}
            rowKey="ticker"
            pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} stocks`,
            }}
            scroll={{ x: 1000 }}
            style={{ backgroundColor: '#fff' }}
            size="middle"
        />
    );
};
