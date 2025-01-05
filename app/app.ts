import type { Contract, ContractDetails, NewsProvider } from '@stoqey/ib';
import { BarSizeSetting, ErrorCode, EventName, IBApi, SecType, Stock } from '@stoqey/ib';
import { WebSocketServer } from 'ws';
import type { Company } from '../types/company';
import { parseDateStringNative } from './utils/general.ts';

// const app = express();
// const server = http.createServer(app)
//Date.parse(`${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)} ${time.substring(10)}`),
const wss = new WebSocketServer({ port: 8080 });
let connected = false;
let providers: NewsProvider[] = [];
let contract: Contract = {
    secType: SecType.STK,
};
const ib = new IBApi({ port: 7497 });
function formatDateForNews(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '');
}
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
    // try {
    //     console.log('Trying to reconnect!');
    //     ib.connect();
    //     connected = true;
    // } catch (error) {
    //     console.log(error);
    // }
});
ib.on(EventName.error, (error: Error, code: ErrorCode, reqId: number) => {
    // connected = false;
    console.log(`Error ${code} (${reqId}): ${error}`);
    if (reqId === 3001 || reqId === 6007) {
        console.error('News-related error:', {
            code,
            message: error.message,
            reqId,
        });
        return; // Don't disconnect for news-related errors
    }
    if ([ErrorCode.CONNECT_FAIL, ErrorCode.NOT_CONNECTED].includes(code)) {
        connected = false;
    }

    // Handle news-specific errors
    if (reqId === 6007) {
        console.error('News request error:', error.message);
    }
});

ib.on(EventName.newsProviders, (newsProviders: NewsProvider[]) => {
    providers = [...newsProviders];
    console.log('Available news providers:', newsProviders);
});

ib.on(EventName.contractDetails, (reqId: number, contractDetails: ContractDetails) => {
    if (reqId === 3001) {
        const conId = contractDetails.contract.conId;
        if (!conId) return;
        console.log('conId', conId);
        // Request historical news
        try {
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1); // One month ago
            const endDate = new Date(); // Today

            // Format dates in YYYYMMDD format
            // const start = startDate.toISOString().slice(0, 10).replace(/-/g, '');
            // const end = endDate.toISOString().slice(0, 10).replace(/-/g, '');
            const start = '20231201'; // December 1, 2023
            const end = '20240115'; // Ja
            ib.reqHistoricalNews(
                6007,
                conId,
                'BRFG', // Changed to Briefing.com General Market Columns
                '', // Empty string for start date
                '', // Empty string for end date
                5, // Keep small number of results
            );

            console.log('Historical news request sent:', {
                reqId: 6007,
                conId,
                provider: 'BRFG',
            });
        } catch (err) {
            console.error('Failed to request news:', err);
        }
    }
});

ib.on(EventName.historicalNews, (reqId: number, time: string, providerCode: string, articleId: string, headline: string) => {
    console.log('historicalNews - here');
    const newsData = {
        time,
        providerCode,
        headline,
    };
    console.log(newsData);
    // Send news through WebSocket
    // wss.clients.forEach((client) => {
    //     if (client.readyState === WebSocket.OPEN) {
    //         client.send(JSON.stringify({ type: 'news', data: newsData }));
    //     }
    // });
});

if (!connected) {
    ib.connect();
}

const aggregationBuffer: any = {};

wss.on('connection', (ws: WebSocket) => {
    ws.onmessage = (message: MessageEvent) => {
        if (!message) return;
        console.log(`Received Message => ${message.data}`);
        const parsedMessage = JSON.parse(message.data) as Company;
        const stock = new Stock(parsedMessage.ticker, undefined, 'USD');
        const newsContract: Contract = {
            symbol: parsedMessage.ticker,
            secType: SecType.STK,
            exchange: 'SMART',
            currency: 'USD',
        };
        contract.symbol = parsedMessage.ticker;
        contract.currency = parsedMessage.currency_name;
        ib.reqNewsProviders();
        // ib.reqContractDetails(3001, newsContract);
        ib.reqHistoricalData(6000, stock, '', '2 M', BarSizeSetting.DAYS_ONE, 'ADJUSTED_LAST', 1, 1, false);
        // ib.reqNewsArticle(2000, stock);
        // ib.reqHistoricalNews(2000, contract.conId);
        ib.reqHistoricalData(6001, stock, '', '1 W', BarSizeSetting.HOURS_ONE, 'ADJUSTED_LAST', 1, 1, false);
        ib.reqHistoricalData(6002, stock, '', '3600 S', BarSizeSetting.MINUTES_ONE, 'ADJUSTED_LAST', 1, 1, false);
    };
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

// const triggerInteractiveEvents = () => {
//     if (contract.symbol === contractDetails.contract.symbol && contract.conId) return;
//     contract.conId = contractDetails.contract.conId;

//     // Request historical news once we have the contract ID
//     const date = new Date();
//     const today = formatDateToCustomString(date);
//     date.setMonth(date.getMonth() - 1);
//     const beforeOneMonth = formatDateToCustomString(date);

//     // Request news for the last month
//     ib.reqHistoricalNews(
//         6000,
//         contract.conId!,
//         'BZ+DJ+MT+UK', // Common news providers (Benzinga, Dow Jones, MT Newswires)
//         today,
//         beforeOneMonth,
//         50, // Number of news items
//     );
// };
