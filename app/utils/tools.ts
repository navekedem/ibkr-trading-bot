import type { InvestingMarketScanResponse, StockTwitsMostActiveResponse, StockTwitsTrendingResponse } from '../../types/market-data';

export const stockTwitsTrendingScanner = async () => {
    try {
        const response = await fetch(`${process.env.STOCK_TWITS_API_URL}/symbols_enhanced.json?class=equities&limit=10&page_num=1&payloads=qpric`);
        const data = (await response.json()) as StockTwitsTrendingResponse;
        const trendingSymbols = data.symbols.map((stock) => ({
            id: stock.id,
            symbol: stock.symbol,
            title: stock.title,
            trending_score: stock.trending_score,
            trendSummary: stock.trends?.summary || '',
            '50dayMovingAverage': stock.fundamentals['50DayMovingAverage'] || 0,
            averageDailyVolumeLastMonth: stock.fundamentals.AverageDailyVolumeLastMonth || 0,
            earningsGrowth: stock.fundamentals.EarningsGrowth || 0,
        }));

        return trendingSymbols;
    } catch (error) {
        console.error('Error fetching StockTwits data:', error);
    }
};

export const stockTwitsMostActiveScanner = async () => {
    try {
        const response = await fetch(`${process.env.STOCK_TWITS_API_URL}/most_active.json?class=equities&limit=10&page_num=1&payloads=qprices`);
        const data = (await response.json()) as StockTwitsMostActiveResponse;
        const trendingSymbols = data.most_active.map((stock) => ({
            id: stock.id,
            symbol: stock.symbol,
            title: stock.title,
            trending_score: stock.trending_score,
            trendSummary: stock.trends?.summary || '',
            '50dayMovingAverage': stock.fundamentals['50DayMovingAverage'] || 0,
            averageDailyVolumeLastMonth: stock.fundamentals.AverageDailyVolumeLastMonth || 0,
            earningsGrowth: stock.fundamentals.EarningsGrowth || 0,
            priceData: stock.price_data || {},
        }));

        return trendingSymbols;
    } catch (error) {
        console.error('Error fetching StockTwits data:', error);
    }
};

export const investingPreMarketMostActiveScanner = async () => {
    try {
        const response = await fetch(`${process.env.INVESTING_API_URL}/pre-market`);
        const data = (await response.json()) as InvestingMarketScanResponse;
        const preMarketMostActive = data.most_active.map((stock) => ({
            id: stock.id,
            symbol: stock.symbol,
            title: stock.short_name,
            threeMonthAverageVolume: stock.average_volume_3_M,
            importance: stock.attributes.importance,
            preMarketData: stock.extended_session.premarket,
            afterMarketData: stock.extended_session.aftermarket,
            priceData: stock.price || {},
        }));

        const preMarketGainers = data.gainers.map((stock) => ({
            id: stock.id,
            symbol: stock.symbol,
            title: stock.short_name,
            threeMonthAverageVolume: stock.average_volume_3_M,
            importance: stock.attributes.importance,
            preMarketData: stock.extended_session.premarket,
            afterMarketData: stock.extended_session.aftermarket,
            priceData: stock.price || {},
        }));

        const preMarketLosers = data.losers.map((stock) => ({
            id: stock.id,
            symbol: stock.symbol,
            title: stock.short_name,
            threeMonthAverageVolume: stock.average_volume_3_M,
            importance: stock.attributes.importance,
            preMarketData: stock.extended_session.premarket,
            afterMarketData: stock.extended_session.aftermarket,
            priceData: stock.price || {},
        }));

        return { preMarketLosers, preMarketGainers, preMarketMostActive };
    } catch (error) {
        console.error('Error fetching StockTwits data:', error);
    }
};
