import { useContext, useMemo } from 'react';
import { SelectedStockDataContext } from '../components/AppLayout/AppLayout';
import { NewsCard } from '../components/NewsCard/NewsCard';

export const OverviewPage = () => {
    const { newsHeadlines } = useContext(SelectedStockDataContext);
    const filteredNews = useMemo(() => {
        const items = new Set(newsHeadlines.flatMap((newHealine) => newHealine.headline));
    }, [newsHeadlines]);
    const blala = newsHeadlines.slice(0, 4);
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {blala.map((newsHeadline) => (
                <NewsCard newsHeadline={newsHeadline} key={newsHeadline.articleId} />
            ))}
        </div>
    );
};
