"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../model/schema";

export function ForgotPasswordForm() {
  const t = useTranslations("Auth.forgotPassword");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();

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
    console.log("forgot-password payload", data);
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
          <label htmlFor="forgot-email" className="block text-sm font-semibold">
            {t("emailLabel")}
          </label>

          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
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
      </form>
    </div>
  );
}
