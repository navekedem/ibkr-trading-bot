import { BarSizeSetting, Contract, ContractDetails, ErrorCode, EventName, IBApi, NewsProvider, SecType, Stock } from '@stoqey/ib';
import WebSocket from 'ws';
import { Company } from '../types/company';
import { formatDateToCustomString, parseDateStringNative } from './utils/general';

// const app = express();
// const server = http.createServer(app)
//Date.parse(`${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)} ${time.substring(10)}`),
const wss = new WebSocket.Server({ port: 8080 });
let connected = false;
let providers: NewsProvider[] = [];
let contract: Contract = {
    secType: SecType.STK,
};
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

ib.on(EventName.newsProviders, (newsProviders: NewsProvider[]) => {
    // console.log('newsProviders', newsProviders);
    providers = [...newsProviders];
});

ib.on(EventName.contractDetails, (reqId: number, contractDetails: ContractDetails) => {
    console.log('contractDetails', JSON.stringify(contractDetails));

    if (contract.symbol === contractDetails.contract.symbol && contract.conId) return;
    contract.conId = contractDetails.contract.conId;
    // console.log((contract.conId = contractDetails.contract.conId));
    // console.log('ids', contract.conId, contractDetails.contract.conId);
    if (providers.length) {
        const codes = providers.map((provider) => provider.providerCode).join('+');
        const date = new Date();
        const today = formatDateToCustomString(date);
        date.setMonth(date.getMonth() - 1);
        const beforeOneMonth = formatDateToCustomString(date);
        console.log('items', 6000, contract.conId!, providers[0].providerCode!, today, beforeOneMonth, 50);
        // ib.reqHistoricalNews(6000, contract.conId!, providers[0].providerCode!, today, beforeOneMonth, 50);
    }
});
ib.on(EventName.historicalNews, (reqId: number, time: string, providerCode: string, articleId: string, headline: string) => {
    // console.log('contractDetails', contractDetails);
    console.log(headline);
});

if (!connected) {
    ib.connect();
}

const aggregationBuffer: any = {};

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        if (!message) return;
        console.log(`Recived Message => ${message}`);
        const parsedMessage = JSON.parse(message) as Company;
        const stock = new Stock(parsedMessage.ticker, undefined, 'USD');
        contract.symbol = parsedMessage.ticker;
        contract.currency = parsedMessage.currency_name;
        ib.reqNewsProviders();
        ib.reqContractDetails(2001, contract);
        ib.reqHistoricalData(6000, stock, '', '2 M', BarSizeSetting.DAYS_ONE, 'ADJUSTED_LAST', 1, 1, false);
        // ib.reqNewsArticle(2000, stock);
        // ib.reqHistoricalNews(2000, contract.conId);
        ib.reqHistoricalData(6001, stock, '', '1 W', BarSizeSetting.HOURS_ONE, 'ADJUSTED_LAST', 1, 1, false);
        ib.reqHistoricalData(6002, stock, '', '3600 S', BarSizeSetting.MINUTES_ONE, 'ADJUSTED_LAST', 1, 1, false);
        // ib.reqRealTimeBars(6003, stock, 5, 'TRADES', true);
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
                date: parseDateStringNative(time),
                open,
                high,
                low,
                close,
                volume,
                WAP,
            };
            if (!tickerData.date || (!tickerData.close && !tickerData.open)) return;
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
