import { ReactNode, useMemo } from "react";
import {
    Layout,
    Responsive,
    ResponsiveProps,
    WidthProvider,
} from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

interface LayoutGridProps
    extends ResponsiveProps,
    ReactGridLayout.WidthProviderProps {
}

const defaultProps = {
    rowHeight: 100,
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    col: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    measureBeforeMount: false,
    useCSSTransforms: true,
    margin: [20, 20] as [number, number],
    draggableHandle: ".layout-block-title",
};
export const LayoutGrid: React.FC<LayoutGridProps> = (props) => {
    const { children, ...rest } = props;
    const ResponsiveReactGridLayout = useMemo(
        () => WidthProvider(Responsive),
        []
    );

    return <ResponsiveReactGridLayout
        {...defaultProps}
        {...rest}
    >
        {rest.layouts?.lg.map((itm: Layout, i: number) => (
            <div key={itm.i} data-grid={itm} className="block">
                {(children as ReactNode[])?.find((cp: any) => cp?.key === itm.i) ||
                    null}
            </div>
        ))}
    </ResponsiveReactGridLayout>
}