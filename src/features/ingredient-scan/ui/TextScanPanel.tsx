"use client";

import { useTranslations } from "next-intl";
import { Type } from "lucide-react";

import { Textarea } from "@/src/shared/ui/textarea";

type TextScanPanelProps = {
  value: string;
  onChange: (next: string) => void;
};

export function TextScanPanel({ value, onChange }: TextScanPanelProps) {
  const t = useTranslations("IngredientScannerPage");

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground">{t("text.title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("text.subtitle")}</p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <Type className="size-4" />
        </span>
      </div>

      <div className="mt-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("text.placeholder")}
          className="min-h-40 resize-none rounded-2xl px-4 py-3 text-sm leading-relaxed sm:min-h-48"
        />
      </div>
    </div>
  );
}

