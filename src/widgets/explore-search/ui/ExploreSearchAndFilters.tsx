"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/src/shared/lib/utils";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import {
  BASIC_FILTER_GROUPS,
  createEmptyExploreFiltersDraft,
  getSelectedExploreFiltersCount,
  getSelectedExploreFilterKeys,
  HEALTH_FILTER_OPTIONS,
  OCCASION_FILTER_OPTIONS,
  SMART_FILTER_GROUPS,
  toggleExploreFilterOption,
  type ExploreFiltersDraft,
  type FilterOptionKey,
} from "@/src/features/explore/model/explore-search-filters";

type ExploreSearchAndFiltersProps = {
  onSearchChange?: (value: string) => void;
  onFiltersApply?: (selectedKeys: FilterOptionKey[]) => void;
};

export function ExploreSearchAndFilters({
  onSearchChange,
  onFiltersApply,
}: ExploreSearchAndFiltersProps) {
  const t = useTranslations("ExplorePage.searchFilters");
  const [query, setQuery] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<ExploreFiltersDraft>(
    createEmptyExploreFiltersDraft(),
  );
  const [draftFilters, setDraftFilters] = useState<ExploreFiltersDraft>(
    createEmptyExploreFiltersDraft(),
  );

  const selectedAppliedKeys = useMemo(
    () => getSelectedExploreFilterKeys(appliedFilters),
    [appliedFilters],
  );
  const draftCount = getSelectedExploreFiltersCount(draftFilters);

  useEffect(() => {
    if (!isPopupOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPopupOpen(false);
        setDraftFilters(appliedFilters);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [appliedFilters, isPopupOpen]);

  function handleSearchChange(value: string) {
    setQuery(value);
    onSearchChange?.(value);
  }

  function openPopup() {
    setDraftFilters(appliedFilters);
    setIsPopupOpen(true);
  }

  function closePopupWithoutApply() {
    setDraftFilters(appliedFilters);
    setIsPopupOpen(false);
  }

  function applyFilters() {
    setAppliedFilters(draftFilters);
    setIsPopupOpen(false);
    onFiltersApply?.(getSelectedExploreFilterKeys(draftFilters));
  }

  function resetDraftFilters() {
    setDraftFilters(createEmptyExploreFiltersDraft());
  }

  function resetAppliedFilters() {
    const empty = createEmptyExploreFiltersDraft();
    setAppliedFilters(empty);
    setDraftFilters(empty);
    onFiltersApply?.([]);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={openPopup}
          className="h-11 rounded-2xl border-border px-4 sm:w-auto"
        >
          <SlidersHorizontal className="size-4.5" />
          <span>{t("openFiltersButton")}</span>
        </Button>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute inset-y-0 inset-e-3 my-auto size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 rounded-2xl border-border pe-10"
          />
        </div>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          selectedAppliedKeys.length > 0
            ? "mt-4 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{t("selectedFiltersTitle")}</p>
              <Button
                type="button"
                variant="ghost"
                className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent hover:text-primary"
                onClick={resetAppliedFilters}
              >
                {t("reset")}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedAppliedKeys.map((key) => (
                <span
                  key={key}
                  className="inline-flex items-center rounded-full border border-primary/30 bg-white px-3 py-1 text-xs font-medium text-foreground"
                >
                  {t(`options.${key}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen ? (
        <div className="fixed inset-0 z-80 bg-black/40 p-3 sm:p-6">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={closePopupWithoutApply}
                className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t("close")}
              >
                <X className="size-4" />
              </button>
              <h3 className="text-base font-black text-foreground sm:text-lg">{t("popupTitle")}</h3>
              <div className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <h4 className="text-base font-black text-foreground">{t("smartFiltersTitle")}</h4>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                    {t("aiPowered")}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {SMART_FILTER_GROUPS.map((group) => (
                    <FilterCard
                      key={group.key}
                      title={t(`groups.${group.key}`)}
                      options={group.options}
                      draftFilters={draftFilters}
                      onToggle={(key) =>
                        setDraftFilters((current) => toggleExploreFilterOption(current, key))
                      }
                      t={t}
                    />
                  ))}
                </div>
              </section>

              <section className="mt-6">
                <h4 className="mb-3 text-base font-black text-foreground">{t("basicFiltersTitle")}</h4>
                <div className="space-y-4">
                  {BASIC_FILTER_GROUPS.map((group) => (
                    <FilterRow
                      key={group.key}
                      label={t(`groups.${group.key}`)}
                      options={group.options}
                      draftFilters={draftFilters}
                      onToggle={(key) =>
                        setDraftFilters((current) => toggleExploreFilterOption(current, key))
                      }
                      t={t}
                    />
                  ))}
                </div>
              </section>

              <section className="mt-6 grid gap-4 lg:grid-cols-2">
                <FilterPanel
                  title={t("occasionFiltersTitle")}
                  options={OCCASION_FILTER_OPTIONS}
                  draftFilters={draftFilters}
                  onToggle={(key) =>
                    setDraftFilters((current) => toggleExploreFilterOption(current, key))
                  }
                  t={t}
                />
                <FilterPanel
                  title={t("healthFiltersTitle")}
                  options={HEALTH_FILTER_OPTIONS}
                  draftFilters={draftFilters}
                  onToggle={(key) =>
                    setDraftFilters((current) => toggleExploreFilterOption(current, key))
                  }
                  t={t}
                />
              </section>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <Button
                type="button"
                variant="ghost"
                onClick={resetDraftFilters}
                className="h-10 rounded-xl text-muted-foreground hover:text-foreground"
              >
                {t("reset")}
              </Button>
              <Button type="button" onClick={applyFilters} className="h-10 rounded-xl px-6">
                {t("applyWithCount", { count: draftCount })}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type FiltersTranslator = ReturnType<typeof useTranslations<"ExplorePage.searchFilters">>;

type FilterRendererProps = {
  options: readonly FilterOptionKey[];
  draftFilters: ExploreFiltersDraft;
  onToggle: (key: FilterOptionKey) => void;
  t: FiltersTranslator;
};

function FilterCard({ title, options, draftFilters, onToggle, t }: FilterRendererProps & { title: string }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-3">
      <h5 className="mb-2 text-sm font-bold text-foreground">{title}</h5>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip
            key={option}
            label={t(`options.${option}`)}
            selected={draftFilters[option]}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </article>
  );
}

function FilterRow({ label, options, draftFilters, onToggle, t }: FilterRendererProps & { label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="mb-2 text-sm font-bold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip
            key={option}
            label={t(`options.${option}`)}
            selected={draftFilters[option]}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterPanel({ title, options, draftFilters, onToggle, t }: FilterRendererProps & { title: string }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <h5 className="mb-3 text-base font-black text-foreground">{title}</h5>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip
            key={option}
            label={t(`options.${option}`)}
            selected={draftFilters[option]}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </article>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        selected
          ? "border-primary/30 bg-primary text-primary-foreground"
          : "border-border bg-muted text-foreground hover:border-primary/30 hover:bg-primary/10",
      )}
    >
      {label}
    </button>
  );
}
