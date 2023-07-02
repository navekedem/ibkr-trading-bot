import React, { useEffect } from "react";
import apexchart from "apexcharts";
import { Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import { useWebSocket } from "../../hooks/useWebSocket";
import ReactApexChart from "react-apexcharts";
import { DailyChartOptions, HourlyChartOptions, RealTimeChartOptions } from "../../consts/apexChartOptions";


export const MarketDataGraphs: React.FC = (props) => {
    const { ws, message, error } = useWebSocket('ws://localhost:8080')

    useEffect(() => {
        if (!message || !message.length) return
        const dailyChart = message.filter(data => data.reqId === 6000)
        handleDailyChart(dailyChart)
        const hourlyChart = message.filter(data => data.reqId === 6001)
        handleHourlyChart(hourlyChart)
        const realTimeData = message.filter(data => data.reqId === 6003)
        handleRealTimeChart(realTimeData)
    }, [message])


    const handleDailyChart = (dailyChart: any[]) => {
        apexchart.exec('6000', 'updateSeries', [{ data: handleChartData(dailyChart), name: 'candle',
        type: 'candlestick' }])
    }

    const handleHourlyChart = (hourlyChart: any[]) => {
        apexchart.exec('6001', 'updateSeries', [{ data: handleChartData(hourlyChart), name: 'candle',
        type: 'candlestick' }])
    }

    const handleRealTimeChart = (realTime: any[]) => {
        apexchart.exec('6003', 'updateSeries', [{ data: handleChartData(realTime),  name: 'candle',
        type: 'candlestick' }])
    }

    const handleChartData = (chartData: any[]) => {
        return chartData.map(item => {
            const { open, high, low, close, date } = item
            const priceLevels = [open, high, low, close]
            if (!date || !priceLevels || priceLevels.includes(-1)) return
            return {
                x: date,
                y: priceLevels
            }
        }).filter(item => !!item)
    }


    return (
        <Flex margin={'2rem 0'} flexWrap={'wrap'} padding={"0 2rem"} justifyContent={'space-between'} >
            {!message || !message.length ? <Center flex={1}><Heading>Please Select a stock for trade</Heading></Center> : <>
                <ReactApexChart
                    type="candlestick"
                    options={DailyChartOptions}
                    series={[]}
                    width={500}
                    height={500}
                />
                <ReactApexChart
                    type="candlestick"
                    options={HourlyChartOptions}
                    series={[]}
                    width={500}
                    height={500}
                />
                <ReactApexChart
                    type="candlestick"
                    options={RealTimeChartOptions}
                    series={[]}
                    width={500}
                    height={500}
                />
            </>}
        </Flex>
    )
}
