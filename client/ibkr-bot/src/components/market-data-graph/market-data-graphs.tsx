// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { MarketData } from "../../types/market-data";
import Chart from "react-apexcharts";
import apexchart, { ApexOptions } from "apexcharts";



interface MarketDataGraphsProps { }

const chartOptions: ApexOption = {
    chart: {
        type: "candlestick",
        height: 350,
        id: "ibkr-chart",
    },
    title: {
        text: "Interactive Brokers Bot Chart"
    },
    xaxis: {
        type: "datetime"
    },
    yaxis: {
        tooltip: {
            enabled: true
        }
    }
}

const MarketDataGraphs: React.FC<MarketDataGraphsProps> = (props) => {
    const [series, setSeries] = useState([
        {
            data: []
        }
    ])
    // const {current: marketData} = marketDataState
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };
        ws.onmessage = (event) => {
            const { open, high, low, close, time } = JSON.parse(event.data)
            const date = new Date(Date.parse(`${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)}`))
            const priceLevels = [open, high, low, close]

            setSeries(prevSeriesState => {
                prevSeriesState[0].data.push({ x: date, y: priceLevels })
                return prevSeriesState
            })
            apexchart.exec("ibkr-chart", 'updateSeries', series)
        };
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    })


    return (
        <div>
            <h1>Market Data Graphs</h1>
            <Chart
                type="candlestick"
                options={chartOptions}
                series={series}
                width={500}
                height={500}
            />
        </div>
    )
}

export default MarketDataGraphs