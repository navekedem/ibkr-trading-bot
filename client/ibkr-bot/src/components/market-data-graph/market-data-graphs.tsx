import React, { useEffect, useRef, useState } from "react";
import { MarketData } from "../../types/market-data";

interface MarketDataGraphsProps { }

const MarketDataGraphs: React.FC<MarketDataGraphsProps> = (props) => {
    const marketDataState = useRef<MarketData[]>([])
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
            {marketDataState.current?.map(data => <p>{data.close}</p>)}
        </div>
    )
}

export default MarketDataGraphs