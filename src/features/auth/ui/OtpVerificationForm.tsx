"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/src/shared/ui/button";
import { cn } from "@/src/shared/lib/utils";
import { createOtpSchema } from "../model/schema";

const OTP_LENGTH = 4;

export function OtpVerificationForm() {
  const t = useTranslations("Auth.otp");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const schema = useMemo(() => createOtpSchema(tValidation), [tValidation]);

  const code = digits.join("");

  const focusIndex = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const updateDigit = (index: number, value: string) => {
    const onlyDigits = value.replace(/\D/g, "");

    if (!onlyDigits) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const next = [...digits];
    next[index] = onlyDigits.slice(-1);
    setDigits(next);
    setError("");

    if (index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      focusIndex(index - 1);
    }

    if (event.key === "ArrowLeft" && index > 0) {
      focusIndex(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array.from(
      { length: OTP_LENGTH },
      (_, index) => pasted[index] ?? "",
    );
    setDigits(next);
    setError("");

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    focusIndex(nextIndex);
  };

  const handleSubmit = async () => {
    const result = schema.safeParse({ code });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? t("invalid"));
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      router.push(
        `/${locale}/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`,
      );
    }, 250);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-black tracking-tight">{t("title")}</h1>
        <p className="text-base text-muted-foreground">{t("description")}</p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          {digits.map((digit, index) => (
            <motion.input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              animate={
                digit
                  ? { scale: [1, 1.08, 1], y: [0, -2, 0] }
                  : { scale: 1, y: 0 }
              }
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={cn(
                "size-20 rounded-full border bg-card text-center text-3xl font-black text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10",
                digit ? "border-primary/40" : "border-border",
              )}
              aria-label={`${t("digit")} ${index + 1}`}
            />
          ))}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          type="button"
          onClick={handleSubmit}
          className="h-12 w-full rounded-full text-base font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("loading") : t("submit")}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={`/${locale}/login`}
            className="font-semibold text-primary hover:underline"
          >
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
