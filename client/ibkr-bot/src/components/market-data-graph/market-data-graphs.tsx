import React, { useEffect, useState } from "react";
import apexchart from "apexcharts";
import { Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import { useWebSocket } from "../../hooks/useWebSocket";
import ReactApexChart from "react-apexcharts";
import { DailyChartOptions, HourlyChartOptions, MinutesChartOptions, RealTimeChartOptions } from "../../consts/apexChartOptions";
import { handleChartData } from "../../utils/handleChartData";
import { createAnnotationsLines } from "../../utils/createAnnotationsLines";
import { MarketData } from "../../types/market-data";

export const MarketDataGraphs: React.FC = (props) => {
    const { ws, message, error } = useWebSocket('ws://localhost:8080')
    const [dailyChartData, setDailyChartData] = useState<MarketData[]>([])
    const [hourlyChartData, setHourlyChartData] = useState<MarketData[]>([])
    const [minutesChartData, setMinutesChartData] = useState<MarketData[]>([])

    useEffect(() => {
        if (!ws) return
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.reqId === 6000) setDailyChartData(prevState => [...prevState, data])
            if (data.reqId === 6001) setHourlyChartData(prevState => [...prevState, data])
            if (data.reqId === 6002) setMinutesChartData(prevState => [...prevState, data])
            // setMessage(prevState => [...prevState, JSON.parse(event.data)]);
            // console.log(JSON.parse(event.data)) setMessage(JSON.parse(event.data));
        };
    }, [ws])



    const handleRealTimeChart = (realTime: any[]) => {
        apexchart.exec('6003', 'updateSeries', [{
            data: handleChartData(realTime), name: 'candle',
            type: 'candlestick'
        }])
    }

    return (
        <Flex margin={'2rem 0'} flexWrap={'wrap'} padding={"0 2rem"} justifyContent={'space-between'} >
            {/* {!message || !message.length ? <Center flex={1}><Heading>Please Select a stock for trade</Heading></Center> : <>
               
            </>} */}
            {/* <ReactApexChart
                    type="candlestick"
                    options={RealTimeChartOptions}
                    series={[]}
                /> */}
            <ReactApexChart
                type="candlestick"
                options={createAnnotationsLines(dailyChartData, DailyChartOptions)}
                height={500}
                width={800}
                series={[{
                    data: handleChartData(dailyChartData), name: 'candle',
                    type: 'candlestick'
                }]}
            />
            <ReactApexChart
                type="candlestick"
                height={500}
                width={800}
                options={createAnnotationsLines(hourlyChartData, HourlyChartOptions)}
                series={[{
                    data: handleChartData(hourlyChartData), name: 'candle',
                    type: 'candlestick'
                }]}
            />
            <ReactApexChart
                type="candlestick"
                height={500}
                width={800}
                options={createAnnotationsLines(minutesChartData, MinutesChartOptions)}
                series={[{
                    data: handleChartData(minutesChartData), name: 'candle',
                    type: 'candlestick'
                }]}
            />
        </Flex>
    )
}
