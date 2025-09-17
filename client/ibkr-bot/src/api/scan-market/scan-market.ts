export const scanMarket = async (isSwing: boolean): Promise<any> => {
    const errorMessage = 'Error in scan market';
    try {
        const response = await fetch(`http://localhost:8080/scan-market?isSwing=${isSwing}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error(errorMessage);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        throw new Error(errorMessage);
    }
};

///https://financialmodelingprep.com/image-stock/AVGO.png
