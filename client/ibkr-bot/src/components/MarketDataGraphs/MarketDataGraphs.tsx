import { useMutation } from '@tanstack/react-query';
import { Button, Flex } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Layouts } from 'react-grid-layout';
import { CompanyAnalysisResponse } from '../../../../../types/company';
import { MarketData } from '../../../../../types/market-data';
import { sendStockAnalysis } from '../../api/send-stock-analysis/send-stock-analysis';
import { DailyChartOptions, HourlyChartOptions, MinutesChartOptions } from '../../consts/apexChartOptions';
import { useWebSocket } from '../../hooks/useWebSocket';
import { createAnnotationsLines } from '../../utils/createAnnotationsLines';
import { createAnalysis, handleChartData } from '../../utils/handleChartData';
import { SelectedStockContext } from '../AppLayout/AppLayout';
import { LayoutGrid } from '../LayoutGrid/LayoutGrid';
import { LayoutItemTitle } from '../LayoutGrid/LayoutItemTitle';
import { AnalysisContent, ModalAnalysis } from '../ModalAnalysis/ModalAnalysis';

const ChartsLayout: Layouts = {
    md: [
        { i: 'day', x: 0, y: 0, w: 12, h: 5, minW: 4, minH: 5 },
        { i: 'hour', x: 0, y: 1, w: 12, h: 5, minW: 4, minH: 5 },
        { i: 'minute', x: 0, y: 2, w: 12, h: 5, minW: 4, minH: 5 },
    ],
};

export const MarketDataGraphs: React.FC = () => {
    const { ws } = useWebSocket('ws://localhost:8080');
    const selectedStock = useContext(SelectedStockContext);
    const [dailyChartData, setDailyChartData] = useState<MarketData[]>([]);
    const [hourlyChartData, setHourlyChartData] = useState<MarketData[]>([]);
    const [minutesChartData, setMinutesChartData] = useState<MarketData[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [analysisResponse, setAnalysisResponse] = useState<CompanyAnalysisResponse>();
    const newMinutesChartData = useRef<MarketData[]>([]);
    const { mutateAsync, isPending } = useMutation({
        mutationFn: sendStockAnalysis,
    });

    const initCharts = () => {
        setDailyChartData([]);
        setHourlyChartData([]);
        setMinutesChartData([]);
    };

    const sendAnalysis = async () => {
        const analysis = createAnalysis(dailyChartData, selectedStock!);
        const res = await mutateAsync(analysis);
        console.log(analysis);
        console.log(res);
        if (res) setAnalysisResponse(res);
        setIsOpen(true);
    };

    useEffect(() => {
        if (!ws) return;
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.reqId === 6000) setDailyChartData((prevState) => [...prevState, data]);
            if (data.reqId === 6001) setHourlyChartData((prevState) => [...prevState, data]);
            if (data.reqId === 6002) {
                setMinutesChartData((prevState) => [...prevState, data]);
            }
        };
    }, [ws]);

    useEffect(() => {
        if (!selectedStock) return;
        initCharts();
        console.log(selectedStock);
        ws?.send(JSON.stringify(selectedStock));
    }, [selectedStock, ws]);

    useEffect(() => {
        if (!minutesChartData || !minutesChartData.length) return;
        ApexCharts.exec(MinutesChartOptions.chart?.id!, 'updateSeries', [
            {
                data: handleChartData(minutesChartData),
                name: 'candle',
                type: 'candlestick',
            },
        ]);
    }, [minutesChartData]);

    return (
        <>
            <ModalAnalysis open={isOpen} title={`${selectedStock?.name} (${selectedStock?.ticker}) Analysis`} onClose={() => setIsOpen(false)}>
                {analysisResponse && <AnalysisContent {...analysisResponse} />}
            </ModalAnalysis>

            <Flex gap={6} align="center">
                <h2>
                    {selectedStock?.name} {selectedStock?.ticker}
                </h2>
                <Button loading={isPending} onClick={sendAnalysis}>
                    Send Analysis To AI
                </Button>
            </Flex>
            <LayoutGrid layouts={ChartsLayout}>
                <div key={'day'}>
                    <LayoutItemTitle title="Daily Chart" chartId={DailyChartOptions.chart?.id!} />
                    <ReactApexChart
                        type="candlestick"
                        options={createAnnotationsLines(dailyChartData, DailyChartOptions, false)}
                        height={500}
                        series={[
                            {
                                data: handleChartData(dailyChartData),
                                name: 'candle',
                                type: 'candlestick',
                            },
                        ]}
                    />
                </div>
                <div key={'hour'}>
                    <LayoutItemTitle title="Hour Chart" chartId={HourlyChartOptions.chart?.id!} />
                    <ReactApexChart
                        type="candlestick"
                        height={500}
                        options={createAnnotationsLines(hourlyChartData, HourlyChartOptions, false)}
                        series={[
                            {
                                data: handleChartData(hourlyChartData),
                                name: 'candle',
                                type: 'candlestick',
                            },
                        ]}
                    />
                </div>
                <div key={'minute'}>
                    <LayoutItemTitle title="Minutes Chart" chartId={MinutesChartOptions.chart?.id!} />
                    {!!minutesChartData.length && (
                        <ReactApexChart
                            type="candlestick"
                            height={500}
                            options={createAnnotationsLines(minutesChartData, MinutesChartOptions, true)}
                            series={[
                                {
                                    data: handleChartData(minutesChartData),
                                    name: 'candle',
                                    type: 'candlestick',
                                },
                            ]}
                        />
                    )}
                </div>
            </LayoutGrid>
        </>
    );
};
