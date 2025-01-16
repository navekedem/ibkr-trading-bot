import IBApi, { BarSizeSetting, Stock } from '@stoqey/ib';
const aggregationBuffer: any = {};
export const parseDateStringNative = (dateString: string) => {
    const trimmedString = dateString.trim();
    const parts = trimmedString.split(' ');

    if (parts.length === 3) {
        // 'yyyyMMdd HH:mm:ss TimeZone' format
        const [datePart, timePart, timeZone] = parts;
        const year = parseInt(datePart.substring(0, 4), 10);
        const month = parseInt(datePart.substring(4, 6), 10) - 1; // Months are 0-based
        const day = parseInt(datePart.substring(6, 8), 10);
        const [hour, minute, second] = timePart.split(':').map(Number);

        // Note: The native Date object does not handle IANA time zones. This will create a date in the local time zone.
        const date = new Date(year, month, day, hour, minute, second);
        return date;
    } else if (parts.length === 1) {
        // 'yyyyMMdd' format
        const datePart = parts[0];
        const year = parseInt(datePart.substring(0, 4), 10);
        const month = parseInt(datePart.substring(4, 6), 10) - 1;
        const day = parseInt(datePart.substring(6, 8), 10);

        // Create a date at midnight UTC
        const date = new Date(Date.UTC(year, month, day)).getTime();
        return date;
    } else {
        console.error('Unknown date format:', dateString);
        return null;
    }
};

export const formatDateToCustomString = (date: Date) => {
    const options: any = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
    };

    // Format the date parts
    const formattedParts = date.toLocaleString('en-CA', options).replace(',', '');

    // Replace slashes with dashes if necessary (en-CA typically uses ISO format)
    const formattedDate = `${formattedParts}.0`;

    return formattedDate;
};

export const triggerInteractiveEvents = (ib: IBApi, stock: Stock) => {
    // ib.reqNewsProviders();
    // ib.reqContractDetails(3001, newsContract);
    // ib.reqNewsArticle(2000, stock);
    // try {
    //     ib.reqHistoricalNews(12003, 8314, 'BRFG', '', '', 10, null);
    // } catch (error) {
    //     console.log(error);
    // }
    ib.reqHistoricalData(6000, stock, '', '2 M', BarSizeSetting.DAYS_ONE, 'ADJUSTED_LAST', 1, 1, false);
    ib.reqHistoricalData(6001, stock, '', '1 W', BarSizeSetting.HOURS_ONE, 'ADJUSTED_LAST', 1, 1, false);
    ib.reqHistoricalData(6002, stock, '', '3600 S', BarSizeSetting.MINUTES_ONE, 'ADJUSTED_LAST', 1, 1, false);
};
export const aggregateMinutesChart = (reqId: number, open: number, high: number, low: number, close: number, volume: number) => {
    if (!aggregationBuffer[reqId]) {
        aggregationBuffer[reqId] = {
            open: null,
            high: -Infinity,
            low: Infinity,
            close: null,
            volume: 0,
            startTime: Date.now(),
        };
    }

    const buffer = aggregationBuffer[reqId];
    if (buffer.open === null) {
        buffer.open = open;
    }
    buffer.high = Math.max(buffer.high, high);
    buffer.low = Math.min(buffer.low, low);
    buffer.close = close; // Always set the close to the last close value within the minute
    buffer.volume += volume;

    // Check if one minute has passed
    if (Date.now() - buffer.startTime >= 60000) {
        // Send aggregated data

        // Reset the buffer for the next minute
        aggregationBuffer[reqId] = {
            open: null,
            high: -Infinity,
            low: Infinity,
            close: null,
            volume: 0,
            startTime: Date.now(),
        };
    }
    return {
        reqId: reqId,
        open: buffer.open,
        high: buffer.high,
        date: buffer.startTime,
        low: buffer.low,
        close: buffer.close,
        volume: buffer.volume,
    };
};
