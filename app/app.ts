import { BarSizeSetting, ErrorCode, EventName, IBApi, Stock } from '@stoqey/ib';
import WebSocket from 'ws';

// const app = express();
// const server = http.createServer(app)
const wss = new WebSocket.Server({ port: 8080 });
let connected = false;
const ib = new IBApi({ port: 7497 });

ib.on(EventName.result, (event: string, args: string[]) => {
    // console.log(`${event} ${JSON.stringify(args)}`)
});

ib.on(EventName.connected, () => {
    connected = true;
    console.log('Connected!');
});

ib.on(EventName.disconnected, () => {
    connected = false;
    console.log('Disconnected!');
});
ib.on(EventName.error, (error: Error, code: ErrorCode, reqId: number) => {
    connected = false;
    console.log(error);
});

if (!connected) {
    ib.connect();
}

const aggregationBuffer: any = {};
wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        if (!message) return;
        console.log(`Recived Message => ${message}`);
        const contract = new Stock(message, undefined, 'USD');
        ib.reqHistoricalData(6000, contract, '', '1 M', BarSizeSetting.DAYS_ONE, 'ADJUSTED_LAST', 1, 1, false);
        ib.reqHistoricalData(6001, contract, '', '1 W', BarSizeSetting.HOURS_ONE, 'ADJUSTED_LAST', 1, 1, false);
        ib.reqHistoricalData(6002, contract, '', '3600 S', BarSizeSetting.MINUTES_ONE, 'ADJUSTED_LAST', 1, 1, false);
        ib.reqRealTimeBars(6003, contract, 5, 'TRADES', true);
    });

    ib.on(
        EventName.historicalData,
        (
            reqId: number,
            time: string,
            open: number,
            high: number,
            low: number,
            close: number,
            volume: number,
            count: number | undefined,
            WAP: number,
            hasGaps: boolean | undefined,
        ) => {
            const tickerData = {
                reqId,
                date: Date.parse(`${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)} ${time.substring(10)}`),
                open,
                high,
                low,
                close,
                volume,
                WAP,
            };
            ws.send(JSON.stringify(tickerData));
        },
    );
    ib.on(
        EventName.realtimeBar,
        (reqId: number, time: number, open: number, high: number, low: number, close: number, volume: number, wap: number, count: number) => {
            if (!aggregationBuffer[reqId]) {
                aggregationBuffer[reqId] = {
                    open: null,
                    high: -Infinity,
                    low: Infinity,
                    close: null,
                    volume: 0,
                    startTime: Date.now(),
                };
            }

            const buffer = aggregationBuffer[reqId];
            if (buffer.open === null) {
                buffer.open = open;
            }
            buffer.high = Math.max(buffer.high, high);
            buffer.low = Math.min(buffer.low, low);
            buffer.close = close; // Always set the close to the last close value within the minute
            buffer.volume += volume;

            // Check if one minute has passed
            if (Date.now() - buffer.startTime >= 60000) {
                // Send aggregated data

                // Reset the buffer for the next minute
                aggregationBuffer[reqId] = {
                    open: null,
                    high: -Infinity,
                    low: Infinity,
                    close: null,
                    volume: 0,
                    startTime: Date.now(),
                };
            }
            const aggregatedData = {
                reqId: reqId,
                open: buffer.open,
                high: buffer.high,
                date: buffer.startTime,
                low: buffer.low,
                close: buffer.close,
                volume: buffer.volume,
            };
            ws.send(JSON.stringify(aggregatedData));
            // const tickerData = {
            //   reqId,
            //   date: new Date(time * 1000).getTime(),
            //   open,
            //   high,
            //   low,
            //   close,
            //   volume,
            // }
            // ws.send(
            //   JSON.stringify(tickerData)
            // );
        },
    );
});
