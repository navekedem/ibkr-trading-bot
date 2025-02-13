import { pipeline, TextClassificationSingle } from '@huggingface/transformers';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { CompanyNewsHeadline } from '../../../../../types/company';

const Sentiment = ({ sentiment }: { sentiment: TextClassificationSingle }) => {
    if (!sentiment) return null;
    if (sentiment.label === 'NEGATIVE') return <span style={{ color: 'red' }}>🔴 {sentiment.label}</span>;
    if (sentiment.label === 'POSITIVE') return <span style={{ color: 'green' }}>🟢 {sentiment.label}</span>;
    return <span style={{ color: 'gray' }}>🟡 {sentiment.label}</span>;
};

export const NewsCard: React.FC<{ newsHeadline: CompanyNewsHeadline }> = ({ newsHeadline }) => {
    const [sentiment, setSentiment] = useState<TextClassificationSingle[] | null>(null);

    const getSentimentScore = async (text: string) => {
        const pipe = await pipeline('sentiment-analysis', 'Xenova/distilroberta-finetuned-financial-news-sentiment-analysis', {
            device: 'webgpu',
        });
        const out = await pipe(text);
        return out;
    };

    useEffect(() => {
        getSentimentScore(newsHeadline.headline).then((res) => {
            console.log(res);
            // @ts-ignore
            setSentiment(res);
        });
    }, [newsHeadline]);

    return (
        <Card title={newsHeadline.headline} bordered={true} style={{ width: '48%', marginBottom: 16, boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
            <p>
                <b>Sentiment:</b> <Sentiment sentiment={sentiment?.[0]!} />
            </p>
            <p>
                <b>Score:</b> {sentiment?.[0]?.score.toFixed(2)}
            </p>
        </Card>
    );
};
