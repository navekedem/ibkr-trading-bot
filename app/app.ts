import type { ContractDetails, NewsProvider, Order } from '@stoqey/ib';
import { ErrorCode, EventName, IBApi, OrderAction, OrderType, Stock } from '@stoqey/ib';
import OpenAI from 'openai';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import type { Company, CompanyAnalysis } from '../types/company';
import { aggregateMinutesChart, formatDateToCustomString, parseDateStringNative, triggerInteractiveEvents } from './utils/general.ts';
import { dayTradeScanPrompt, tradePrompt } from './utils/prompts.ts';
import { analysisSchema, dayTradeSchema, swingTradeSchema } from './utils/schemas.ts';
import { investingPreMarketMostActiveScanner, stockTwitsMostActiveScanner, stockTwitsTrendingScanner } from './utils/tools.ts';

const app = express();
app.use(cors());
app.use(express.json());
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
let connected = false;
let newProviders: NewsProvider[] = [
    { providerCode: 'BRFG', providerName: 'Briefing.com General Market Columns' },
    { providerCode: 'BRFUPDN', providerName: 'Briefing.com Analyst Actions' },
    { providerCode: 'DJ-N', providerName: 'Dow Jones News Service' },
    { providerCode: 'DJ-RT', providerName: 'Dow Jones Trader News' },
    { providerCode: 'DJ-RTA', providerName: 'Dow Jones Real-Time News Asia Pacific' },
    { providerCode: 'DJ-RTE', providerName: 'Dow Jones Real-Time News Europe' },
    { providerCode: 'DJ-RTG', providerName: 'Dow Jones Real-Time News Global' },
];
const perplexityUrl = 'https://api.perplexity.ai/chat/completions';
const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
const openAIUrl = 'https://api.openai.com/v1/responses';
const ib = new IBApi({ port: 7497 });

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
    console.log(`Error ${code} (${reqId}): ${error}`);
});

ib.on(EventName.newsProviders, (newsProviders: NewsProvider[]) => {
    // console.log('Available news providers:', newsProviders);
    newProviders = newProviders;
});

ib.on(EventName.contractDetails, (reqId: number, contractDetails: ContractDetails) => {
    console.log('contractDetails - here', contractDetails);
    const providersCodeFormat = newProviders.map((provider) => provider.providerCode).join('+');
    console.log('providersCodeFormat', providersCodeFormat);
    const date = new Date();
    const today = formatDateToCustomString(date);
    date.setMonth(date.getMonth() - 1);
    const beforeOneMonth = formatDateToCustomString(date);
    ib.reqHistoricalNews(3002, contractDetails.contract.conId, providersCodeFormat, beforeOneMonth, today, 50, null);
});

ib.on(EventName.historicalNewsEnd, (reqId: number, hasMore: boolean) => {
    console.log('hasMore', hasMore);
});

if (!connected) {
    ib.connect();
}

wss.on('connection', (ws: WebSocket) => {
    ws.onmessage = (message: MessageEvent) => {
        if (!message) return;
        console.log(`Received Message => ${message.data}`);
        const parsedMessage = JSON.parse(message.data) as Company;
        const stock = new Stock(parsedMessage.ticker, undefined, 'USD');
        triggerInteractiveEvents(ib, stock);
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
            const aggregatedData = aggregateMinutesChart(reqId, open, high, low, close, volume);
            console.log('aggregatedData', aggregatedData);
            if (!aggregatedData.date || (!aggregatedData.close && !aggregatedData.open)) return;
            ws.send(JSON.stringify(aggregatedData));
        },
    );
    ib.on(EventName.historicalNews, (reqId: number, time: string, providerCode: string, articleId: string, headline: string) => {
        const newsData = {
            reqId,
            time,
            providerCode,
            headline: headline.split('}')[1],
            articleId,
        };
        ws.send(JSON.stringify(newsData));
    });
});

