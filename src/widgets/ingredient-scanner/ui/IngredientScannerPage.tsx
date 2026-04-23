"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";

import type { ScanMode } from "@/src/features/ingredient-scan/model/types";
import { ScanModeButtons } from "@/src/features/ingredient-scan/ui/ScanModeButtons";
import { CameraScanPanel } from "@/src/features/ingredient-scan/ui/CameraScanPanel";
import { BarcodeScanPanel } from "@/src/features/ingredient-scan/ui/BarcodeScanPanel";
import { TextScanPanel } from "@/src/features/ingredient-scan/ui/TextScanPanel";
import { SelectedIngredients } from "@/src/entities/ingredient/ui/SelectedIngredients";
import { Button } from "@/src/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card";

export function IngredientScannerPage() {
  const t = useTranslations("IngredientScannerPage");

  const [mode, setMode] = useState<ScanMode>("camera");
  const [cameraImageUrl, setCameraImageUrl] = useState<string | null>(null);
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [textDraft, setTextDraft] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const onRemoveSelected = useCallback((value: string) => {
    setSelected((prev) => prev.filter((item) => item !== value));
  }, []);

  const onAddMissingIngredient = useCallback((value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    setSelected((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-balance text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          {t("title")}
        </h1>
        <p className="max-w-3xl text-pretty text-sm text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        {/* Left fixed advice card */}
        <aside className="lg:sticky lg:top-20">
          <Card className="rounded-3xl shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-black">
                    {t("advice.title")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("advice.subtitle")}
                  </CardDescription>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Lightbulb className="size-5" />
                </span>
              </div>
            </CardHeader>

            <CardContent className="mt-2 space-y-4">
              <div className="rounded-2xl bg-muted/30 p-4">
                <p className="text-sm font-bold text-foreground">{t("advice.tip1Title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("advice.tip1Body")}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/30 p-4">
                <p className="text-sm font-bold text-foreground">{t("advice.tip2Title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("advice.tip2Body")}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/30 p-4">
                <p className="text-sm font-bold text-foreground">{t("advice.tip3Title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("advice.tip3Body")}
                </p>
              </div>

              <Button className="h-12 w-full rounded-2xl font-bold">
                {t("advice.primaryCta")}
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Right dynamic section */}
        <section className="space-y-5">
          <ScanModeButtons value={mode} onChange={setMode} />

          {mode === "camera" && (
            <CameraScanPanel imageUrl={cameraImageUrl} onImageChange={setCameraImageUrl} />
          )}
          {mode === "barcode" && <BarcodeScanPanel values={barcodes} onChange={setBarcodes} />}
          {mode === "text" && <TextScanPanel value={textDraft} onChange={setTextDraft} />}

          <SelectedIngredients
            items={selected}
            onRemove={onRemoveSelected}
            addMoreDisabled={false}
            onAddMissingIngredient={onAddMissingIngredient}
          />
        </section>
      </div>
    </div>
  );
}

