'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

export const QueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <div id="query">{children}</div>  
  </QueryClientProvider>
);
