import { Company, CompanyNewsHeadline } from '@app-types/company';
import { MarketData } from '@app-types/market-data';
import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';

export const useStockSelection = ({ selectedStock }: { selectedStock: Company | null }) => {
    const { ws } = useWebSocket('ws://localhost:8080');
    const [dailyChartData, setDailyChartData] = useState<MarketData[]>([]);
    const [hourlyChartData, setHourlyChartData] = useState<MarketData[]>([]);
    const [minutesChartData, setMinutesChartData] = useState<MarketData[]>([]);
    const [newsHeadlines, setNewsHeadlines] = useState<CompanyNewsHeadline[]>([]);

    const initStockStates = () => {
        setDailyChartData([]);
        setHourlyChartData([]);
        setMinutesChartData([]);
        setNewsHeadlines([]);
    };

    useEffect(() => {
        if (!ws) return;
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.reqId === 3002) setNewsHeadlines((prevState) => [...prevState, data]);
            if (data.reqId === 6000) setDailyChartData((prevState) => [...prevState, data]);
            if (data.reqId === 6001) setHourlyChartData((prevState) => [...prevState, data]);
            if (data.reqId === 6002) {
                setMinutesChartData((prevState) => [...prevState, data]);
            }
        };
    }, [ws]);

    useEffect(() => {
        if (!selectedStock) return;
        initStockStates();
        console.log(selectedStock);
        ws?.send(JSON.stringify(selectedStock));
    }, [selectedStock, ws]);

    return {
        dailyChartData,
        hourlyChartData,
        minutesChartData,
        newsHeadlines,
    };
};
