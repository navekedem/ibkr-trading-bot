// sentimentWorker.js
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0';

let sentimentPipeline;

(async () => {
    try {
        sentimentPipeline = await pipeline('sentiment-analysis');
        console.log('Sentiment analysis model loaded in worker.');
    } catch (error) {
        console.error('Error loading model:', error);
    }
})();

self.onmessage = async (e) => {
    const { text, id } = e.data;
    if (!sentimentPipeline) {
        self.postMessage({ error: 'Model not loaded yet. Try again shortly.' });
        return;
    }
    try {
        console.log('try Sentiment analysis result:', text);
        const result = await sentimentPipeline(text);
        self.postMessage({ result, id });
    } catch (error) {
        console.log('error sentiment:', error);
        self.postMessage({ error: error.message });
    }
};
