import React, { useEffect } from "react";
import apexchart from "apexcharts";
import { Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import { useWebSocket } from "../../hooks/useWebSocket";
import ReactApexChart from "react-apexcharts";
import { DailyChartOptions, HourlyChartOptions, RealTimeChartOptions } from "../../consts/apexChartOptions";
import { handleChartData } from "../../utils/handleChartData";
import { createAnnotationsLines } from "../../utils/createAnnotationsLines";

export const MarketDataGraphs: React.FC = (props) => {
    const { ws, message, error } = useWebSocket('ws://localhost:8080')

    useEffect(() => {
        if (!message || !message.length) return
        const dailyChart = message.filter(data => data.reqId === 6000)
        handleDailyChart(dailyChart)
        const hourlyChart = message.filter(data => data.reqId === 6001)
        handleHourlyChart(hourlyChart)
        // const realTimeData = message.filter(data => data.reqId === 6003)
        // handleRealTimeChart(realTimeData)
    }, [message])


    const handleDailyChart = (dailyChart: any[]) => {
        apexchart.exec('6000', 'updateOptions', createAnnotationsLines(dailyChart, DailyChartOptions))
        apexchart.exec('6000', 'updateSeries', [{
            data: handleChartData(dailyChart), name: 'candle',
            type: 'candlestick'
        }])
    }

    const handleHourlyChart = (hourlyChart: any[]) => {
        const hourlySeries = [{
            data: handleChartData(hourlyChart), name: 'candle',
            type: 'candlestick'
        }]
        apexchart.exec('6001', 'updateOptions', createAnnotationsLines(hourlyChart, HourlyChartOptions))
        apexchart.exec('6001', 'updateSeries', hourlySeries)
    }

    const handleRealTimeChart = (realTime: any[]) => {
        apexchart.exec('6003', 'updateSeries', [{
            data: handleChartData(realTime), name: 'candle',
            type: 'candlestick'
        }])
    }

    return (
        <Flex margin={'2rem 0'} flexWrap={'wrap'} padding={"0 2rem"} justifyContent={'space-between'} >
            {!message || !message.length ? <Center flex={1}><Heading>Please Select a stock for trade</Heading></Center> : <>
                <ReactApexChart
                    type="candlestick"
                    options={DailyChartOptions}
                    series={[]}
                />
                <ReactApexChart
                    type="candlestick"
                    options={HourlyChartOptions}
                    series={[]}
                />
                {/* <ReactApexChart
                    type="candlestick"
                    options={RealTimeChartOptions}
                    series={[]}
                /> */}
            </>}
        </Flex>
    )
}
