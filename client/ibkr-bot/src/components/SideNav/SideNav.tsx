import { List } from 'antd';
import { HiOutlineChartSquareBar } from 'react-icons/hi';
import { PiGaugeLight } from 'react-icons/pi';

const data = [
    {
        title: 'Overview',
        icon: <PiGaugeLight size={20} />,
    },
    {
        title: 'Charts',
        icon: <HiOutlineChartSquareBar size={20} />,
    },
];

export const SideNav: React.FC = () => {
    return (
        <div style={{ width: '22%', borderRight: '1px solid #f0f0f0', padding: '20px' }}>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta avatar={item.icon} title={<a href="https://ant.design">{item.title}</a>} />
                    </List.Item>
                )}
            />
        </div>
    );
};
