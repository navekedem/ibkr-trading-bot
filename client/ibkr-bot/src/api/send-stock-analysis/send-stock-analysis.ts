import { CompanyAnalysis } from '../../../../../types/company';

export const sendStockAnalysis = async (companyAnalysis: CompanyAnalysis) => {
    const errorMessage = 'Error in Get Company analysis';
    try {
        const response = await fetch('');
        if (!response.ok) throw new Error(errorMessage);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        throw new Error(errorMessage);
    }
};
