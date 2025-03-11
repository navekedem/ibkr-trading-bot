import { AnnotationLine, MarketData } from '@app-types/market-data';

export const findEntryPoint = (chartData: MarketData[], supportLines: AnnotationLine[], resistenceLines: AnnotationLine[]): PointAnnotations => {
    const filterdata = chartData.filter((price) => price.open > 0);
    const closestSupportLine = supportLines.sort((a, b) => b.value - a.value).find((supportLine) => (filterdata.at(-1)?.low || 0) > supportLine.value);
    return {
        x: filterdata.at(-1)?.date || 0,
        y: closestSupportLine?.value,
        marker: {
            size: 6,
            fillColor: '#fff',
            strokeColor: '#2698FF',
            radius: 2,
        },
        // label: {
        //     borderColor: "#FF4560",
        //     offsetY: 100,
        //     style: {
        //         color: "#fff",
        //         background: "#FF4560"
        //     },
        //     text: "Point Annotation (XY)"
        // }
    };
};
