import React, { useEffect, useRef, useState } from "react";
import apexchart from "apexcharts";
import { Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import { useWebSocket } from "../../hooks/useWebSocket";
import ReactApexChart from "react-apexcharts";
import { DailyChartOptions, HourlyChartOptions, MinutesChartOptions, RealTimeChartOptions } from "../../consts/apexChartOptions";
import { handleChartData } from "../../utils/handleChartData";
import { createAnnotationsLines } from "../../utils/createAnnotationsLines";
import { MarketData } from "../../../../../types/market-data";
import { LayoutGrid } from "../LayoutGrid/LayoutGrid";
import { Layouts } from "react-grid-layout";


const ChartsLayout: Layouts = {
    lg: [
        { i: "day", x: 0, y: 0, w: 6, h: 5, minW: 4, minH: 5 },
        { i: "hour", x: 6, y: 0, w: 6, h: 5, minW: 4, minH: 5 },
        { i: "minute", x: 0, y: 1, w: 12, h: 5, minW: 4, minH: 5 },
    ],
};


export const MarketDataGraphs: React.FC = (props) => {
    const { ws, message, error } = useWebSocket('ws://localhost:8080')
    const [dailyChartData, setDailyChartData] = useState<MarketData[]>([])
    const [hourlyChartData, setHourlyChartData] = useState<MarketData[]>([])
    const [minutesChartData, setMinutesChartData] = useState<MarketData[]>([])
    const fiveSecondMarketData = useRef<MarketData |null>(null)
    useEffect(() => {
        if (!ws) return
        ws.onmessage = (event) => {
            console.log(JSON.parse(event.data))
            const data = JSON.parse(event.data)
            if (data.reqId === 6000) setDailyChartData(prevState => [...prevState, data])
            if (data.reqId === 6001) setHourlyChartData(prevState => [...prevState, data])
            if (data.reqId === 6003) calcMinuteBar(data)
            // setMessage(prevState => [...prevState, JSON.parse(event.data)]);
            // console.log(JSON.parse(event.data)) setMessage(JSON.parse(event.data));
        };
    }, [ws])

    setInterval(() => {
        if(!fiveSecondMarketData.current) return
        setMinutesChartData(prevState => [...prevState, fiveSecondMarketData.current])
        fiveSecondMarketData.current = null
    }, 60000);

    const calcMinuteBar = (data: any) => {
        const {high, low, close} = data
        if(!fiveSecondMarketData.current)  {
            fiveSecondMarketData.current = {...data}
        } else {
            fiveSecondMarketData.current = {
                ...fiveSecondMarketData.current,
                high: high > fiveSecondMarketData.current.high ? high : fiveSecondMarketData.current.high,
                low: low < fiveSecondMarketData.current.low ? low : fiveSecondMarketData.current.low,
                close: close
              }
        }
    }   

    return (
        <LayoutGrid layouts={ChartsLayout}>
            <ReactApexChart
                type="candlestick"
                key={"day"}
                options={createAnnotationsLines(dailyChartData, DailyChartOptions)}
                height={500}
                series={[{
                    data: handleChartData(dailyChartData), name: 'candle',
                    type: 'candlestick'
                }]}
            />
            <ReactApexChart
                type="candlestick"
                height={500}
                key={"hour"}
                options={createAnnotationsLines(hourlyChartData, HourlyChartOptions)}
                series={[{
                    data: handleChartData(hourlyChartData), name: 'candle',
                    type: 'candlestick'
                }]}
            />
            <ReactApexChart
                type="candlestick"
                height={500}
                key={"minute"}
                options={createAnnotationsLines(minutesChartData, MinutesChartOptions)}
                series={[{
                    data: handleChartData(minutesChartData), name: 'candle',
                    type: 'candlestick'
                }]}
            />

        </LayoutGrid>

    )
}
