"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  BookMarked,
  Camera,
  ChevronLeft,
  PackageOpen,
  PencilLine,
  Sparkles,
} from "lucide-react";

import {
  QUICK_PROCEDURE_ITEMS,
  SAMPLE_INVENTORY_INGREDIENT_KEYS,
  SMART_VISION_STATS,
  type QuickProcedureIcon,
} from "@/src/features/explore/model/explore-overview";
import { ExploreSearchAndFilters } from "@/src/widgets/explore-search/ui/ExploreSearchAndFilters";

function getQuickProcedureIcon(icon: QuickProcedureIcon) {
  switch (icon) {
    case "scan":
      return Camera;
    case "manual":
      return PencilLine;
    case "saved":
      return BookMarked;
    case "inventory":
      return PackageOpen;
    default:
      return Camera;
  }
}

export function ExploreOverviewSection() {
  const t = useTranslations("ExplorePage");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section className="mx-auto mt-6 w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <ExploreSearchAndFilters />

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <article className="rounded-3xl bg-[#f08b69] p-5 text-[#1b1410] shadow-sm lg:col-span-4 lg:row-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black">{t("smartVision.title")}</h2>
            <Sparkles className="size-5 shrink-0" />
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#1b1410]/70">
            {t("smartVision.badge")}
          </p>
          <p className="mt-3 text-xl font-black leading-snug">
            {t("smartVision.headline")}
          </p>
          <p className="mt-2 text-sm text-[#1b1410]/80">{t("smartVision.description")}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {SMART_VISION_STATS.map((stat) => (
              <div key={stat.key} className="rounded-2xl bg-white/30 px-3 py-2 text-center">
                <p className="text-2xl font-black">{t(`smartVision.stats.${stat.key}.value`)}</p>
                <p className="mt-0.5 text-xs font-semibold text-[#1b1410]/70">
                  {t(`smartVision.stats.${stat.key}.label`)}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:col-span-8">
          <h2 className="mb-3 text-lg font-black text-foreground">{t("quickProcedures.title")}</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_PROCEDURE_ITEMS.map((item) => {
              const Icon = getQuickProcedureIcon(item.icon);
              return (
                <Link
                  key={item.id}
                  href={`/${locale}${item.path}`}
                  className="group flex min-h-24 items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <div>
                    <Icon className="size-5 text-primary" />
                    <p className="mt-2 text-sm font-bold text-foreground">
                      {t(`quickProcedures.items.${item.labelKey}`)}
                    </p>
                  </div>
                  <ChevronLeft
                    className={`size-4 text-muted-foreground transition-transform group-hover:text-primary ${
                      isArabic ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </article>

        <article className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:col-span-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-foreground">{t("currentInventory.title")}</h2>
            <span className="text-xs font-semibold text-muted-foreground">
              {t("currentInventory.readOnlyBadge")}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("currentInventory.description")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SAMPLE_INVENTORY_INGREDIENT_KEYS.map((ingredientKey) => (
              <span
                key={ingredientKey}
                className="inline-flex cursor-default select-none items-center rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium text-foreground"
              >
                {t(`currentInventory.sampleIngredients.${ingredientKey}`)}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
