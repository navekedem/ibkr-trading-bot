import WebSocket from 'ws'
import Alpaca from "@alpacahq/alpaca-trade-api";
import { MarketData } from "../types/market-data";
const wss = new WebSocket.Server({ port: 8080 });
const alpaca = new Alpaca({
    keyId: 'PK0QA42MWURMF476WSJC',
    secretKey: 'tNd1pISH73KjhAfGqSyV9aerpyP8oEQNisf3JTkJ',
    baseUrl: "https://paper-api.alpaca.markets",
    paper: true,
})
const alpacaWebSocket = alpaca.data_stream_v2
alpacaWebSocket.connect();


const currentDate = new Date();
const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
currentDate.setDate(currentDate.getDate() + currentDate.getDay());
const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));

// Function to format a date as "yyyy-mm-dd"
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


wss.on('connection', (ws: WebSocket) => {
    ws.on('message', async (message: string) => {
        if (!message) return;
        console.log(`Recived Message => ${message}`);
        alpacaWebSocket.subscribeForBars([message]);
        const formattedStartOfWeek = formatDate(startOfWeek);
        const formattedEndOfWeek = formatDate(endOfWeek);
        alpacaWebSocket.onError((err) => {
            console.log("Error:", err);
        });
        // const dailyChart = alpaca.getBarsV2(message, {
        //   start: formattedStartOfWeek,
        //   end: formattedEndOfWeek,
        //   timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.DAY),
        // })
        // const hourChart = alpaca.getBarsV2(message, {
        //   start: formattedStartOfWeek,
        //   end: formattedEndOfWeek,
        //   timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.HOUR),
        // })
        // for await (let daily of dailyChart) {
        //   ws.send(
        //     JSON.stringify(formatAlpacaData(daily, 6001))
        //   );
        // }
        // for await (let hourly of hourChart) {
        //   ws.send(
        //     JSON.stringify(formatAlpacaData(hourly, 6001))
        //   );
        // }
        // console.log(got);
        // const contract = new Stock(message, undefined, 'USD')
        // ib.reqHistoricalData(6000, contract, '', '1 M', BarSizeSetting.DAYS_ONE, 'ADJUSTED_LAST', 1, 1, false);
        // ib.reqHistoricalData(6001, contract, '', '1 W', BarSizeSetting.HOURS_ONE, 'ADJUSTED_LAST', 1, 1, false);
        // ib.reqHistoricalData(6002, contract, '', '3600 S', BarSizeSetting.MINUTES_ONE, 'ADJUSTED_LAST', 1, 1, false);
        // ib.reqRealTimeBars(6003, contract, 5, 'TRADES', true);
    })

    alpacaWebSocket.onStockBar((trade) => {
        console.log("Bar:", trade);
        const tickerData = {
            reqId: 6002,
            date: new Date(trade.Timestamp).getTime(),
            open: trade.OpenPrice,
            high: trade.HighPrice,
            low: trade.LowPrice,
            close: trade.ClosePrice,
            volume: trade.Volume
        }
        ws.send(
            JSON.stringify(tickerData)
        );
    });

})


// Format the start and end of the week

const getTimeframe = () => {
    const start = new Date();
    const end = new Date();
    start.setMonth(start.getMonth() - 1)
    return { end, start }
}


const formatAlpacaData = (item: any, reqId: number) => {
    return {
        reqId,
        date: item.Timestamp,
        open: item.OpenPrice,
        high: item.HighPrice,
        low: item.LowPrice,
        close: item.ClosePrice,
        volume: item.Volume
    }
}

