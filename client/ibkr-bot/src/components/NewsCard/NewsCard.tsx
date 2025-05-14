import { CompanyNewsHeadline } from '@app-types/company';
import { TextClassificationSingle } from '@huggingface/transformers';
import { Card } from 'antd';
import { useEffect, useState } from 'react';

const Sentiment = ({ sentiment }: { sentiment?: TextClassificationSingle }) => {
    if (!sentiment) return null;
    if (sentiment.label === 'NEGATIVE')
        return (
            <span style={{ color: 'red' }}>
                🔴 {sentiment.label} {sentiment.score.toFixed(2)}
            </span>
        );
    if (sentiment.label === 'POSITIVE')
        return (
            <span style={{ color: 'green' }}>
                🟢 {sentiment.label} {sentiment.score.toFixed(2)}
            </span>
        );
    return (
        <span style={{ color: 'gray' }}>
            🟡 {sentiment.label} {sentiment.score.toFixed(2)}
        </span>
    );
};

export const NewsCard: React.FC<{ newsHeadline: CompanyNewsHeadline; worker: Worker | null; sentiment: TextClassificationSingle[] }> = ({
    newsHeadline,
    worker,
    sentiment,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        if (!newsHeadline || !worker || sentiment) return;
        setIsLoading(true);
        worker.postMessage({ text: newsHeadline.headline, id: newsHeadline.articleId });
    }, [newsHeadline, worker, sentiment]);

    useEffect(() => {
        if (!sentiment) return;
        setIsLoading(false);
    }, [sentiment]);

    return (
        <Card title={newsHeadline.headline} bordered={true} style={{ width: '48%', marginBottom: 16, boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
            <p>{new Date(newsHeadline.time).toLocaleString()}</p>
            <p>Source: {newsHeadline.providerCode}</p>
            <p>Sentimet: {isLoading ? 'Loading...' : <Sentiment sentiment={sentiment?.[0]} />}</p>
        </Card>
    );
};
