export const getStockData = async (ticker: string) => {
    const errorMessage = 'Error in Get Stock Data api';
    try {
        const response = await fetch(`hhttps://paper-api.alpaca.markets/${ticker}`);
        if (!response.ok) throw new Error(errorMessage);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(errorMessage);
    }
};
