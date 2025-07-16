import { List } from 'antd';
import { AiOutlineSecurityScan } from 'react-icons/ai';
import { HiOutlineChartSquareBar } from 'react-icons/hi';
import { PiGaugeLight } from 'react-icons/pi';
import { Link } from 'react-router-dom';

const data = [
    {
        title: <Link to="/overview">Overview</Link>,
        icon: <PiGaugeLight size={20} />,
    },
    {
        title: <Link to="/charts">Charts</Link>,
        icon: <HiOutlineChartSquareBar size={20} />,
    },
    {
        title: <Link to="/scanner">Scanner</Link>,
        icon: <AiOutlineSecurityScan size={20} />,
    },
];

export const SideNav: React.FC = () => {
    return (
        <div style={{ width: '10%', borderRight: '1px solid #f0f0f0', padding: '20px' }}>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta avatar={item.icon} title={item.title} />
                    </List.Item>
                )}
            />
        </div>
    );
};
