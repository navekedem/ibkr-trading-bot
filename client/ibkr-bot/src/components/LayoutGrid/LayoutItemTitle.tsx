import { Button, Flex } from 'antd';
import { MdZoomInMap } from 'react-icons/md';

export const LayoutItemTitle: React.FC<{ title: string; chartId: string }> = ({ title, chartId }) => {
    const resetChartZoom = () => {
        ApexCharts.exec(chartId, 'resetSeries');
    };

    return (
        <Flex style={{ padding: '10px 20px', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 className="layout-block-title">{title}</h4>
            <Button iconPosition="start" icon={<MdZoomInMap />} onClick={resetChartZoom} variant="solid">
                Reset Zoom
            </Button>
        </Flex>
    );
};
