import { ApexOptions } from "apexcharts";

const staticChartOptions: ApexOptions = {
    chart: {
        type: "candlestick",
        height: 800,
        width: 800,
        redrawOnParentResize: true,
        toolbar: {
            show: false,
        }
    },
    xaxis: {
        type: "datetime"
    },
    yaxis: {
        tooltip: {
            enabled: true
        }
    }
}


export const DailyChartOptions:ApexOptions = {
    ...staticChartOptions,
    title: {
        text: "Daily Stock Chart",
    },
    chart: {
        ...staticChartOptions.chart,
        id: '6000'
    }
}
export const HourlyChartOptions:ApexOptions = {
    ...staticChartOptions,
    title: {
        text: "Hourly Stock Chart",
    },
    chart: {
        ...staticChartOptions.chart,
        id: '6001'
    },
}
export const MinutesChartOptions:ApexOptions = {
    ...staticChartOptions,
    title: {
        text: "Minutes Stock Chart",
    },
    chart: {
        ...staticChartOptions.chart,
        id: '6002'
    },
}
export const RealTimeChartOptions:ApexOptions = {
    ...staticChartOptions,
    title: {
        text: "Real Time Stock Chart",
    },
    chart: {
        ...staticChartOptions.chart,
        id: '6003'
    }
}