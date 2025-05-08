import { TextClassificationSingle } from '@huggingface/transformers';

// Type for the worker response
interface WorkerResponse {
    id: string;
    result: TextClassificationSingle[] | null;
    error: string | null;
    status?: string;
}

// Class to manage the sentiment analysis worker
class SentimentWorkerManager {
    private worker: Worker | null = null;
    private isWorkerReady = false;
    private pendingRequests: Map<
        string,
        {
            resolve: (value: TextClassificationSingle[]) => void;
            reject: (reason: any) => void;
        }
    > = new Map();

    constructor() {
        this.initWorker();
    }

    private initWorker() {
        if (typeof window === 'undefined' || !('Worker' in window)) {
            console.error('Web Workers are not supported in this environment');
            return;
        }

        try {
            this.worker = new Worker('/sentiment-worker.js');

            this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
                const { id, result, error, status } = event.data;

                // Handle the worker ready status
                if (status === 'ready') {
                    this.isWorkerReady = true;
                    return;
                }

                // Handle the response for a specific request
                const request = this.pendingRequests.get(id);
                if (request) {
                    if (error) {
                        request.reject(new Error(error));
                    } else if (result) {
                        request.resolve(result);
                    }
                    this.pendingRequests.delete(id);
                }
            };

            this.worker.onerror = (error) => {
                console.error('Sentiment worker error:', error);
                // Reject all pending requests on worker error
                this.pendingRequests.forEach((request) => {
                    request.reject(error);
                });
                this.pendingRequests.clear();
            };
        } catch (error) {
            console.error('Failed to initialize sentiment worker:', error);
        }
    }

    // Analyze sentiment using the worker
    public analyzeSentiment(text: string): Promise<TextClassificationSingle[]> {
        return new Promise((resolve, reject) => {
            if (!this.worker) {
                reject(new Error('Sentiment worker is not available'));
                return;
            }

            const id = crypto.randomUUID();

            // Store the promise callbacks
            this.pendingRequests.set(id, { resolve, reject });

            // Send the request to the worker
            this.worker.postMessage({ id, text });
        });
    }

    // Clean up the worker when no longer needed
    public terminate() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.isWorkerReady = false;
            this.pendingRequests.clear();
        }
    }
}

// Create a singleton instance
const sentimentWorker = new SentimentWorkerManager();

export default sentimentWorker;
