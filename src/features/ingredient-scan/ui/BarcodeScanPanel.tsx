"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Barcode, Camera, Check, Loader2, Trash2, X } from "lucide-react";

import { cn } from "@/src/shared/lib/utils";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";

const MAX_BARCODES = 5;

type BarcodeScanPanelProps = {
  values: string[];
  onChange: (next: string[]) => void;
};

type ScanState =
  | { status: "idle" }
  | { status: "starting" }
  | { status: "scanning" }
  | { status: "unsupported"; reason?: string }
  | { status: "denied"; reason?: string }
  | { status: "error"; reason?: string };

function canUseBarcodeDetector(): boolean {
  return (
    typeof window !== "undefined" &&
    "BarcodeDetector" in window &&
    typeof (window as unknown as { BarcodeDetector?: unknown }).BarcodeDetector === "function"
  );
}

export function BarcodeScanPanel({ values, onChange }: BarcodeScanPanelProps) {
  const t = useTranslations("IngredientScannerPage");

  const [open, setOpen] = useState(false);
  const [scanState, setScanState] = useState<ScanState>({ status: "idle" });
  const [manualValue, setManualValue] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastSeenRef = useRef<{ value: string; at: number } | null>(null);
  const scanLoopRef = useRef<(() => void) | null>(null);

  const reachedMax = values.length >= MAX_BARCODES;

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
  }, []);

  const addBarcode = useCallback(
    (raw: string) => {
      const value = raw.trim();
      if (!value) return;
      if (values.includes(value)) return;
      if (values.length >= MAX_BARCODES) return;
      const nextValues = [...values, value];
      onChange(nextValues);

      if (nextValues.length >= MAX_BARCODES) {
        stopCamera();
        setScanState({ status: "idle" });
      }
    },
    [onChange, stopCamera, values],
  );

  const removeBarcode = useCallback(
    (value: string) => {
      onChange(values.filter((item) => item !== value));
    },
    [onChange, values],
  );

  const detector = useMemo(() => {
    if (!canUseBarcodeDetector()) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const BarcodeDetectorCtor = (window as any).BarcodeDetector as new (args?: {
      formats?: string[];
    }) => {
      detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
    };
    return new BarcodeDetectorCtor({
      formats: [
        "qr_code",
        "ean_13",
        "ean_8",
        "code_128",
        "code_39",
        "upc_a",
        "upc_e",
        "itf",
      ],
    });
  }, []);

  const scanOnce = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !detector) {
      return;
    }

    try {
      const results = await detector.detect(video);
      const next = results?.[0]?.rawValue?.trim();

      if (next && values.length < MAX_BARCODES) {
        const last = lastSeenRef.current;
        const now = Date.now();
        const isRecentDuplicate = last?.value === next && now - last.at < 1400;

        if (!isRecentDuplicate) {
          lastSeenRef.current = { value: next, at: now };
          addBarcode(next);
        }
      }

      if (values.length + 1 >= MAX_BARCODES) {
        // keep the UI open, but no longer need to scan aggressively
        // (still allow manual additions if user deletes one)
      }
    } catch (error) {
      setScanState({
        status: "error",
        reason: error instanceof Error ? error.message : undefined,
      });
      stopCamera();
      return;
    }

    rafRef.current = requestAnimationFrame(() => {
      scanLoopRef.current?.();
    });
  }, [addBarcode, detector, stopCamera, values.length]);

  useEffect(() => {
    scanLoopRef.current = () => {
      void scanOnce();
    };
  }, [scanOnce]);

  const startCamera = useCallback(async () => {
    if (reachedMax) {
      return;
    }

    if (!detector) {
      setScanState({ status: "unsupported" });
      setOpen(true);
      return;
    }

    setOpen(true);
    stopCamera();
    setScanState({ status: "starting" });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        setScanState({ status: "error", reason: "Video not ready." });
        stopCamera();
        return;
      }

      video.srcObject = stream;
      await video.play();
      setScanState({ status: "scanning" });
      lastSeenRef.current = null;

      rafRef.current = requestAnimationFrame(() => {
        scanLoopRef.current?.();
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      const isDenied =
        error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "SecurityError");

      setScanState({
        status: isDenied ? "denied" : "error",
        reason: message,
      });
      stopCamera();
    }
  }, [detector, reachedMax, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (open && reachedMax) {
      stopCamera();
    }
  }, [open, reachedMax, stopCamera]);

  const closePanel = useCallback(() => {
    stopCamera();
    setScanState({ status: "idle" });
    setManualValue("");
    setOpen(false);
  }, [stopCamera]);

  const statusText = useMemo(() => {
    if (scanState.status === "starting") return t("barcode.scanner.starting");
    if (scanState.status === "scanning") return t("barcode.scanner.scanning");
    if (scanState.status === "unsupported") return t("barcode.scanner.unsupported");
    if (scanState.status === "denied") return t("barcode.scanner.denied");
    if (scanState.status === "error") return t("barcode.scanner.error");
    return t("barcode.scanner.ready");
  }, [scanState.status, t]);

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground">{t("barcode.title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("barcode.subtitle", { max: MAX_BARCODES })}
          </p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <Barcode className="size-4" />
        </span>
      </div>

      <div className="mt-4">
        {!reachedMax && (
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => void startCamera()}
              className={cn(
                "relative isolate flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-transform active:translate-y-px sm:w-auto sm:px-8",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            >
              <span className="inline-flex items-center gap-2">
                <Camera className="size-4" />
                {t("barcode.scanButton")}
              </span>
            </button>

            <div className="text-sm text-muted-foreground">
              {t("barcode.count", { count: values.length, max: MAX_BARCODES })}
            </div>
          </div>
        )}

        {reachedMax && (
          <div className="rounded-2xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            {t("barcode.maxReached", { max: MAX_BARCODES })}
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div
              key={value}
              className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-sm"
            >
              <div className="flex min-h-24 flex-col items-center justify-center gap-2 px-4 py-4 text-center">
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("barcode.itemLabel")}
                </p>
                <p className="max-w-full truncate text-sm font-bold text-foreground">
                  {value}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeBarcode(value)}
                aria-label={t("barcode.remove")}
                title={t("barcode.remove")}
                className="absolute inset-e-2 top-2 grid size-8 place-items-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/15"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePanel();
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {t("barcode.scanner.title")}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{statusText}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={closePanel}
                aria-label={t("common.close")}
              >
                <X />
              </Button>
            </div>

            <div className="p-5">
              <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
                <video
                  ref={videoRef}
                  className="h-56 w-full object-cover sm:h-64"
                  playsInline
                  muted
                />
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-bold text-foreground">{t("barcode.manual.title")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("barcode.manual.subtitle")}
                </p>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    placeholder={t("barcode.manual.placeholder")}
                    className="h-11 rounded-2xl px-4"
                  />
                  <Button
                    type="button"
                    className="h-11 rounded-2xl"
                    disabled={reachedMax || !manualValue.trim()}
                    onClick={() => {
                      addBarcode(manualValue);
                      setManualValue("");
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Check className="size-4" />
                      {t("barcode.manual.add")}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                  {t("barcode.count", { count: values.length, max: MAX_BARCODES })}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-2xl"
                    disabled={reachedMax}
                    onClick={() => void startCamera()}
                  >
                    <span className="inline-flex items-center gap-2">
                      {scanState.status === "starting" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Camera className="size-4" />
                      )}
                      {t("barcode.scanner.scanMore")}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 rounded-2xl"
                    onClick={closePanel}
                  >
                    {t("common.done")}
                  </Button>
                </div>
              </div>

              {(scanState.status === "denied" ||
                scanState.status === "unsupported" ||
                scanState.status === "error") && (
                <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                  <p className="font-semibold">{t("barcode.scanner.troubleshootTitle")}</p>
                  <p className="mt-1 text-destructive/90">
                    {scanState.reason ? scanState.reason : t("barcode.scanner.troubleshootBody")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

