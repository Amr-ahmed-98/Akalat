"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui/button";
import { cn } from "@/src/shared/lib/utils";
import { getApiErrorMessage, resendOtp, verifyOtp } from "../model/auth-api";
import {
  clearOtpFlowState,
  clearRegisterFlowState,
  getOtpFlowState,
  getPasswordResetFlowState,
  markForgotPasswordOtpVerified,
} from "../model/flow-state";
import { createOtpSchema } from "../model/schema";

const OTP_LENGTH = 6;

export function OtpVerificationForm() {
  const t = useTranslations("Auth.otp");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [flow, setFlow] = useState(() => getOtpFlowState());
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const schema = useMemo(() => createOtpSchema(tValidation), [tValidation]);
  const code = digits.join("");

  useEffect(() => {
    const currentFlow = getOtpFlowState();
    if (!currentFlow) {
      router.replace(`/${locale}/login`);
      return;
    }

    if (
      currentFlow.mode === "forgot-password" &&
      !getPasswordResetFlowState()
    ) {
      router.replace(`/${locale}/forget-password`);
      return;
    }

    setFlow(currentFlow);
  }, [locale, router]);

  useEffect(() => {
    const presetCode = (searchParams.get("otp") ?? flow?.verificationOtp ?? "")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!presetCode) {
      return;
    }

    const nextDigits = Array.from(
      { length: OTP_LENGTH },
      (_, index) => presetCode[index] ?? "",
    );

    setDigits(nextDigits);
  }, [flow?.verificationOtp, searchParams]);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((previousValue) => {
        if (previousValue <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previousValue - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const title =
    flow?.mode === "verify-email"
      ? t("verifyEmailTitle")
      : t("forgotPasswordTitle");
  const description =
    flow?.mode === "verify-email"
      ? t("verifyEmailDescription")
      : t("forgotPasswordDescription");

  const focusIndex = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const updateDigit = (index: number, value: string) => {
    const onlyDigits = value.replace(/\D/g, "");
    const nextDigits = [...digits];

    nextDigits[index] = onlyDigits ? onlyDigits.slice(-1) : "";
    setDigits(nextDigits);
    setError("");

    if (onlyDigits && index < OTP_LENGTH - 1) {
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
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedDigits) {
      return;
    }

    const nextDigits = Array.from(
      { length: OTP_LENGTH },
      (_, index) => pastedDigits[index] ?? "",
    );

    setDigits(nextDigits);
    setError("");
    focusIndex(Math.min(pastedDigits.length, OTP_LENGTH - 1));
  };

  const handleSubmit = async () => {
    const result = schema.safeParse({ otp: code });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? t("invalid"));
      return;
    }

    if (!flow) {
      router.replace(`/${locale}/login`);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = await verifyOtp({
        email: flow.email,
        otp: code,
      });

      toast.success(payload.message);

      if (flow.mode === "verify-email") {
        clearOtpFlowState();
        clearRegisterFlowState();
        router.replace(`/${locale}/login`);
        return;
      }

      clearOtpFlowState();
      const resetState = markForgotPasswordOtpVerified();
      const tokenQuery = resetState?.resetToken
        ? `?token=${encodeURIComponent(resetState.resetToken)}`
        : "";

      router.replace(`/${locale}/reset-password${tokenQuery}`);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, t("invalid")));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!flow || cooldown > 0) {
      return;
    }

    try {
      setIsResending(true);
      const payload = await resendOtp(flow.email);
      toast.success(payload.message);
      setCooldown(30);
    } catch (resendError) {
      toast.error(getApiErrorMessage(resendError, t("fallbackError")));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        {flow?.email ? (
          <p className="text-sm font-medium text-foreground">{flow.email}</p>
        ) : null}
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              aria-label={`${t("digit")} ${index + 1}`}
              className={cn(
                "h-14 rounded-2xl border bg-card text-center text-2xl font-black text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10",
                digit ? "border-primary/40" : "border-border",
              )}
              inputMode="numeric"
              maxLength={1}
              type="text"
              value={digit}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        {error ? (
          <p className="text-center text-sm text-destructive">{error}</p>
        ) : null}

        <Button
          className="h-11 w-full rounded-full text-base font-semibold"
          disabled={isSubmitting || isResending}
          type="button"
          onClick={handleSubmit}
        >
          {isSubmitting ? t("loading") : t("submit")}
        </Button>

        <Button
          className="h-11 w-full rounded-full text-base font-semibold"
          disabled={isSubmitting || isResending || cooldown > 0}
          type="button"
          variant="outline"
          onClick={handleResend}
        >
          {isResending
            ? t("resending")
            : cooldown > 0
              ? t("resendIn", { seconds: cooldown })
              : t("resend")}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          className="font-semibold text-primary transition-colors hover:text-primary/80"
          href={`/${locale}/login`}
        >
          {t("backToLogin")}
        </Link>
      </p>
    </div>
  );
}
