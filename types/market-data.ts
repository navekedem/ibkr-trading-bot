export interface MarketData {
    reqId: number;
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    WAP: number;
}

export const isMarketData = (data: MarketData | null): data is MarketData => {
    if (!data) return false;
    return (data as MarketData).reqId !== undefined;
};

export interface AnnotationLine {
    value: number;
    type: 'support' | 'resistance';
    color: string;
}

export interface SubmitOrderRequest {
    symbol: string;
    action: string;
    quantity: number;
    entryPrice: number;
    stoploss: number;
    takeProfit: number;
}

export interface ScannerData {
    ticker: string;
    companyName: string;
    position: string;
    entryPrice: number;
    targetExitPrice: number;
    stopLoss: number;
    estimatedProfitPotential: number;
    keyDrivers: string;
}
