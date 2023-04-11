import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import apexchart, { ApexOptions } from "apexcharts";
import { Flex, Spinner } from "@chakra-ui/react";

const chartOptions: ApexOptions = {
    chart: {
        type: "candlestick",
        height: 350,
        // id: "ibkr-chart",
        toolbar: {
            show: false,
        }
    },
    title: {
        text: "Interactive Brokers Bot Chart"
    },
    xaxis: {
        type: "datetime"
    },
    yaxis: {
        min: 0,
        forceNiceScale: true,
        tooltip: {
            enabled: true
        }
    }
}

interface CustomSeries {
    reqId: number
    series: ApexAxisChartSeries
}




export const MarketDataGraphs: React.FC = (props) => {
    const [stocksSeries, setSeries] = useState<CustomSeries[]>([])

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };
        ws.onmessage = (event) => {
            const { open, high, low, close, date, reqId } = JSON.parse(event.data)
            const priceLevels = [open, high, low, close]
            setSeries(prevSeriesState => {
                const foundedSeries = prevSeriesState.find(series => series.reqId === reqId)
                //@ts-ignore
                if (foundedSeries) foundedSeries.series[0].data.push({ x: date, y: priceLevels })
                else {
                    const series = {
                        reqId: reqId,
                        series: [
                            {
                                data: [{ x: date, y: priceLevels }]
                            }
                        ]
                    }
                    prevSeriesState.push(series)
                }
                return prevSeriesState
            })
            // apexchart.exec("ibkr-chart", 'updateSeries', series)
        };
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, [])


    return (
        <Flex margin={'2rem 0'}>
            {stocksSeries.length ? stocksSeries.map(series => {
               return <Chart
                    type="candlestick"
                    options={chartOptions}
                    series={series.series}
                    width={1300}
                    height={800}
                />
            }) : <Spinner size='lg' />}

        </Flex>
    )
}
