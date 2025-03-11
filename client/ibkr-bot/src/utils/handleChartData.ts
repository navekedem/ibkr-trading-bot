import { Company, CompanyAnalysis, CompanyNewsHeadline } from '@app-types/company';
import { MarketData } from '@app-types/market-data';
import { dc, macd, rsi, vpt } from 'indicatorts';
import { findResistance } from './findResistance';
import { findSupport } from './findSupport';

const macdDefaultConfig = { fast: 12, slow: 26, signal: 9 };
const rsiConfig = { period: 14 };
const dcConfig = { period: 4 };

export const handleChartData = (chartData: MarketData[]): any => {
    return chartData.map((item) => handleSingleCandle(item)).filter(Boolean);
};

export const handleSingleCandle = (candleData: MarketData): any => {
    const { open, high, low, close, date } = candleData;
    const priceLevels = [open, high, low, close];
    if (!date || !priceLevels || priceLevels.includes(-1)) return;
    return {
        x: date,
        y: priceLevels as any,
    };
};

export const getIndicatorsValues = (closingPrices: number[], volumes: number[]) => {
    const { macdLine, signalLine } = macd(closingPrices, macdDefaultConfig);
    const rsiResult = rsi(closingPrices, rsiConfig);
    const vptResult = vpt(closingPrices, volumes);
    const { upper, middle, lower } = dc(closingPrices, dcConfig);
    return {
        macd: {
            macdLine,
            signalLine,
        },
        rsi: rsiResult,
        volumePriceTrend: vptResult,
        donchianChannels: {
            upper,
            middle,
            lower,
        },
    };
};

export const createAnalysis = (prices: MarketData[], company: Company, newsHeadlines: CompanyNewsHeadline[]): CompanyAnalysis => {
    const support = findSupport(prices).map((line) => line.value);
    const resistance = findResistance(prices).map((line) => line.value);
    const stockLatestPrices = prices.map(({ close, date, volume }) => ({
        close,
        date,
        volume,
    }));
    const closingPrices = prices.map(({ close }) => close);
    const volumes = prices.map(({ close }) => close);
    const indicators = getIndicatorsValues(closingPrices, volumes);
    const latestNewsTitles = newsHeadlines.map(({ headline }) => headline);

    return {
        name: company.name,
        ticker: company.ticker,
        currentStockPrice: prices.at(-1)?.close || 0,
        timeframe: 'daily',
        supportLines: support,
        resistanceLines: resistance,
        latestTwoMonthPrices: stockLatestPrices,
        indicators,
        maxResistance: Math.max(...resistance),
        minSupport: Math.min(...support),
        latestNewsTitles,
    };
};
