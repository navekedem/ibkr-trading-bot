import { AnnotationLine, MarketData } from "../../../../types/market-data";
import { findAverageBarHeight } from "./findAverageBarHeight";

export const findResistance = (marketData: MarketData[]) => {
    if (!marketData || !marketData.length) return []
    const resistanceLines = marketData
        .filter(candlestick => candlestick?.date > 0)
        .filter((value, index, array) => {
            if (index > 0
                && index < (array.length - 2)
                && array[index - 1].high >= value.high
                && array[index + 1].high > value.high) {
                return true;
            }
        }).sort((a, b) => b.high - a.high);


    const uniqueResistanceLines: AnnotationLine[] = [];

    const averageBarHeight = findAverageBarHeight(marketData)
    resistanceLines.forEach((resistanceLine, index, array) => {
        if (index === 0) {
            uniqueResistanceLines.push({
                value: resistanceLine.high,
                type: "resistance",
                color: "#ea7e2e",
            });
        }
        if (index > 0) {
            const isUnique = uniqueResistanceLines.every(uniqueResistanceLine => {
                return Math.abs(resistanceLine.high - uniqueResistanceLine.value) > 2 * averageBarHeight;
            });

            if (isUnique) {
                uniqueResistanceLines.push({
                    value: resistanceLine.high,
                    type: "resistance",
                    color: "#ea7e2e",
                });
            }
        }
    });
    return uniqueResistanceLines
}