import { AnnotationLine, MarketData } from "../types/market-data";
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

// findSupportAndResistance(messageArray: CandlestickData[], reqId: number) {
//     const supportLines = messageArray
//         .filter(candlestick => candlestick.t > 0)
//         .filter(candlestick => candlestick.reqId === reqId)
//         .filter((value, index, array) => {
//             if (index > 0
//                 && index < (array.length - 2)
//                 && array[index - 1].l >= value.l
//                 && array[index + 1].l > value.l) {
//                 return true;
//             }
//         }).sort((a, b) => a.l - b.l);

//     const resistanceLines = messageArray
//         .filter(candlestick => candlestick.t > 0)
//         .filter(candlestick => candlestick.reqId === reqId)
//         .filter((value, index, array) => {
//             if (index > 0
//                 && index < (array.length - 2)
//                 && array[index - 1].h <= value.h
//                 && array[index + 1].h < value.h) {
//                 return true;
//             }
//         }).sort((a, b) => b.h - a.h);

//     const averageBarHeight = messageArray
//         .filter(candlestick => candlestick.t > 0)
//         .filter(candlestick => candlestick.reqId === reqId)
//         .map(candlestick => candlestick.h - candlestick.l)
//         .reduce((previous, current) => previous + current)
//         / messageArray
//             .filter(candlestick => candlestick.t > 0)
//             .filter(candlestick => candlestick.reqId === reqId).length;

//     const uniqueSupportLines: CandlestickData[] = [];

//     supportLines.forEach((supportLine, index, array) => {
//         if (index === 0) {
//             uniqueSupportLines.push(supportLine);
//         }

//         if (index > 0) {
//             const isUnique = uniqueSupportLines.every(uniqueSupportLine => {
//                 return Math.abs(supportLine.l - uniqueSupportLine.l) > 2 * averageBarHeight;
//             });

//             if (isUnique) {
//                 uniqueSupportLines.push(supportLine);
//             }
//         }
//     });

//     const uniqueResistanceLines: CandlestickData[] = [];

//     resistanceLines.forEach((resistanceLine, index, array) => {
//         if (index === 0) {
//             uniqueResistanceLines.push(resistanceLine);
//         }

//         if (index > 0) {
//             const isUnique = uniqueResistanceLines.every(uniqueResistanceLine => {
//                 return Math.abs(resistanceLine.h - uniqueResistanceLine.h) > 2 * averageBarHeight;
//             });

//             if (isUnique) {
//                 uniqueResistanceLines.push(resistanceLine);
//             }
//         }
//     });

//     return {
//         supportLines: uniqueSupportLines,
//         resistanceLines: uniqueResistanceLines
//     }
// }  