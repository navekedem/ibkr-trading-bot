import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from './Router';
import './index.css';

// Initialize the query client
const queryClient = new QueryClient();

// Note: The sentiment analysis is offloaded to a service worker
// The worker is initialized when the SentimentWorkerManager is imported
// See: src/utils/sentimentWorker.ts
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//         .register('/sw.js', { type: 'module' })
//         .then((registration) => {
//             console.log('Service worker registered:', registration);
//         })
//         .catch((error) => {
//             console.error('Service worker registration failed:', error);
//         });
// }

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Router />
        </QueryClientProvider>
    </React.StrictMode>,
);
