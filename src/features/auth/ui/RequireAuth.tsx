"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import {
  getAccessToken,
  getAuthenticatedUser,
} from "@/src/features/auth/model/auth-sessions";

type RequireAuthProps = {
  children: React.ReactNode;
  locale?: string;
};

function subscribeToAuthChanges(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("wajbaAi:auth-session-changed", onStoreChange);
  return () =>
    window.removeEventListener("wajbaAi:auth-session-changed", onStoreChange);
}

function getAuthSnapshot(): boolean {
  return Boolean(getAccessToken()) || Boolean(getAuthenticatedUser());
}

function subscribeToHydration(): () => void {
  return () => undefined;
}

export function RequireAuth({ children, locale }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const intlLocale = useLocale();

  const resolvedLocale = useMemo(() => {
    return locale ?? intlLocale;
  }, [intlLocale, locale]);

  const isAuthorized = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    () => false,
  );

  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!isHydrated || isAuthorized) {
      return;
    }

    const next = encodeURIComponent(pathname ?? `/${resolvedLocale}`);
    router.replace(`/${resolvedLocale}/login?next=${next}`);
  }, [isHydrated, isAuthorized, pathname, resolvedLocale, router]);

  if (!isHydrated || !isAuthorized) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-40 w-full animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  return <>{children}</>;
}

