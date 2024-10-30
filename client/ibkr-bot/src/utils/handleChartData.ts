import { macd, rsi } from 'indicatorts';
import { Company, CompanyAnalysis } from '../../../../types/company';
import { MarketData } from '../../../../types/market-data';
import { findResistance } from './findResistance';
import { findSupport } from './findSupport';
const macdDefaultConfig = { fast: 12, slow: 26, signal: 9 };
const rsiConfig = { period: 14 };
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

export const getIndicatorsValues = (closingPrices: number[]) => {
    const { macdLine, signalLine } = macd(closingPrices, macdDefaultConfig);
    const result = rsi(closingPrices, rsiConfig);

    return {
        macd: {
            macdLine,
            signalLine,
        },
        rsi: result,
    };
};

export const createAnalysis = (prices: MarketData[], company: Company): CompanyAnalysis => {
    const support = findSupport(prices).map((line) => line.value);
    const resistance = findResistance(prices).map((line) => line.value);
    const closingPrices = prices.map((price) => price.close);
    const indicators = getIndicatorsValues(closingPrices);
    return {
        name: company.name,
        ticker: company.ticker,
        currentStockPrice: prices.at(-1)?.close || 0,
        timeframe: 'daily',
        supportLines: support,
        resistanceLines: resistance,
        indicators,
        maxResistance: Math.max(...resistance),
        minSupport: Math.min(...support),
        latestNewsTitles: [],
    };
};
