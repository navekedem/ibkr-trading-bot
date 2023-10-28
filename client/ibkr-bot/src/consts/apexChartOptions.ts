import { ApexOptions } from "apexcharts";

const staticChartOptions: ApexOptions = {
    title: {
        text: "",
    },
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
    chart: {
        ...staticChartOptions.chart,
        id: '6000'
    }
}
export const HourlyChartOptions:ApexOptions = {
    ...staticChartOptions,
    chart: {
        ...staticChartOptions.chart,
        id: '6001'
    },
}
export const MinutesChartOptions:ApexOptions = {
    ...staticChartOptions,
    chart: {
        ...staticChartOptions.chart,
        id: '6002'
    },
}
export const RealTimeChartOptions:ApexOptions = {
    ...staticChartOptions,
    chart: {
        ...staticChartOptions.chart,
        id: '6003'
    }
}