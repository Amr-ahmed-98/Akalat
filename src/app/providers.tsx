"use client";
import { QueryProvider } from "@/src/shared/providers/query-provider";
import type { ReactNode } from "react";

// This file is for wrapping the app with any providers (e.g. React Query, Context API, next-intl, Sonner Toaster, etc.)

export function Providers({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
