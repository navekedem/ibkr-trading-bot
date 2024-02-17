import { IBApi, EventName, ErrorCode, Contract, Stock, BarSizeSetting, Bar } from "@stoqey/ib";
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

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (message: string) => {
    if (!message) return;
    console.log(`Recived Message => ${message}`);
    alpacaWebSocket.subscribeForBars([message]);
    alpacaWebSocket.onError((err) => {
      console.log("Error:", err);
    });
    const dailyChart = alpaca.getBarsV2('AAPL', {
      start: "2024-01-02",
      end: "2024-02-15",
      timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.DAY),
    })
    const got = [];
    for await (let b of dailyChart) {
      got.push(b);
    }
    console.log(got);
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



const getTimeframe = () => {
  const start = new Date();
  const end = new Date();
  start.setMonth(start.getMonth() - 1)
  return { end, start }
}


const formatAlpacaData = (data: any, reqId: string) => {
  return data.map((item) => ({
    reqId,
    date: item.Timestamp,
    open: item.OpenPrice,
    high: item.HighPrice,
    low: item.LowPrice,
    close: item.ClosePrice,
    volume: item.Volume
  }))
}

