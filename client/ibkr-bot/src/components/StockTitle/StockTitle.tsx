import { useMutation } from '@tanstack/react-query';
import { Button, Flex } from 'antd';
import { useContext, useState } from 'react';
import { Company, CompanyAnalysisResponse } from '../../../../../types/company';
import { sendStockAnalysis } from '../../api/send-stock-analysis/send-stock-analysis';
import { createAnalysis } from '../../utils/handleChartData';
import { SelectedStockDataContext } from '../AppLayout/AppLayout';
import { AnalysisContent, ModalAnalysis } from '../ModalAnalysis/ModalAnalysis';

export const StockTitle: React.FC<{ selectedStock: Company }> = ({ selectedStock }) => {
    const { dailyChartData } = useContext(SelectedStockDataContext);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [analysisResponse, setAnalysisResponse] = useState<CompanyAnalysisResponse>();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: sendStockAnalysis,
    });

    const sendAnalysis = async () => {
        const analysis = createAnalysis(dailyChartData, selectedStock!);
        const res = await mutateAsync(analysis);
        console.log(analysis);
        console.log(res);
        if (res) setAnalysisResponse(res);
        setIsOpen(true);
    };

    return (
        <>
            <ModalAnalysis open={isOpen} title={`${selectedStock?.name} (${selectedStock?.ticker}) Analysis`} onClose={() => setIsOpen(false)}>
                {analysisResponse && <AnalysisContent {...analysisResponse} />}
            </ModalAnalysis>

            <Flex gap={6} align="center">
                <h2>
                    {selectedStock?.name} {selectedStock?.ticker}
                </h2>
                <Button loading={isPending} onClick={sendAnalysis}>
                    Send Analysis To AI
                </Button>
            </Flex>
        </>
    );
};
