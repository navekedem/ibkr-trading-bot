import React, { useEffect, useMemo, useRef, useState } from "react";
import { Center, Heading, Box, flatten, } from "@chakra-ui/react";
import { useWebSocket } from "../../hooks/useWebSocket";
import ReactApexChart from "react-apexcharts";
import { DailyChartOptions, HourlyChartOptions, MinutesChartOptions } from "../../consts/apexChartOptions";
import { handleChartData, handleSingleCandle } from "../../utils/handleChartData";
import { createAnnotationsLines } from "../../utils/createAnnotationsLines";
import { MarketData } from "../../../../../types/market-data";
import { LayoutGrid } from "../LayoutGrid/LayoutGrid";
import { Layouts } from "react-grid-layout";
import { Company } from "../../../../../types/company-api";
import { LayoutItemTitle } from "../LayoutGrid/LayoutItemTitle";


const ChartsLayout: Layouts = {
    lg: [
        { i: "day", x: 0, y: 1, w: 6, h: 5, minW: 4, minH: 5 },
        { i: "hour", x: 6, y: 1, w: 6, h: 5, minW: 4, minH: 5 },
        { i: "minute", x: 0, y: 0, w: 12, h: 5, minW: 4, minH: 5 },
    ],
};


export const MarketDataGraphs: React.FC<{ selectedStock: Company | null }> = ({ selectedStock }) => {
    const { ws } = useWebSocket('ws://localhost:8080')
    const [dailyChartData, setDailyChartData] = useState<MarketData[]>([])
    const [hourlyChartData, setHourlyChartData] = useState<MarketData[]>([])
    const [minutesChartData, setMinutesChartData] = useState<MarketData[]>([])
    const newMinutesChartData = useRef<MarketData[]>([])


    const initCharts = () => {
        setDailyChartData([])
        setHourlyChartData([])
        setMinutesChartData([])
    }

    useEffect(() => {
        if (!ws) return
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.reqId === 6000) setDailyChartData(prevState => [...prevState, data])
            if (data.reqId === 6001) setHourlyChartData(prevState => [...prevState, data])
            if (data.reqId === 6002) {
                setMinutesChartData(prevState => [...prevState, data])
            }
        };
    }, [ws])



    useMemo(() => {
        if (!selectedStock) return
        initCharts();
        // setMinuteCandleStick(null);
        ws?.send(selectedStock.ticker)
    }, [selectedStock])


    useEffect(() => {
        if (!minutesChartData || !minutesChartData.length) return
        // console.log(minutesChartData)
        ApexCharts.exec(MinutesChartOptions.chart?.id!, 'updateSeries', [{
            data: handleChartData(minutesChartData), name: 'candle',
            type: 'candlestick'
        }])
    }, [minutesChartData])

    return (
        <>
            {!selectedStock ? <Center>
                <Heading flexGrow={1} textAlign={"center"}>Please Choose A Stock to start Trade</Heading>
            </Center> :
                <>
                    <Center><Heading textAlign={"center"}>{selectedStock?.name} {selectedStock?.ticker}</Heading></Center>
                    <LayoutGrid layouts={ChartsLayout}>
                        <Box key={"day"}>
                            <LayoutItemTitle title="Daily Chart" chartId={DailyChartOptions.chart?.id!} />
                            <ReactApexChart
                                type="candlestick"
                                options={createAnnotationsLines(dailyChartData, DailyChartOptions, false)}
                                height={500}
                                series={[{
                                    data: handleChartData(dailyChartData), name: 'candle',
                                    type: 'candlestick'
                                }]}
                            />
                        </Box>
                        <Box key={"hour"}>
                            <LayoutItemTitle title="Hour Chart" chartId={HourlyChartOptions.chart?.id!} />
                            <ReactApexChart
                                type="candlestick"
                                height={500}
                                options={createAnnotationsLines(hourlyChartData, HourlyChartOptions, false)}
                                series={[{
                                    data: handleChartData(hourlyChartData), name: 'candle',
                                    type: 'candlestick'
                                }]}
                            />
                        </Box>
                        <Box key={"minute"}>
                            <LayoutItemTitle title="Minutes Chart" chartId={MinutesChartOptions.chart?.id!} />
                            <ReactApexChart
                                type="candlestick"
                                height={500}
                                options={createAnnotationsLines(minutesChartData, MinutesChartOptions, true)}
                            // series={[{
                            //     data: handleChartData(minutesChartData), name: 'candle',
                            //     type: 'candlestick'
                            // }]}
                            />
                        </Box>
                    </LayoutGrid>
                </>}
        </>

    )
}
