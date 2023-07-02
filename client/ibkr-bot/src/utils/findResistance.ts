import { MarketData } from "../types/market-data";

export const findResistance = (marketData: MarketData[]) => {
    const resistanceLines = marketData
        .filter(candlestick => candlestick.time > 0)
        .filter((value, index, array) => {
            if (index > 0
                && index < (array.length - 2)
                && array[index - 1].high >= value.high
                && array[index + 1].high > value.high) {
                return true;
            }
        }).sort((a, b) => a.high - b.high);
}