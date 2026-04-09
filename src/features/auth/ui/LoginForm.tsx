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
import { GoogleAuthButton } from "./GoogleAuthButton";
import { createLoginSchema, type LoginFormData } from "../model/schema";

export function LoginForm() {
  const t = useTranslations("Auth.login");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(() => createLoginSchema(tValidation), [tValidation]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("login payload", data);
  };

  const handleGoogleClick = () => {
    router.push(`/${locale}/register?provider=google&step=2`);
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
          <label htmlFor="login-email" className="block text-sm font-semibold">
            {t("emailLabel")}
          </label>

          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold"
            >
              {t("passwordLabel")}
            </label>

            <Link
              href={`/${locale}/forget-password`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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

        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border-border text-primary focus:ring-primary"
          />
          <span>{t("rememberMe")}</span>
        </label>

        <Button
          type="submit"
          className="h-12 w-full rounded-full text-base font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("loading") : t("submit")}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-4 text-muted-foreground">
              {t("divider")}
            </span>
          </div>
        </div>

        <GoogleAuthButton label={t("google")} onClick={handleGoogleClick} />

        <p className="text-center text-sm text-muted-foreground">
          {t("footerText")}{" "}
          <Link
            href={`/${locale}/register`}
            className="font-semibold text-primary hover:underline"
          >
            {t("footerLink")}
          </Link>
        </p>
      </form>
    </div>
  );
}
