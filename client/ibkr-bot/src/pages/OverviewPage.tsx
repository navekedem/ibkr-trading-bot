import { TextClassificationSingle } from '@huggingface/transformers';
import { useContext, useEffect, useState } from 'react';
import { SelectedStockDataContext } from '../components/AppLayout/AppLayout';
import { NewsCard } from '../components/NewsCard/NewsCard';

export const OverviewPage = () => {
    const { newsHeadlines } = useContext(SelectedStockDataContext);
    const [worker, setWorker] = useState<Worker | null>(null);
    const [sentiments, setSentiments] = useState<Record<string, TextClassificationSingle[]>>({});

    useEffect(() => {
        const newWorker = new Worker(new URL('./sentimentWorker.js', window.location.href), { type: 'module' });
        setWorker(newWorker);

        newWorker.onmessage = (event) => {
            const { result, error, id } = event.data;
            if (error) return;
            setSentiments((prev) => ({ ...prev, [id]: result }));

            // setIsLoading(false);
        };

        newWorker.onerror = (err) => {
            // setError(err.message);
            // setIsLoading(false);
        };

        // Clean up the worker on unmount.
        return () => newWorker.terminate();
    }, []);

    console.log('sentiments', sentiments);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {newsHeadlines.map((newsHeadline) => (
                <NewsCard newsHeadline={newsHeadline} key={newsHeadline.articleId} worker={worker} />
            ))}
        </div>
    );
};
