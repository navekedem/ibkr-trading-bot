import { SubmitOrderRequest } from '../../../../../types/market-data';

export const submitAIOrder = async (orderRequest: SubmitOrderRequest): Promise<{ orderId: string }> => {
    const errorMessage = 'Error in submit order';
    try {
        const response = await fetch('http://localhost:8080/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderRequest),
        });
        if (!response.ok) throw new Error(errorMessage);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        throw new Error(errorMessage);
    }
};
