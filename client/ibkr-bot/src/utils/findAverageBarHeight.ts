import { MarketData } from "../types/market-data";

export const findAverageBarHeight = (marketData: MarketData[]) => {
    const averageBarHeight = marketData
        .filter(candlestick => candlestick.time > 0)
        .map(candlestick => candlestick.high - candlestick.low)
        .reduce((previous, current) => previous + current) / marketData.filter(candlestick => candlestick.time > 0).length;
    return averageBarHeight
}