export const getCompanies = async (searchParam: string) => {
    try {
        const response = await fetch(`https://api.polygon.io/v3/reference/tickers?search=${searchParam}&active=true&apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`)
        const data = await response.json()
        return data
    } catch (error) {
        throw new Error("Error in getCompanies")
    
    }
}