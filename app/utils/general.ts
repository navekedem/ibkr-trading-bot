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
    const options = {
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
