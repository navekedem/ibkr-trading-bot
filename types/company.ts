export interface Company {
    active: boolean;
    cik: string;
    composite_figi: string;
    currency_name: string;
    last_updated_utc: string;
    locale: string;
    market: string;
    name: string;
    primary_exchange: string;
    share_class_figi: string;
    ticker: string;
    type: string;
}

export interface CompanyAnalysis {
    name: string;
    ticker: string;
    supportLines: number[];
    resistanceLines: number[];
    maxResistance: number;
    minSupport: number;
    indicators: Record<string, any>;
    timeframe: 'daily' | 'hourly';
    latestNewsTitles: string[];
    currentStockPrice: number;
}
