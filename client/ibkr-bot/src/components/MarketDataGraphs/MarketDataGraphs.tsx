import { MarketData } from '@app-types/market-data';
import React, { useContext, useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Layouts } from 'react-grid-layout';
import { DailyChartOptions, HourlyChartOptions, MinutesChartOptions } from '../../consts/apexChartOptions';
import { createAnnotationsLines } from '../../utils/createAnnotationsLines';
import { handleChartData } from '../../utils/handleChartData';
import { SelectedStockContext, SelectedStockDataContext } from '../AppLayout/AppLayout';
import { LayoutGrid } from '../LayoutGrid/LayoutGrid';
import { LayoutItemTitle } from '../LayoutGrid/LayoutItemTitle';

const ChartsLayout: Layouts = {
    lg: [
        { i: 'day', x: 0, y: 0, w: 6, h: 5, minW: 4, minH: 5 },
        { i: 'hour', x: 6, y: 0, w: 6, h: 5, minW: 4, minH: 5 },
        { i: 'minute', x: 0, y: 2, w: 12, h: 5, minW: 4, minH: 5 },
    ],
};

export const MarketDataGraphs: React.FC = () => {
    const selectedStock = useContext(SelectedStockContext);
    const { dailyChartData, hourlyChartData, minutesChartData } = useContext(SelectedStockDataContext);
    const newMinutesChartData = useRef<MarketData[]>([]);

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
                {/* {!!minutesChartData.length && (
                )} */}
            </div>
        </LayoutGrid>
    );
};
