"use client";

import { useSyncExternalStore } from "react";

import {
  getAccessToken,
  getAuthenticatedUser,
} from "@/src/features/auth/model/auth-sessions";
import { ExploreAuthenticatedView } from "@/src/widgets/explore-auth/ui/ExploreAuthenticatedView";
import { ExploreGuestView } from "@/src/widgets/explore-guest/ui/ExploreGuestView";

function subscribeToAuthChanges(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("akalat:auth-session-changed", onStoreChange);
  return () =>
    window.removeEventListener("akalat:auth-session-changed", onStoreChange);
}

function getAuthSnapshot(): boolean {
  return Boolean(getAccessToken()) || Boolean(getAuthenticatedUser());
}

function subscribeToHydration(): () => void {
  return () => undefined;
}

export function ExploreViewByAuth() {
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

  if (!isHydrated) {
    return (
      <div className="mx-auto mt-6 w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="h-40 w-full animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (isAuthorized) {
    return <ExploreAuthenticatedView />;
  }

  return <ExploreGuestView />;
}
