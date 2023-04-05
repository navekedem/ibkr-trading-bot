import React, { useEffect, useRef, useState } from "react";
import { MarketData } from "../../types/market-data";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";


interface MarketDataGraphsProps { }

const MarketDataGraphs: React.FC<MarketDataGraphsProps> = (props) => {
    const marketDataState = useRef<MarketData[]>([])
    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            type: "candlestick",
            height: 350
        },
        title: {
            text: "Candlestick Chart"
        },
        xaxis: {
            type: "datetime"
        },
        yaxis: {
            tooltip: {
            enabled: true
            }
        }
    })
    const [series, setSeries] = useState([
        {
          data: [
            {
              x: new Date(1538778600000),
              y: [6629.81, 6650.5, 6623.04, 6633.33]
            },
            {
              x: new Date(1538780400000),
              y: [6632.01, 6643.59, 6620, 6630.11]
            },
            {
              x: new Date(1538782200000),
              y: [6630.71, 6648.95, 6623.34, 6635.65]
            },
            {
              x: new Date(1538784000000),
              y: [6635.65, 6651, 6629.67, 6638.24]
            }
          ]
        }
      ])
    // const {current: marketData} = marketDataState
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };
        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
            marketDataState.current?.push(JSON.parse(event.data))  
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
            options={options}
            series={series}
            width={900}
            />
            {marketDataState.current?.map(data => <p>{data.close}</p>)}
        </div>
    )
}

export default MarketDataGraphs