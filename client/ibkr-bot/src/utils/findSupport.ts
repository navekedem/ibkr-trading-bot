import { AnnotationLine, MarketData } from "../../../../types/market-data";
import { findAverageBarHeight } from "./findAverageBarHeight";

export const findSupport = (marketData: MarketData[]) => {
    if (!marketData || !marketData.length) return []
    const supportLines = marketData
        .filter(candlestick => candlestick.date > 0)
        .filter((value, index, array) => {
            if (index > 0
                && index < (array.length - 2)
                && array[index - 1].low >= value.low
                && array[index + 1].low > value.low) {
                return true;
            }
        }).sort((a, b) => a.low - b.low);

    const uniqueSupportLines: AnnotationLine[] = [];
    const averageBarHeight = findAverageBarHeight(marketData)
    supportLines.forEach((supportLine, index, array) => {
        if (index === 0) {
            uniqueSupportLines.push({
                value: supportLine.low,
                type: "support",
                color: "#37a0f7",
            });
        }
        if (index > 0) {
            const isUnique = uniqueSupportLines.every(uniqueSupportLine => {
                return Math.abs(supportLine.low - uniqueSupportLine.value) > 2 * averageBarHeight;
            });

            if (isUnique) {
                uniqueSupportLines.push({
                    value: supportLine.low,
                    type: "support",
                    color: "#37a0f7",
                });
            }
        }
    });
    return uniqueSupportLines
}
