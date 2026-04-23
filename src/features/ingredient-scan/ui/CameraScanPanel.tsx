"use client";

import { useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { Trash2, Upload } from "lucide-react";

import { Button } from "@/src/shared/ui/button";
import { cn } from "@/src/shared/lib/utils";

type CameraScanPanelProps = {
  imageUrl: string | null;
  onImageChange: (nextUrl: string | null) => void;
};

export function CameraScanPanel({ imageUrl, onImageChange }: CameraScanPanelProps) {
  const t = useTranslations("IngredientScannerPage");

  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const hasImage = Boolean(imageUrl);

  const inputAccept = useMemo(() => "image/*", []);

  const onPickFile = (file?: File | null) => {
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);
    onImageChange(url);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground">{t("camera.title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("camera.subtitle")}</p>
        </div>
      </div>

      <div className="mt-4">
        {!hasImage ? (
          <div className="grid gap-3">
            <input
              ref={uploadInputRef}
              type="file"
              accept={inputAccept}
              className="hidden"
              onChange={(e) => onPickFile(e.target.files?.[0])}
            />

            <Button
              type="button"
              variant="outline"
              className="h-12 justify-center rounded-2xl border-dashed"
              onClick={() => uploadInputRef.current?.click()}
            >
              <span className="inline-flex items-center gap-2">
                <Upload className="size-4" />
                {t("camera.upload")}
              </span>
            </Button>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-border bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl ?? ""}
              alt={t("camera.previewAlt")}
              className={cn(
                "h-auto w-full object-cover",
                "max-h-[340px] sm:max-h-[420px]",
              )}
            />

            <div className="absolute inset-e-3 top-3">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={() => onImageChange(null)}
                aria-label={t("camera.remove")}
                title={t("camera.remove")}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

