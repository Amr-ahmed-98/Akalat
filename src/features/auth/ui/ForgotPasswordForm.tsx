"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { forgotPassword, getApiErrorMessage, sendOtp } from "../model/auth-api";
import { beginForgotPasswordFlow } from "../model/flow-state";
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../model/schema";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-destructive">{message}</p>;
}

export function ForgotPasswordForm() {
  const t = useTranslations("Auth.forgotPassword");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();
  const router = useRouter();

  const schema = useMemo(
    () => createForgotPasswordSchema(tValidation),
    [tValidation],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const [forgotResult, otpResult] = await Promise.allSettled([
        forgotPassword({ email: data.email }),
        sendOtp(data.email),
      ]);

      if (forgotResult.status === "rejected") {
        throw forgotResult.reason;
      }

      const forgotPayload = forgotResult.value;
      const otpPayload =
        otpResult.status === "fulfilled" ? otpResult.value : undefined;

      beginForgotPasswordFlow({
        email: data.email,
        resetToken: forgotPayload.resetToken,
        verificationOtp: otpPayload?.verificationOtp,
        verificationUrl: otpPayload?.verificationUrl,
      });

      toast.success(forgotPayload.message);

      const otpQuery = otpPayload?.verificationOtp
        ? `?otp=${encodeURIComponent(otpPayload.verificationOtp)}`
        : "";

      router.replace(`/${locale}/otp${otpQuery}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("fallbackError")));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-foreground"
            htmlFor="forgot-password-email"
          >
            {t("emailLabel")}
          </label>
          <Input
            id="forgot-password-email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            type="email"
            {...register("email")}
            className="h-12 bg-card"
          />
          <FieldError message={errors.email?.message} />
        </div>

        <Button
          className="h-11 w-full rounded-full text-base font-semibold cursor-pointer"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? t("loading") : t("submit")}
        </Button>
      </form>

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