app.post('/analyze', async (req, res) => {
    try {
        const companyAnalysis = req.body as CompanyAnalysis;
        if (!companyAnalysis) {
            return res.status(400).json({ error: 'Company analysis is required' });
        }
        const response = await fetch(openRouterUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini-search-preview',
                response_format: {
                    type: 'json_schema',
                    json_schema: analysisSchema,
                },
                messages: [
                    {
                        role: 'system',
                        content: tradePrompt,
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(companyAnalysis),
                    },
                ],
            }),
        });
        const data = await response.json();
        console.log('Response from OpenRouter:', JSON.stringify(data));
        const message = data?.choices?.[0].message.content.replace(/```json\n|\n```/g, '');
        const analysisResponse = JSON.parse(message);
        res.json(analysisResponse);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze company',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

app.post('/submit-order', (req, res) => {
    const { symbol, action, quantity, entryPrice, stoploss, takeProfit } = req.body;
    console.log(req.body);
    if (!symbol || !action || !quantity || !entryPrice || !stoploss || !takeProfit) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const contract = new Stock(symbol, undefined, 'USD');
        const mainOrder: Order = {
            action: action,
            totalQuantity: quantity,
            orderType: OrderType.LMT,
            lmtPrice: entryPrice,
            transmit: false, // This will be part of bracket order
            tif: 'GTC',
        };

        const stopOrder: Order = {
            action: action === OrderAction.BUY ? OrderAction.SELL : OrderAction.BUY,
            totalQuantity: quantity,
            orderType: OrderType.STP,
            auxPrice: stoploss,
            transmit: false,
            tif: 'GTC',
        };

        const takeProfitOrder: Order = {
            action: action === OrderAction.BUY ? OrderAction.SELL : OrderAction.BUY,
            totalQuantity: quantity,
            orderType: OrderType.LMT,
            lmtPrice: takeProfit,
            transmit: true, // Last order in the bracket needs to transmit
            tif: 'GTC',
        };

        // Getting next valid order ID
        ib.reqIds(-1);
        ib.once(EventName.nextValidId, (orderId: number) => {
            // Place bracket order
            ib.placeOrder(orderId, contract, mainOrder);
            ib.placeOrder(orderId + 1, contract, { ...stopOrder, parentId: orderId });
            ib.placeOrder(orderId + 2, contract, { ...takeProfitOrder, parentId: orderId });

            res.json({
                success: true,
                message: 'Bracket order placed successfully',
                mainOrderId: orderId,
                stopOrderId: orderId + 1,
                takeProfitOrderId: orderId + 2,
            });
        });
    } catch (error) {
        console.error('Order placement error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to place order',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

app.get('/scan-market', async (req, res) => {
    try {
        const isSwing = req.query.isSwing === 'true';
        const response = await client.responses.create({
            model: 'gpt-5-mini',
            instructions: 'Use the stockTwitsTrendingScanner and stockTwitsMostActiveScanner tools before you perform the web search',
            text: {
                format: {
                    type: 'json_schema',
                    name: 'market_scan',
                    strict: true,
                    schema: isSwing ? swingTradeSchema : dayTradeSchema,
                },
            },
            tool_choice: 'required',
            tools: [
                {
                    type: 'function',
                    name: 'stockTwitsTrendingScanner',
                    description: 'Get trending stocks from StockTwits with fundamental data including 50-day moving average, volume, and earnings growth',
                    // call: stockTwitsTrendingScanner,
                    parameters: {
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
                {
                    type: 'function',
                    name: 'stockTwitsMostActiveScanner',
                    description: 'Get most active stocks from StockTwits with price data and trading activity',
                    // call: stockTwitsMostActiveScanner,
                    parameters: {
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
                {
                    type: 'function',
                    name: 'investingPreMarketMostActiveScanner',
                    description: 'Get pre-market data including most active, gainers, and losers with extended session trading data',
                    // call: investingPreMarketMostActiveScanner,
                    parameters: {
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
                // { type: 'web_search' },
            ],
            input: [
                {
                    role: 'user',
                    content: dayTradeScanPrompt(new Date().toISOString()),
                },
            ],
        });
        const data = response.output;
        console.log('Response from OpenAI:', JSON.stringify(data));
        console.log('Response from OpenAI:', response);
        // const message = data?.output?.find((item: any) => item.type === 'message' && item.status === 'completed')?.content?.[0]?.text;
        // const message = data?.choices?.[0].message.content.replace(/```json\n|\n```/g, '');
        // const analysisResponse = JSON.parse(message);
        // res.json(analysisResponse);
        res.status(200).json(data);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze company',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
