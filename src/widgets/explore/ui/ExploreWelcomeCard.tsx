"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";

import { getDailyFoodQuote } from "@/src/features/explore/model/food-quotes";
import { getAuthenticatedUser } from "@/src/features/auth/model/auth-sessions";

function subscribeToAuthChanges(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("akalat:auth-session-changed", onStoreChange);
  return () =>
    window.removeEventListener("akalat:auth-session-changed", onStoreChange);
}

function getAuthUserSnapshot() {
  return getAuthenticatedUser();
}

function msUntilNextLocalMidnight(now: Date): number {
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );
  return Math.max(1, nextMidnight.getTime() - now.getTime());
}

export function ExploreWelcomeCard() {
  const t = useTranslations("ExplorePage");
  const locale = useLocale();
  const [now, setNow] = useState(() => new Date());

  const user = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthUserSnapshot,
    () => null,
  );

  const userName = user?.name?.trim() || t("hero.fallbackName");
  const dailyQuote = useMemo(() => getDailyFoodQuote(locale, now), [locale, now]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setNow(new Date());
    }, msUntilNextLocalMidnight(new Date()));

    return () => window.clearTimeout(timeoutId);
  }, [now]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-primary/35 bg-[#042c5a] px-5 py-8 text-white shadow-xl sm:px-8 sm:py-10 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            {t("hero.greetingWithName", { name: userName })}
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-pretty text-sm leading-7 text-white/90 sm:text-base">
            {dailyQuote}
          </p>
        </div>
      </div>
    </section>
  );
}
