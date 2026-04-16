"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { getApiErrorMessage, resetPassword } from "../model/auth-api";
import {
  clearPasswordResetFlowState,
  getPasswordResetFlowState,
  setPasswordResetToken,
} from "../model/flow-state";
import {
  createResetPasswordSchema,
  type ResetPasswordFormData,
} from "../model/schema";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-destructive">{message}</p>;
}

export function ResetPasswordForm() {
  const t = useTranslations("Auth.resetPassword");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = useMemo(
    () => createResetPasswordSchema(tValidation),
    [tValidation],
  );

  const tokenFromQuery = searchParams.get("token") ?? "";
  const resetFlow = getPasswordResetFlowState();
  const resolvedToken = tokenFromQuery || resetFlow?.resetToken || "";

  useEffect(() => {
    if (tokenFromQuery) {
      setPasswordResetToken(tokenFromQuery);
      return;
    }

    const currentFlow = getPasswordResetFlowState();
    if (!currentFlow || !currentFlow.otpVerified) {
      router.replace(`/${locale}/forget-password`);
    }
  }, [locale, router, tokenFromQuery]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!resolvedToken) {
      toast.error(t("missingToken"));
      return;
    }

    try {
      const payload = await resetPassword({
        token: resolvedToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      clearPasswordResetFlowState();
      toast.success(payload.message);
      router.replace(`/${locale}/login`);
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
            htmlFor="reset-password-new-password"
          >
            {t("passwordLabel")}
          </label>
          <div className="relative">
            <Input
              id="reset-password-new-password"
              autoComplete="new-password"
              placeholder={t("passwordPlaceholder")}
              type={showPassword ? "text" : "password"}
              {...register("newPassword")}
              className="h-12 bg-card"
            />
            <button
              type="button"
              className="absolute inset-y-0 end-3 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <FieldError message={errors.newPassword?.message} />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-semibold text-foreground"
            htmlFor="reset-password-confirm-password"
          >
            {t("confirmPasswordLabel")}
          </label>
          <div className="relative">
            <Input
              id="reset-password-confirm-password"
              autoComplete="new-password"
              placeholder={t("confirmPasswordPlaceholder")}
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="h-12 bg-card"
            />
            <button
              type="button"
              className="absolute inset-y-0 end-3 inline-flex items-center text-muted-foreground transition-colors  hover:text-foreground"
              aria-label={
                showConfirmPassword
                  ? t("hideConfirmPassword")
                  : t("showConfirmPassword")
              }
              onClick={() => setShowConfirmPassword((value) => !value)}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
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
        {t("footerText")}{" "}
        <Link
          className="font-semibold text-primary transition-colors hover:text-primary/80"
          href={`/${locale}/login`}
        >
          {t("footerLink")}
        </Link>
      </p>
    </div>
  );
}
