import { ApexOptions } from "apexcharts";
import { MarketData } from "../../../../types/market-data";
import { findResistance } from "./findResistance";
import { findSupport } from "./findSupport";

export const createAnnotationsLines = (chartData: MarketData[], options: ApexOptions) => {
    const annotationsLines = [...findSupport(chartData), ...findResistance(chartData)]
    const annotations = {
        yaxis: annotationsLines.map(line => ({
            y: line.value,
            borderColor: line.color,
            strokeDashArray: 0,
            label: {
                borderColor: line.color,
                style: {
                    color: '#fff',
                    background: line.color
                },
                text: `${line.type} price: ${line.value}$`
            }
        }))
    }
    const optionsWithAnnotations = {
        ...options,
        // annotations: annotations,
    }
    return optionsWithAnnotations
    
}