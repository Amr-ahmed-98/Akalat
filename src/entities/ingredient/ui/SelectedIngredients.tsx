"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

import { Button } from "@/src/shared/ui/button";
import { cn } from "@/src/shared/lib/utils";
import { Input } from "@/src/shared/ui/input";

type SelectedIngredientsProps = {
  items: string[];
  onRemove: (value: string) => void;
  addMoreDisabled?: boolean;
  onAddMissingIngredient: (value: string) => void;
};

export function SelectedIngredients({
  items,
  onRemove,
  addMoreDisabled,
  onAddMissingIngredient,
}: SelectedIngredientsProps) {
  const t = useTranslations("IngredientScannerPage");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const canSubmit = useMemo(() => value.trim().length > 0, [value]);

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground">{t("results.title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("results.subtitle")}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-2xl border-dashed"
          onClick={() => {
            setValue("");
            setOpen(true);
          }}
          disabled={addMoreDisabled}
        >
          {t("results.addMore")}
        </Button>
      </div>

      <div className="mt-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            {t("results.empty")}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm",
                )}
              >
                <span className="max-w-56 truncate">{item}</span>
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  aria-label={t("results.remove")}
                  title={t("results.remove")}
                  className="grid size-6 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {t("missing.modalTitle")}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {t("missing.modalSubtitle")}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  setValue("");
                  setOpen(false);
                }}
                aria-label={t("common.close")}
              >
                <X />
              </Button>
            </div>

            <div className="p-5">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t("missing.placeholder")}
                className="h-12 rounded-2xl px-4"
                autoFocus
              />

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-2xl"
                  onClick={() => {
                    setValue("");
                    setOpen(false);
                  }}
                >
                  {t("common.close")}
                </Button>
                <Button
                  type="button"
                  className="h-10 rounded-2xl"
                  disabled={!canSubmit}
                  onClick={() => {
                    const next = value.trim();
                    if (!next) return;
                    onAddMissingIngredient(next);
                    setValue("");
                    setOpen(false);
                  }}
                >
                  {t("missing.submit")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

