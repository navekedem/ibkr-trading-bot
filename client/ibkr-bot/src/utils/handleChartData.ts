import { MarketData } from "../../../../types/market-data"

export const handleChartData = (chartData: MarketData[]): any => {
    return chartData.map(item => handleSingleCandle(item)).filter(Boolean)
}

export const handleSingleCandle = (candleData: MarketData): any => {
    const { open, high, low, close, date } = candleData
    const priceLevels = [open, high, low, close]
    if (!date || !priceLevels || priceLevels.includes(-1)) return
    return {
        x: date,
        y: priceLevels as any
    }
}