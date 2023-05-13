import React, { useEffect } from "react";
import apexchart from "apexcharts";
import { Center, Flex, Spinner } from "@chakra-ui/react";
import { useWebSocket } from "../../hooks/useWebSocket";
import ReactApexChart from "react-apexcharts";
import { DailyChartOptions, HourlyChartOptions } from "../../consts/apexChartOptions";


export const MarketDataGraphs: React.FC = (props) => {
    const { ws, message, error } = useWebSocket('ws://localhost:8080')
    
    useEffect(() => {
        if (!message || !message.length) return
        const dailyChart = message.filter(data => data.reqId === 6000)
        handleDailyChart(dailyChart)
        const hourlyChart = message.filter(data => data.reqId === 6001)
        handleHourlyChart(hourlyChart)
    }, [message])


    const handleDailyChart = (dailyChart: any[]) => {
        apexchart.exec('6000', 'updateSeries', [{data: handleChartData(dailyChart)}])
    }

    const handleHourlyChart = (hourlyChart: any[]) => {
        apexchart.exec('6001', 'updateSeries', [{data: handleChartData(hourlyChart)}])
    }

    const handleChartData= (chartData: any[]) => {
       return chartData.map(item => {
            const { open, high, low, close, date, reqId } = item
            const priceLevels = [open, high, low, close]
            if(!date || !priceLevels || priceLevels.includes(-1)) return
            return {
                x: date, 
                y: priceLevels
            }
        }).filter(item => !!item)
    }


    return (
        <Flex margin={'2rem 0'} flexWrap={'wrap'} padding={"0 2rem"} justifyContent={'space-between'} >
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
            {/* <Chart
                key={stockMinuteSeries.reqId}
                type="candlestick"
                options={staticChartOptions}
                series={[{ data: stockMinuteSeries.series[0].data }]}
                width={500}
                height={500}
            /> */}
            {/* <Center flex={1}><Spinner size='xl' speed='0.65s' thickness='6px' /></Center> */}
        </Flex>
    )
}
