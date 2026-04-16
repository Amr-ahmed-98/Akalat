"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import {
  authenticateWithGoogle,
  getApiErrorMessage,
  loginUser,
} from "../model/auth-api";
import {
  beginGoogleRegisterFlow,
  clearRegisterFlowState,
  mapBackendOnboardingStepToRegisterStep,
} from "../model/flow-state";
import { createLoginSchema, type LoginFormData } from "../model/schema";
import { GoogleAuthButton } from "./GoogleAuthButton";
import type {
  DecodedGoogleProfile,
  GoogleCredentialResponse,
} from "../model/google";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-destructive">{message}</p>;
}

export function LoginForm() {
  const t = useTranslations("Auth.login");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

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
    try {
      await loginUser(data);
      clearRegisterFlowState();
      router.replace(`/${locale}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("fallbackError")));
    }
  };

  const handleGoogleCredential = async (
    response: GoogleCredentialResponse,
    profile: DecodedGoogleProfile | null,
  ) => {
    setIsGoogleSubmitting(true);

    try {
      const payload = await authenticateWithGoogle({
        idToken: response.credential,
      });

      const isProfileComplete =
        payload.user.profileCompleted &&
        payload.user.currentOnboardingStep === 0;

      if (isProfileComplete) {
        clearRegisterFlowState();
        router.replace(`/${locale}`);
        return;
      }

      beginGoogleRegisterFlow({
        googleIdToken: response.credential,
        googleName: profile?.name ?? payload.user.name,
        googleEmail: profile?.email ?? payload.user.email,
        step: mapBackendOnboardingStepToRegisterStep(
          payload.user.currentOnboardingStep,
        ),
      });

      router.replace(`/${locale}/register`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("fallbackError")));
    } finally {
      setIsGoogleSubmitting(false);
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
            htmlFor="login-email"
          >
            {t("emailLabel")}
          </label>
          <Input
            id="login-email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            type="email"
            {...register("email")}
            className="h-12 bg-card"
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              className="text-sm font-semibold text-foreground"
              htmlFor="login-password"
            >
              {t("passwordLabel")}
            </label>
            <Link
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              href={`/${locale}/forget-password`}
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <div className="relative">
            <Input
              id="login-password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              type={showPassword ? "text" : "password"}
              {...register("password")}
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
          <FieldError message={errors.password?.message} />
        </div>

        <Button
          className="h-11 w-full rounded-full text-base font-semibold cursor-pointer"
          disabled={isSubmitting || isGoogleSubmitting}
          type="submit"
        >
          {isSubmitting ? t("loading") : t("submit")}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>{t("divider")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton
        disabled={isSubmitting || isGoogleSubmitting}
        label={t("google")}
        locale={locale}
        mode="login"
        variant="legacy"
        onCredential={handleGoogleCredential}
      />

      <p className="text-center text-sm text-muted-foreground">
        {t("footerText")}{" "}
        <Link
          className="font-semibold text-primary transition-colors hover:text-primary/80"
          href={`/${locale}/register`}
        >
          {t("footerLink")}
        </Link>
      </p>
    </div>
  );
}
