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



export interface AnnotationLine {
    value: number; 
    type: "support" | 'resistance'; 
    color: string;
}