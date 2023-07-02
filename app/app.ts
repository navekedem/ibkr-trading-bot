import { IBApi, EventName, ErrorCode, Contract, Stock, BarSizeSetting } from "@stoqey/ib";
import * as http from 'http';
import express, { Request, Response } from 'express';
import WebSocket from 'ws'

const app = express();
const server = http.createServer(app)
const wss = new WebSocket.Server({ port: 8080 });
let connected = false;
const ib = new IBApi({ port: 7497, });
const contract = new Stock('AAPL', undefined, 'USD')


ib.on(EventName.result, (event: string, args: string[]) => {
  console.log(`${event} ${JSON.stringify(args)}`)
})
ib.on(EventName.connected, () => {
  connected = true;
  console.log('Connected!');
});

ib.on(EventName.disconnected, () => {
  connected = false;
  console.log('Disconnected!');
});


if (!connected) {
  ib.connect();
}

app.get('/get-stock-data', function (req: Request, res: Response) {
  // handle WebSocket connections
  wss.on('connection', function (ws: WebSocket) {
    console.log('WebSocket connected');

    ws.on('message', function incoming(message: string) {
      console.log('received: %s', message);
      ws.send('ack'); // send acknowledgement message back to client
    });

    ws.on('close', function close() {
      console.log('WebSocket disconnected');
    });
  });

  // upgrade HTTP request to WebSocket
  server.on('upgrade', function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request); // emit connection event
    });
  });
});

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    console.log(`Recived Message => ${message}`);
  })
  ib.reqHistoricalData(6000, contract, '', '1 M', BarSizeSetting.DAYS_ONE, 'ADJUSTED_LAST', 1, 1, false);
  ib.reqHistoricalData(6001, contract, '', '1 W', BarSizeSetting.HOURS_ONE, 'ADJUSTED_LAST', 1, 1, false);
  // ib.reqHistoricalData(6002, contract, '', '3600 S', BarSizeSetting.MINUTES_ONE, 'ADJUSTED_LAST', 1, 1, false);
  ib.reqRealTimeBars(6003, contract, 5, 'TRADES', true);


  ib.on(EventName.historicalData, (reqId: number, time: string, open: number, high: number, low: number, close: number, volume: number, count: number | undefined, WAP: number, hasGaps: boolean | undefined) => {
    const tickerData = {
      reqId,
      date: Date.parse(`${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)} ${time.substring(10)}`),
      open,
      high,
      low,
      close,
      volume,
      WAP
    }
    ws.send(JSON.stringify(tickerData))
  })
  ib.on(EventName.realtimeBar, (reqId: number, time: number, open: number, high: number, low: number, close: number, volume: number, wap: number, count: number) => {
    const tickerData = {
      reqId,
      date: new Date(time),
      open,
      high,
      low,
      close,
      volume,
    }
    ws.send(
      JSON.stringify(tickerData)
    );
  });

})


app.listen(3000, () => {
  console.log(`Server is running`);
})