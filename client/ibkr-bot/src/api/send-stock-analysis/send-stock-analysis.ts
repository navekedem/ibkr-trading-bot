import { CompanyAnalysis, CompanyAnalysisResponse } from '@app-types/company';

export const sendStockAnalysis = async (companyAnalysis: CompanyAnalysis): Promise<CompanyAnalysisResponse> => {
    const errorMessage = 'Error in Get Company analysis';
    try {
        const response = await fetch('http://localhost:8080/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(companyAnalysis),
        });
        if (!response.ok) throw new Error(errorMessage);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        throw new Error(errorMessage);
    }
};
