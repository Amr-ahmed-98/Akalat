"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthBootstrap } from "@/src/features/auth/ui/AuthBootstrap";
import { QueryProvider } from "@/src/shared/providers/query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthBootstrap />
      {children}
      <Toaster richColors position="top-center" />
    </QueryProvider>
  );
}
