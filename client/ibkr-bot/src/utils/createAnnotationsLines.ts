import { ApexOptions } from "apexcharts";
import { MarketData } from "../../../../types/market-data";
import { findResistance } from "./findResistance";
import { findSupport } from "./findSupport";
import { findEntryPoint } from "./findEntryPoint";

export const createAnnotationsLines = (chartData: MarketData[], options: ApexOptions, searchEntryPoint: boolean) => {
    let entryPoints: PointAnnotations[] = [];
    const support = findSupport(chartData)
    const resistance = findResistance(chartData)
    const annotationsLines = [...support, ...resistance]
    // if (searchEntryPoint) entryPoints.push(findEntryPoint(chartData, support, resistance))
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
        })),
        // points: entryPoints.filter(point => point?.x > 0)
    }
    // console.log(entryPoints)
    const optionsWithAnnotations: ApexOptions = {
        ...options,
        annotations: annotations,
       
    }
    return optionsWithAnnotations

}