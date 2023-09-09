export const handleChartData = (chartData: any[]): any => {
    return chartData.map(item => {
        const { open, high, low, close, date } = item
        const priceLevels = [open, high, low, close]
        if (!date || !priceLevels || priceLevels.includes(-1)) return
        return {
            x: date,
            y: priceLevels as any
        }
    }).filter(Boolean)
}