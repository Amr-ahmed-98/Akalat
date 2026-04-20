"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Send, MessageSquareDiff } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";
import { useFeedbackForm } from "@/src/features/feedback/model/use-feedback-form";
import {
  FEEDBACK_TYPES,
  IMPORTANCE_LEVELS,
} from "@/src/features/feedback/model/feedbackSchema";
import { FileUploadField } from "./FileUpload";

type FeedbackSectionProps = {
  locale: string;
};

export const FeedbackSection = ({ locale }: FeedbackSectionProps) => {
  const t = useTranslations("feedback");
  const isArabic = locale === "ar";
  const {
    form,
    previewUrl,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    onSubmit,
    isSubmitting,
  } = useFeedbackForm();

  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full max-w-2xl mx-auto px-4 py-8 sm:px-6"
    >
      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-border">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="shrink-0 p-2.5 rounded-xl bg-primary/10">
            <MessageSquareDiff className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={onSubmit} noValidate className="px-6 py-6 space-y-6">
          {/* Row: Type + Importance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Observation Type */}
            <div className="space-y-1.5">
              <label
                htmlFor="feedback-type"
                className="block text-sm font-medium text-foreground"
              >
                {t("fields.type.label")}
              </label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <select
                    id="feedback-type"
                    {...field}
                    className={cn(
                      "w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors",
                      "focus:ring-2 focus:ring-primary/30 focus:border-primary",
                      errors.type
                        ? "border-destructive"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <option value="" disabled>
                      {t("fields.type.placeholder")}
                    </option>
                    {FEEDBACK_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t(`fields.type.options.${type}`)}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.type && (
                <p className="text-xs text-destructive">
                  {t(errors.type.message as string)}
                </p>
              )}
            </div>

            {/* Importance */}
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">
                {t("fields.importance.label")}
              </p>
              <div className="flex items-center gap-4 h-[42px]">
                {IMPORTANCE_LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      value={level}
                      {...register("importance")}
                      className={cn("w-4 h-4 accent-primary cursor-pointer")}
                    />
                    <span className="text-sm text-foreground">
                      {t(`fields.importance.options.${level}`)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.importance && (
                <p className="text-xs text-destructive">
                  {t(errors.importance.message as string)}
                </p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <label
              htmlFor="feedback-details"
              className="block text-sm font-medium text-foreground"
            >
              {t("fields.details.label")}
            </label>
            <textarea
              id="feedback-details"
              rows={4}
              placeholder={t("fields.details.placeholder")}
              {...register("details")}
              className={cn(
                "w-full rounded-xl border bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none transition-colors",
                "focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-background",
                errors.details
                  ? "border-destructive"
                  : "border-border hover:border-primary/50",
              )}
            />
            {errors.details && (
              <p className="text-xs text-destructive">
                {t(errors.details.message as string)}
              </p>
            )}
          </div>

          {/* File Upload */}
          <Controller
            control={control}
            name="screenshot"
            render={() => (
              <FileUploadField
                previewUrl={previewUrl}
                isDragging={isDragging}
                error={
                  errors.screenshot
                    ? t(errors.screenshot.message as string)
                    : undefined
                }
                onFileChange={handleFileChange}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onRemove={removeFile}
              />
            )}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-all",
              "bg-primary hover:bg-primary/90 active:scale-[0.98]",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            )}
          >
            {isSubmitting ? (
              <span className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? t("actions.submitting") : t("actions.submit")}
          </button>
        </form>
      </div>
    </section>
  );
};
