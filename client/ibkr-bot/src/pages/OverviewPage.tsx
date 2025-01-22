import { useContext } from 'react';
import { SelectedStockDataContext } from '../components/AppLayout/AppLayout';

export const OverviewPage = () => {
    const { newsHeadlines } = useContext(SelectedStockDataContext);
    console.log(newsHeadlines);
    return <div>Overview Page</div>;
};
