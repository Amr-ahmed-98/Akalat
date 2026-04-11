"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import {
  createResetPasswordSchema,
  type ResetPasswordFormData,
} from "../model/schema";

export function ResetPasswordForm() {
  const t = useTranslations("Auth.resetPassword");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = useMemo(
    () => createResetPasswordSchema(tValidation),
    [tValidation],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    console.log("reset-password payload", data);
    router.push(`/${locale}`);
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

      <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label
            htmlFor="reset-password"
            className="block text-sm font-semibold"
          >
            {t("passwordLabel")}
          </label>

          <div className="relative">
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("passwordPlaceholder")}
              className="pe-12"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 end-3 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="reset-confirm-password"
            className="block text-sm font-semibold"
          >
            {t("confirmPasswordLabel")}
          </label>

          <div className="relative">
            <Input
              id="reset-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("confirmPasswordPlaceholder")}
              className="pe-12"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute inset-y-0 end-3 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label={
                showConfirmPassword
                  ? t("hideConfirmPassword")
                  : t("showConfirmPassword")
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-full text-base font-semibold cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("loading") : t("submit")}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t("footerText")}{" "}
          <Link
            href={`/${locale}/login`}
            className="font-semibold text-primary hover:underline"
          >
            {t("footerLink")}
          </Link>
        </p>
      </form>
    </div>
  );
}
