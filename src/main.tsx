import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppProvider } from '@/contexts/AppContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <AppProvider>
                        <App />
                        <Toaster position="top-right" richColors closeButton />
                    </AppProvider>
                </TooltipProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
