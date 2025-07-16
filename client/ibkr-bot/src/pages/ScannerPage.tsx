import { Space, Typography } from 'antd';
import { StockTable } from '../components/StockTable/StockTable';

const { Title } = Typography;

const data = {
    stocks: [
        {
            ticker: 'AAPL',
            companyName: 'Apple Inc.',
            position: 'Long',
            entryPrice: 209.01,
            targetExitPrice: 225,
            stopLoss: 200,
            estimatedProfitPotential: 7.65,
            keyDrivers: 'Strong brand loyalty, consistent product innovation, and robust financial performance.',
        },
        {
            ticker: 'MSFT',
            companyName: 'Microsoft Corporation',
            position: 'Long',
            entryPrice: 502.55,
            targetExitPrice: 525,
            stopLoss: 480,
            estimatedProfitPotential: 4.47,
            keyDrivers: 'Dominance in cloud computing, diverse product portfolio, and strong earnings growth.',
        },
        {
            ticker: 'GOOGL',
            companyName: 'Alphabet Inc.',
            position: 'Long',
            entryPrice: 181.6,
            targetExitPrice: 195,
            stopLoss: 170,
            estimatedProfitPotential: 7.38,
            keyDrivers: 'Leadership in digital advertising, expanding cloud services, and continuous innovation.',
        },
        {
            ticker: 'AMZN',
            companyName: 'Amazon.com Inc.',
            position: 'Long',
            entryPrice: 226.08,
            targetExitPrice: 240,
            stopLoss: 215,
            estimatedProfitPotential: 6.16,
            keyDrivers: 'E-commerce dominance, growth in cloud services, and strong logistics network.',
        },
        {
            ticker: 'TSLA',
            companyName: 'Tesla Inc.',
            position: 'Long',
            entryPrice: 315.84,
            targetExitPrice: 350,
            stopLoss: 300,
            estimatedProfitPotential: 10.89,
            keyDrivers: 'Leadership in electric vehicles, expanding energy solutions, and strong brand recognition.',
        },
        {
            ticker: 'META',
            companyName: 'Meta Platforms Inc.',
            position: 'Long',
            entryPrice: 724.45,
            targetExitPrice: 750,
            stopLoss: 700,
            estimatedProfitPotential: 3.52,
            keyDrivers: 'Dominance in social media, growth in virtual reality, and strong advertising revenue.',
        },
        {
            ticker: 'NVDA',
            companyName: 'NVIDIA Corporation',
            position: 'Long',
            entryPrice: 165.24,
            targetExitPrice: 180,
            stopLoss: 155,
            estimatedProfitPotential: 8.94,
            keyDrivers: 'Leadership in graphics processing units, growth in AI applications, and strong market demand.',
        },
        {
            ticker: 'BRK.B',
            companyName: 'Berkshire Hathaway Inc.',
            position: 'Long',
            entryPrice: 476.72,
            targetExitPrice: 500,
            stopLoss: 460,
            estimatedProfitPotential: 4.86,
            keyDrivers: 'Diversified investment portfolio, strong management, and consistent earnings growth.',
        },
        {
            ticker: 'JNJ',
            companyName: 'Johnson & Johnson',
            position: 'Long',
            entryPrice: 156.4,
            targetExitPrice: 170,
            stopLoss: 150,
            estimatedProfitPotential: 8.74,
            keyDrivers: 'Leadership in healthcare products, strong pharmaceutical pipeline, and consistent dividends.',
        },
        {
            ticker: 'V',
            companyName: 'Visa Inc.',
            position: 'Long',
            entryPrice: 351.11,
            targetExitPrice: 375,
            stopLoss: 340,
            estimatedProfitPotential: 6.81,
            keyDrivers: 'Dominance in payment processing, global transaction growth, and strong financial performance.',
        },
    ],
};

export const ScannerPage = () => {
    // const { data, isLoading, isFetching } = useQuery({
    //     queryKey: ['scan-market'],
    //     queryFn: async () => await scanMarket(),
    // });

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={2}>Market Scanner</Title>
                <StockTable stocks={data?.stocks || []} loading={false} />
            </Space>
        </div>
    );
};
