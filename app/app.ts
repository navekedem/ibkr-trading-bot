// import express from 'express';
// const app = express();
// app.use(express.json());
// const PORT = 5000;
// app.get('/', (req, res, next) => {
//     res.status(200).json({
//         'message': 'Running Node with Express and Typescript'
//     });
// });
// app.listen(PORT, () => {
//     console.log(
//         `Server running on ${PORT}.`
//     )
// });
import { IBApi, EventName, ErrorCode, Contract, Stock, BarSizeSetting } from "@stoqey/ib";
import WebSocket from 'ws'
// create IBApi object


let positionsCount = 0;
// register event handler
// ib.on(EventName.error, (err: Error, code: ErrorCode, reqId: number) => {
//   console.error(`${err.message} - code: ${code} - reqId: ${reqId}`);
// })
//   .on(
//     EventName.position,
//     (account: string, contract: Contract, pos: number, avgCost?: number) => {
//       console.log(`${account}: ${pos} x ${contract.symbol} @ ${avgCost}`);
//       positionsCount++;
//     }
//   )
//   .once(EventName.positionEnd, () => {
//     console.log(`Total: ${positionsCount} positions.`);
//     ib.disconnect();
//   });

// call API functions


// ib.reqPositions();

const ib = new IBApi({
  // clientId: 0,
  // host: '127.0.0.1',
  port: 7497,
});
const tickerID = 6000
const contract = new Stock('AAPL', undefined, 'USD')
ib.connect();
ib.on(EventName.result, (event: string, args: string[]) => {
  console.log(`${event} ${JSON.stringify(args)}`)
})


const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    console.log(`Recived Message => ${message}`);
  })
  ib.reqHistoricalData(tickerID, contract, '', '1 Y', BarSizeSetting.DAYS_ONE, 'ADJUSTED_LAST', 1, 1, false);
  ib.on(EventName.historicalData, (reqId: number, time: string, open: number, high: number, low: number, close: number, volume: number, count: number | undefined, WAP: number, hasGaps: boolean | undefined) => {
    console.log(`open: ${open} close: ${close}`)
  
    const tickerData = {
      reqId,
      time,
      open,
      high,
      low,
      close,
      volume,
      WAP
    }
    ws.send(JSON.stringify(tickerData))
  })

})