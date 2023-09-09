export const getStockData = async (ticker: string) => {
    const errorMessage = "Error in Get Stock Data api"
    try {
        const response = await fetch(`http://localhost:8080/get-stock-data/${ticker}`)
        if (!response.ok) throw new Error(errorMessage)
        const data = await response.json()
        return data
    } catch (error) {
        throw new Error(errorMessage)
    }
}