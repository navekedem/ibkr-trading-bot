import { Company, CompanyAnalysisResponse } from '@app-types/company';
// import { OrderAction } from '@stoqey/ib';
import { useMutation } from '@tanstack/react-query';
import { Button, Flex } from 'antd';
import { useContext, useState } from 'react';
import { sendStockAnalysis } from '../../api/send-stock-analysis/send-stock-analysis';
import { submitAIOrder } from '../../api/submit-order/submit-order';
import { createAnalysis } from '../../utils/handleChartData';
import { SelectedStockDataContext } from '../AppLayout/AppLayout';
import { AnalysisContent, ModalAnalysis } from '../ModalAnalysis/ModalAnalysis';

export const StockTitle: React.FC<{ selectedStock: Company }> = ({ selectedStock }) => {
    const { dailyChartData, newsHeadlines } = useContext(SelectedStockDataContext);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [analysisResponse, setAnalysisResponse] = useState<CompanyAnalysisResponse>();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: sendStockAnalysis,
    });
    const { mutateAsync: sendOrder, isPending: isOrderPending } = useMutation({
        mutationFn: submitAIOrder,
    });

    const sendAnalysis = async () => {
        if (!selectedStock) return;
        const analysis = createAnalysis(dailyChartData, selectedStock, newsHeadlines);
        const res = await mutateAsync(analysis);
        console.log(analysis);
        console.log(res);
        if (res) setAnalysisResponse(res);
        setIsOpen(true);
    };

    const submitOrder = async () => {
        if (!analysisResponse) return;
        const res = await sendOrder({
            action: analysisResponse.position === 'long' ? 'BUY' : 'SELL',
            entryPrice: parseInt(analysisResponse.entryPrice),
            quantity: 10,
            stoploss: parseInt(analysisResponse.stoploss),
            symbol: selectedStock.ticker,
            takeProfit: parseInt(analysisResponse.takeProfit),
        });
        console.log(res);
        // setIsOpen(false);
    };

    return (
        <>
            <ModalAnalysis
                open={isOpen}
                title={`${selectedStock?.name} (${selectedStock?.ticker}) Analysis`}
                onClose={() => setIsOpen(false)}
                onOk={submitOrder}
            >
                {analysisResponse && <AnalysisContent {...analysisResponse} />}
            </ModalAnalysis>

            <Flex gap={20} align="center" justify="center">
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
