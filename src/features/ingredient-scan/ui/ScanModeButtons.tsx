"use client";

import { useTranslations } from "next-intl";
import { Barcode, Camera, Type } from "lucide-react";

import type { ScanMode } from "@/src/features/ingredient-scan/model/types";
import { cn } from "@/src/shared/lib/utils";
import { Button } from "@/src/shared/ui/button";

type ScanModeButtonsProps = {
  value: ScanMode;
  onChange: (mode: ScanMode) => void;
};

export function ScanModeButtons({ value, onChange }: ScanModeButtonsProps) {
  const t = useTranslations("IngredientScannerPage");

  const items: Array<{
    mode: ScanMode;
    icon: React.ReactNode;
    label: string;
  }> = [
    { mode: "camera", icon: <Camera />, label: t("modes.camera") },
    { mode: "barcode", icon: <Barcode />, label: t("modes.barcode") },
    { mode: "text", icon: <Type />, label: t("modes.text") },
  ];

  return (
    <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
      {items.map((item) => {
        const active = value === item.mode;
        return (
          <Button
            key={item.mode}
            type="button"
            variant={active ? "default" : "outline"}
            className={cn(
              "h-10 flex-1 justify-center rounded-xl px-3 text-sm font-semibold",
              "min-w-0",
            )}
            onClick={() => onChange(item.mode)}
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-current [&_svg]:size-4">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
}

