"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { CloudUpload, X, ImageIcon } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

interface FileUploadFieldProps {
  previewUrl: string | null;
  isDragging: boolean;
  error?: string;
  onFileChange: (file: File | null) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemove: () => void;
}

export const FileUploadField = ({
  previewUrl,
  isDragging,
  error,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemove,
}: FileUploadFieldProps) => {
  const t = useTranslations("feedback");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {t("fields.screenshot.label")}
        <span className="ms-1 text-muted-foreground text-xs font-normal">
          ({t("fields.screenshot.optional")})
        </span>
      </label>

      {previewUrl ? (
        /* ── Preview ── */
        <div className="relative w-full rounded-xl overflow-hidden border border-border h-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={t("fields.screenshot.previewAlt")}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 end-2 bg-background/80 backdrop-blur-sm border border-border rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
            aria-label={t("fields.screenshot.removeFile")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* ── Drop Zone ── */
        <div
          role="button"
          tabIndex={0}
          aria-label={t("fields.screenshot.dropzone")}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed py-8 cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/40 hover:border-primary/60 hover:bg-primary/5",
            error && "border-destructive",
          )}
        >
          <div
            className={cn(
              "p-3 rounded-full transition-colors",
              isDragging ? "bg-primary/15" : "bg-muted",
            )}
          >
            {isDragging ? (
              <ImageIcon className="w-6 h-6 text-primary" />
            ) : (
              <CloudUpload className="w-6 h-6 text-muted-foreground" />
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {t("fields.screenshot.dropHint")}
          </p>
          <p className="text-xs text-muted-foreground/70">
            {t("fields.screenshot.fileConstraint")}
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
