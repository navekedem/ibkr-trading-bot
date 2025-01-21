import type { ContractDetails, NewsProvider } from '@stoqey/ib';
import { ErrorCode, EventName, IBApi, Stock } from '@stoqey/ib';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import type { Company, CompanyAnalysis } from '../types/company';
import { aggregateMinutesChart, formatDateToCustomString, parseDateStringNative, triggerInteractiveEvents } from './utils/general.ts';

const app = express();
app.use(cors());
app.use(express.json());
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
    { providerCode: 'DJNL', providerName: 'Dow Jones Newsletters' },
];
const prompt = `You are a knowledgeable financial analyst. I will provide you with JSON data for a specific stock.
First, search the web for recent news, company reports, and market updates that could influence the stock's price.
Next, analyze both the data you collected and the JSON data I provided.
Finally, return your analysis strictly in the following JSON format:
{
    "position": "",        // Options: "long" or "short"  
    "buyPrice": "",        // Recommended buy price  
    "sellPrice": "",       // Target sell price  
    "stoploss": "",        // Suggested stop-loss price  
    "riskLevel": "",       // Options: "low", "medium", "high"  
    "confidenceScore": "", // Confidence in analysis (0-100%)  
    "keyInsights": ""      // Brief summary of important news/events affecting the stock  
}


⚠️ Important: Provide only the JSON response in the exact format above—no additional text or explanations.

Additional Notes:
Focus on short-term trading opportunities.
Prioritize information from the past 30 days.
Ignore speculative news with low credibility.
`;

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

ib.on(EventName.historicalNews, (reqId: number, time: string, providerCode: string, articleId: string, headline: string) => {
    const newsData = {
        time,
        providerCode,
        headline,
    };
    console.log('historicalNews', newsData);
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
            if (!aggregatedData.date || (!aggregatedData.close && !aggregatedData.open)) return;
            ws.send(JSON.stringify(aggregatedData));
        },
    );
});

app.post('/analyze', async (req, res) => {
    try {
        const companyAnalysis = req.body as CompanyAnalysis;
        if (!companyAnalysis) {
            return res.status(400).json({ error: 'Company analysis is required' });
        }
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-online',
                temperature: 0.2,
                top_p: 0.9,
                search_domain_filter: ['perplexity.ai'],
                return_images: false,
                return_related_questions: false,
                search_recency_filter: 'month',
                top_k: 0,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 1,
                messages: [
                    {
                        role: 'system',
                        content: prompt,
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(companyAnalysis),
                    },
                ],
            }),
        });
        const data = await response.json();
        const analysisResponse = JSON.parse(data?.choices?.[0].message.content);
        res.json(analysisResponse);
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
