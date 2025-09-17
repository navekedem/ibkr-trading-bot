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

export interface StockTwitsTrendingResponse extends StockTwitsResponse {
    symbols: StockTwitsData[];
}
export interface StockTwitsMostActiveResponse extends StockTwitsResponse {
    most_active: StockTwitsData[];
}

interface StockTwitsResponse {
    cursor: {
        more: boolean;
        page_num: number;
        limit: number;
    };
    indexes: string[];
    regions: string[];
    response: {
        status: number;
    };
}
interface StockTwitsData {
    id: number;
    symbol: string;
    symbol_mic: string;
    symbol_display: string;
    exchange: string;
    region: string;
    logo_url: string;
    title: string;
    aliases: any[];
    deeplink: string;
    external_id: any;
    is_following: boolean;
    watchlist_count: number;
    has_pricing: boolean;
    instrument_class: string;
    live_event: boolean;
    sector: string;
    industry: string;
    trending: boolean;
    trending_score: number;
    trends: {
        all: number;
        region: number;
        exchange: number;
        class_all: number;
        class_equity: number;
        summary: string;
        summary_at: string;
    } | null;
    trade_status: string;
    features: Features;
    cusip: string;
    isin: string;
    should_seo_index: boolean;
    rank: number;
    fundamentals: Fundamentals;
    price_data: PriceData;
}

interface Features {
    alerts_price: boolean;
    social_data: boolean;
    trending_messages: boolean;
    earnings: boolean;
}

interface Fundamentals {
    '50DayMovingAverage': number;
    Beta: number;
    SharesOutstanding: string;
    HighPriceLast52Weeks: number;
    TotalCash: string;
    EPS: number;
    Symbol: string;
    TotalAssets: string;
    PERatio: number;
    IndustryName: string;
    MarketCapitalization: string;
    '5YearAveragePERatio': string;
    TotalExpenses: string;
    TotalEnterpriseValue: string;
    SectorName: string;
    RevenuePerEmployee: string;
    AverageDailyVolumeLastMonth: number;
    DividendRate: number;
    AverageDailyVolumeLast3Months: string;
    TotalLiabilities: string;
    RevenueToAssets: string;
    InstrumentClass: string;
    FloatCurrent: string;
    Name: string;
    PEGRatio: string;
    DividendsPerShareSecurity: string;
    GrossIncomeMargin: number;
    SalesOrRevenue: string;
    TotalDebt: string;
    NumberOfEmployees: string;
    PriceToBook: number;
    DividendExDate: string;
    FiscalPeriodEndDate: string;
    BusinessDescription: string;
    EnterpriseOverEBITDA: string;
    SharesHeldByInstitutions: number;
    LastUpdated: string;
    BookValuePerShare: string;
    DividendPayoutRatio: string;
    DividendYieldSecurity: string;
    EarningsGrowth: string;
    LowPriceLast52Weeks: number;
    EBITDA: number;
    MarketCap: number;
}

interface PriceData {
    ISO8601: string;
    PercentChange: number;
    Identifier: string;
    Symbol: string;
    High: number;
    LastSize: number;
    Low: number;
    Volume: number;
    ExtendedHoursChange: number;
    ExtendedHoursPercentChange: number;
    Change: number;
    ExtendedHoursPrice: number;
    PreviousClose: number;
    IsValidCombined: string;
    Last: number;
    Open: number;
    Type: string;
    Message: string;
    DateTime: string;
    UTCOffset: string;
    CombinedPercentChange: number;
    PreviousCloseDate: string;
    Outcome: string;
}

export interface InvestingMarketScanResponse {
    status: string;
    most_active: InvestingMarketScan[];
    gainers: InvestingMarketScan[];
    losers: InvestingMarketScan[];
}

interface InvestingMarketScan {
    active: boolean;
    attributes: Attributes;
    average_volume_3_M: number;
    cfd: boolean;
    country: string;
    country_id: number;
    currency_id: number;
    decimal_places: number;
    exchange_id: number;
    extended_session: ExtendedSession;
    id: number;
    link: string;
    long_name: string;
    market_link: string;
    one_year_change: number;
    only_daily_updates: boolean;
    open: boolean;
    parent_id: number;
    price: Price;
    realtime: boolean;
    short_name: string;
    symbol: string;
    type: string;
}
interface Attributes {
    importance: string;
    sector_id: number;
}
interface ExtendedSession {
    aftermarket: Aftermarket;
    extended_period_type: string;
    premarket: Premarket;
}
interface Aftermarket {
    change: number;
    change_percent: number;
    last_step_direction: string;
    price: number;
    shown_date_time: string;
    volume: number;
}

interface Premarket {
    change: number;
    change_percent: number;
    last_step_direction: string;
    price: number;
    shown_date_time: string;
    volume: number;
}

interface Price {
    ask: number;
    bid: number;
    change: number;
    change_percent: number;
    fifty_two_week_high: number;
    fifty_two_week_low: number;
    high: number;
    last: number;
    last_close_value: number;
    last_price_timestamp: string;
    last_step_direction: string;
    low: number;
    open: number;
    spread: number;
    volume: number;
}
