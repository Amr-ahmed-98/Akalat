"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min — data stays fresh, no refetch on every mount
        gcTime: 5 * 60 * 1000, // 5 min — keep cache in memory after component unmounts
        retry: 1, // retry failed requests once
        refetchOnWindowFocus: false, // disable for food app — no need to refetch on tab switch
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

// Singleton pattern for server — avoids a new QueryClient on every request
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new client
    return makeQueryClient();
  }
  // Browser: reuse the same client across re-renders
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState ensures the client is not recreated on every render
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
