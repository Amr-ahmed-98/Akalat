"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChefHat,
  Clock3,
  CookingPot,
  Croissant,
  Eye,
  EyeOff,
  Flame,
  GraduationCap,
  Heart,
  HeartPulse,
  Pizza,
  Plus,
  Soup,
  Sparkles,
  Timer,
  User,
  Users,
  UtensilsCrossed,
  Wallet,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { type FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ZodIssue } from "zod";

import { cn } from "@/src/shared/lib/utils";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { AuthOptionCard } from "./AuthOptionCard";
import { GoogleAuthButton } from "./GoogleAuthButton";
import {
  authenticateWithGoogle,
  getApiErrorMessage,
  registerUser,
} from "../model/auth-api";
import {
  COOKING_SKILL_LEVELS,
  CUISINES,
  DIETARY_PREFERENCES,
  HOUSEHOLD_TYPES,
  KITCHEN_TOOLS,
  PRIMARY_COOKING_GOALS,
} from "../model/register-options";
import {
  beginEmailVerificationFlow,
  beginGoogleRegisterFlow,
  clearRegisterFlowState,
  ensureRegisterFlowState,
  getRegisterFlowState,
  mapBackendOnboardingStepToRegisterStep,
  resetRegisterFlowToCredentials,
  setRegisterFlowStep,
  type RegisterStep,
} from "../model/flow-state";
import {
  createRegisterAccountSchema,
  createRegisterKitchenSchema,
  createRegisterPreferencesSchema,
  createRegisterSchema,
  defaultRegisterFormValues,
  toCookingProfileInput,
  type RegisterFormData,
} from "../model/schema";
import type {
  DecodedGoogleProfile,
  GoogleCredentialResponse,
} from "../model/google";

type Step = RegisterStep;

const stepFields: Record<Step, FieldPath<RegisterFormData>[]> = {
  1: ["name", "email", "password", "confirmPassword", "authProvider"],
  2: ["dietaryPreferences", "favoriteCuisines", "allergies"],
  3: [
    "householdType",
    "cookingSkillLevel",
    "primaryCookingGoal",
    "availableKitchenTools",
    "otherKitchenTools",
  ],
};

const motionProps = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -18 },
  transition: { duration: 0.24, ease: "easeOut" },
} as const;

const CUISINE_ICONS: Record<string, LucideIcon> = {
  arabic: UtensilsCrossed,
  italian: Pizza,
  asian: Soup,
  french: Croissant,
};

const FAMILY_ICONS: Record<string, LucideIcon> = {
  single: User,
  couple: Heart,
  family: Users,
};

const LEVEL_ICONS: Record<string, LucideIcon> = {
  beginner: Sparkles,
  intermediate: ChefHat,
  professional: Flame,
};

const TOOL_ICONS: Record<string, LucideIcon> = {
  oven: CookingPot,
  "air-fryer": Wind,
  blender: Sparkles,
  "pressure-cooker": Timer,
  "hand-blender": Sparkles,
  pot: Soup,
  microwave: Timer,
  "stand-mixer": ChefHat,
};

const GOAL_ICONS: Record<string, LucideIcon> = {
  "save-time": Clock3,
  "healthy-eating": HeartPulse,
  "learn-skills": GraduationCap,
  "save-money": Wallet,
};

function firstIssueStep(issues: readonly ZodIssue[]): Step {
  const firstField = String(issues[0]?.path?.[0] ?? "");

  if (stepFields[1].includes(firstField as FieldPath<RegisterFormData>)) {
    return 1;
  }

  if (stepFields[2].includes(firstField as FieldPath<RegisterFormData>)) {
    return 2;
  }

  return 3;
}

export function RegisterForm() {
  const t = useTranslations("Auth.register");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [allergyInput, setAllergyInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const {
    register,
    getValues,
    setValue,
    clearErrors,
    setError,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: defaultRegisterFormValues,
    mode: "onBlur",
  });

  useEffect(() => {
    const existingFlow = getRegisterFlowState();

    if (!existingFlow) {
      ensureRegisterFlowState("credentials");
      return;
    }

    if (existingFlow.provider === "google") {
      if (!existingFlow.googleIdToken) {
        resetRegisterFlowToCredentials();
        setValue("authProvider", "credentials");
        setStep(1);
        return;
      }

      const googleStep: Step = existingFlow.currentStep === 3 ? 3 : 2;
      setValue("authProvider", "google");
      setValue("name", existingFlow.googleName ?? "");
      setValue("email", existingFlow.googleEmail ?? "");
      setStep(googleStep);
      return;
    }

    setValue("authProvider", "credentials");
    setStep(existingFlow.currentStep);
  }, [setValue]);

  const isGoogleFlow = watch("authProvider") === "google";
  const dietaryPreferences = watch("dietaryPreferences");
  const favoriteCuisines = watch("favoriteCuisines");
  const allergies = watch("allergies");
  const cookingLevel = watch("cookingSkillLevel");
  const familyType = watch("householdType");
  const primaryGoal = watch("primaryCookingGoal");
  const availableTools = watch("availableKitchenTools");
  const emailValue = watch("email");

  const applyIssues = (issues: readonly ZodIssue[]) => {
    issues.forEach((issue) => {
      const field = issue.path[0];

      if (typeof field === "string") {
        setError(field as FieldPath<RegisterFormData>, {
          type: "manual",
          message: issue.message,
        });
      }
    });
  };

  const updateStep = (nextStep: Step) => {
    setStep(nextStep);
    setRegisterFlowStep(nextStep);
  };

  const validateStep = (currentStep: Step) => {
    clearErrors(stepFields[currentStep]);

    const values = getValues();

    if (currentStep === 1) {
      const result = createRegisterAccountSchema(
        tValidation,
        values.authProvider,
      ).safeParse({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        authProvider: values.authProvider,
      });

      if (!result.success) {
        applyIssues(result.error.issues);
        return false;
      }

      return true;
    }

    if (currentStep === 2) {
      const result = createRegisterPreferencesSchema(tValidation).safeParse({
        dietaryPreferences: values.dietaryPreferences,
        favoriteCuisines: values.favoriteCuisines,
        allergies: values.allergies,
      });

      if (!result.success) {
        applyIssues(result.error.issues);
        return false;
      }

      return true;
    }

    const result = createRegisterKitchenSchema(tValidation).safeParse({
      householdType: values.householdType,
      cookingSkillLevel: values.cookingSkillLevel,
      primaryCookingGoal: values.primaryCookingGoal,
      availableKitchenTools: values.availableKitchenTools,
      otherKitchenTools: values.otherKitchenTools,
    });

    if (!result.success) {
      applyIssues(result.error.issues);
      return false;
    }

    return true;
  };

  const switchToEmailRegistration = () => {
    resetRegisterFlowToCredentials();
    setValue("authProvider", "credentials", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("password", "");
    setValue("confirmPassword", "");
    setStep(1);
  };

  const handleGoogleCredential = async (
    response: GoogleCredentialResponse,
    profile: DecodedGoogleProfile | null,
  ) => {
    setIsGoogleSubmitting(true);

    try {
      const googleName = profile?.name ?? getValues("name") ?? "";
      const googleEmail = profile?.email ?? "";

      setValue("authProvider", "google", {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("name", googleName, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("email", googleEmail, {
        shouldDirty: true,
        shouldTouch: true,
      });

      beginGoogleRegisterFlow({
        googleIdToken: response.credential,
        googleName,
        googleEmail,
        step: 2,
      });

      clearErrors(stepFields[1]);
      setStep(2);
      toast.success(t("googleConnectedNotice"));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const toggleDietaryPreference = (value: string) => {
    const current = getValues("dietaryPreferences");
    const next = current.includes(value as (typeof current)[number])
      ? current.filter((item) => item !== value)
      : [...current, value as (typeof current)[number]];

    setValue("dietaryPreferences", next, {
      shouldDirty: true,
      shouldTouch: true,
    });

    clearErrors("dietaryPreferences");
  };

  function toggleMultiValue(
    field: "favoriteCuisines",
    value: RegisterFormData["favoriteCuisines"][number],
  ): void;
  function toggleMultiValue(
    field: "availableKitchenTools",
    value: RegisterFormData["availableKitchenTools"][number],
  ): void;
  function toggleMultiValue(
    field: "favoriteCuisines" | "availableKitchenTools",
    value:
      | RegisterFormData["favoriteCuisines"][number]
      | RegisterFormData["availableKitchenTools"][number],
  ) {
    if (field === "favoriteCuisines") {
      const current = getValues("favoriteCuisines");
      const typedValue = value as RegisterFormData["favoriteCuisines"][number];
      const next = current.includes(typedValue)
        ? current.filter((item) => item !== typedValue)
        : [...current, typedValue];

      setValue("favoriteCuisines", next, {
        shouldDirty: true,
        shouldTouch: true,
      });
      clearErrors("favoriteCuisines");
      return;
    }

    const current = getValues("availableKitchenTools");
    const typedValue = value as RegisterFormData["availableKitchenTools"][number];
    const next = current.includes(typedValue)
      ? current.filter((item) => item !== typedValue)
      : [...current, typedValue];

    setValue("availableKitchenTools", next, {
      shouldDirty: true,
      shouldTouch: true,
    });
    clearErrors("availableKitchenTools");
  }

  function selectSingleValue(
    field: "cookingSkillLevel",
    value: Exclude<RegisterFormData["cookingSkillLevel"], "">,
  ): void;
  function selectSingleValue(
    field: "householdType",
    value: Exclude<RegisterFormData["householdType"], "">,
  ): void;
  function selectSingleValue(
    field: "primaryCookingGoal",
    value: Exclude<RegisterFormData["primaryCookingGoal"], "">,
  ): void;
  function selectSingleValue(
    field: "cookingSkillLevel" | "householdType" | "primaryCookingGoal",
    value:
      | Exclude<RegisterFormData["cookingSkillLevel"], "">
      | Exclude<RegisterFormData["householdType"], "">
      | Exclude<RegisterFormData["primaryCookingGoal"], "">,
  ) {
    if (field === "cookingSkillLevel") {
      setValue(
        "cookingSkillLevel",
        value as RegisterFormData["cookingSkillLevel"],
        {
          shouldDirty: true,
          shouldTouch: true,
        },
      );
      clearErrors("cookingSkillLevel");
      return;
    }

    if (field === "householdType") {
      setValue("householdType", value as RegisterFormData["householdType"], {
        shouldDirty: true,
        shouldTouch: true,
      });
      clearErrors("householdType");
      return;
    }

    setValue(
      "primaryCookingGoal",
      value as RegisterFormData["primaryCookingGoal"],
      {
        shouldDirty: true,
        shouldTouch: true,
      },
    );
    clearErrors("primaryCookingGoal");
  }

  const addAllergy = () => {
    const trimmed = allergyInput.trim();

    if (!trimmed) return;

    if (allergies.includes(trimmed)) {
      setAllergyInput("");
      return;
    }

    setValue("allergies", [...allergies, trimmed], {
      shouldDirty: true,
      shouldTouch: true,
    });

    setAllergyInput("");
    clearErrors("allergies");
  };

  const removeAllergy = (value: string) => {
    setValue(
      "allergies",
      allergies.filter((item) => item !== value),
      {
        shouldDirty: true,
        shouldTouch: true,
      },
    );
  };

  const handleBack = () => {
    if (step === 1) {
      return;
    }

    const previousStep = (step - 1) as Step;

    if (previousStep === 1 && isGoogleFlow) {
      switchToEmailRegistration();
      return;
    }

    updateStep(previousStep);
  };

  const handleFinalSubmit = handleSubmit(async (values) => {
    clearErrors();

    const result = createRegisterSchema(
      tValidation,
      values.authProvider,
    ).safeParse(values);

    if (!result.success) {
      applyIssues(result.error.issues);
      const issueStep = firstIssueStep(result.error.issues);
      setStep(issueStep);
      setRegisterFlowStep(issueStep);
      return;
    }

    const cookingProfile = toCookingProfileInput(result.data);

    try {
      if (result.data.authProvider === "google") {
        const registerFlow = getRegisterFlowState();
        const googleIdToken = registerFlow?.googleIdToken;

        if (!googleIdToken) {
          toast.error(t("googleMissingToken"));
          switchToEmailRegistration();
          return;
        }

        const payload = await authenticateWithGoogle({
          idToken: googleIdToken,
          name: result.data.name,
          cookingProfile,
          profileCompleted: true,
          currentOnboardingStep: 0,
        });

        if (
          !(
            payload.user.profileCompleted &&
            payload.user.currentOnboardingStep === 0
          )
        ) {
          beginGoogleRegisterFlow({
            googleIdToken,
            googleName: result.data.name,
            googleEmail: registerFlow?.googleEmail ?? result.data.email,
            step: mapBackendOnboardingStepToRegisterStep(
              payload.user.currentOnboardingStep,
            ),
          });
          router.replace(`/${locale}/register`);
          return;
        }

        clearRegisterFlowState();
        router.replace(`/${locale}`);
        return;
      }

      const payload = await registerUser({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
        confirmPassword: result.data.confirmPassword,
        cookingProfile,
      });

      clearRegisterFlowState();
      toast.success(payload.message);

      if (payload.emailVerificationRequired || !payload.user.isEmailVerified) {
        beginEmailVerificationFlow({
          email: result.data.email,
          verificationOtp: payload.verificationOtp,
          verificationUrl: payload.verificationUrl,
        });

        const otpQuery = payload.verificationOtp
          ? `?otp=${encodeURIComponent(payload.verificationOtp)}`
          : "";

        router.replace(`/${locale}/otp${otpQuery}`);
        return;
      }

      router.replace(`/${locale}/login`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("fallbackError")));
    }
  });

  const stepTranslationKey =
    step === 1 ? "step1" : step === 2 ? "step2" : "step3";

  const isArabic = locale === "ar";

  return (
    <div className="space-y-6 lg:space-y-7">
      <div className="space-y-4">
        <StepIndicator
          currentStep={step}
          label={t(`steps.${stepTranslationKey}.eyebrow`)}
        />

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight sm:text-[2.2rem]">
            {t(`steps.${stepTranslationKey}.title`)}
          </h1>
          <p className="text-base text-muted-foreground">
            {t(`steps.${stepTranslationKey}.description`)}
          </p>
        </div>

        {isGoogleFlow && step > 1 && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
            <p>{t("googleConnectedNotice")}</p>
            {emailValue ? (
              <p className="mt-1 text-muted-foreground">{emailValue}</p>
            ) : null}
          </div>
        )}
      </div>

      <form className="space-y-5" noValidate onSubmit={handleFinalSubmit}>
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div
              key={`step-1-${locale}`}
              {...motionProps}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="register-name"
                    className="block text-sm font-semibold"
                  >
                    {t("fields.name.label")}
                  </label>

                  <Input
                    id="register-name"
                    autoComplete="name"
                    placeholder={t("fields.name.placeholder")}
                    {...register("name")}
                    className="h-12 bg-card"
                  />

                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="register-email"
                    className="block text-sm font-semibold"
                  >
                    {t("fields.email.label")}
                  </label>

                  <Input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder={t("fields.email.placeholder")}
                    {...register("email")}
                    className="h-12 bg-card"
                  />

                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="register-password"
                    className="block text-sm font-semibold"
                  >
                    {t("fields.password.label")}
                  </label>

                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder={t("fields.password.placeholder")}
                      className="h-12 bg-card pe-12"
                      {...register("password")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 inset-e-3 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword
                          ? t("fields.password.hide")
                          : t("fields.password.show")
                      }
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

                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-sm font-semibold"
                  >
                    {t("fields.confirmPassword.label")}
                  </label>

                  <div className="relative">
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder={t("fields.confirmPassword.placeholder")}
                      className="h-12 bg-card pe-12"
                      {...register("confirmPassword")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute inset-y-0 inset-e-3 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showConfirmPassword
                          ? t("fields.confirmPassword.hide")
                          : t("fields.confirmPassword.show")
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
              </div>

              <Button
                type="button"
                disabled={isSubmitting || isGoogleSubmitting}
                className="h-12 w-full cursor-pointer rounded-full text-base font-semibold"
                onClick={() => {
                  if (validateStep(1)) {
                    updateStep(2);
                  }
                }}
              >
                {t("actions.continue")}
                <ArrowRight
                  className={cn("size-4", isArabic && "rotate-180")}
                />
              </Button>

              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>{t("divider")}</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <GoogleAuthButton
                mode="register"
                locale={locale}
                disabled={isSubmitting || isGoogleSubmitting}
                label={t("actions.google")}
                onCredential={handleGoogleCredential}
                variant="legacy"
              />

              <p className="text-center text-sm text-muted-foreground">
                {t("footer.haveAccount")}{" "}
                <Link
                  href={`/${locale}/login`}
                  className="px-1 font-semibold text-primary hover:underline"
                >
                  {t("footer.login")}
                </Link>
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key={`step-2-${locale}`}
              {...motionProps}
              className="space-y-5"
            >
              <section className="space-y-2.5">
                <div>
                  <h2 className="text-base font-black sm:text-lg">
                    {t("sections.dietary.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.dietary.description")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {DIETARY_PREFERENCES.map((value) => (
                    <OptionChip
                      key={value}
                      active={dietaryPreferences.includes(value)}
                      onClick={() => toggleDietaryPreference(value)}
                    >
                      {t(`options.dietary.${value}`)}
                    </OptionChip>
                  ))}
                </div>

                {errors.dietaryPreferences && (
                  <p className="text-sm text-destructive">
                    {errors.dietaryPreferences.message as string}
                  </p>
                )}
              </section>

              <section className="space-y-2.5">
                <div>
                  <h2 className="text-base font-black sm:text-lg">
                    {t("sections.cuisines.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.cuisines.description")}
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {CUISINES.map((value) => (
                    <AuthOptionCard
                      key={value}
                      icon={CUISINE_ICONS[value]}
                      title={t(`options.cuisines.${value}`)}
                      active={favoriteCuisines.includes(value)}
                      onClick={() =>
                        toggleMultiValue("favoriteCuisines", value)
                      }
                    />
                  ))}
                </div>

                {errors.favoriteCuisines && (
                  <p className="text-sm text-destructive">
                    {errors.favoriteCuisines.message as string}
                  </p>
                )}
              </section>

              <section className="space-y-2.5">
                <div>
                  <h2 className="text-base font-black sm:text-lg">
                    {t("sections.allergies.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.allergies.description")}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Input
                    value={allergyInput}
                    onChange={(event) => setAllergyInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addAllergy();
                      }
                    }}
                    placeholder={t("sections.allergies.placeholder")}
                    className="h-12 bg-card"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-1/4 cursor-pointer rounded-2xl border-2 border-dashed border-primary px-4 text-primary hover:bg-primary hover:text-card"
                    onClick={addAllergy}
                  >
                    <Plus className="size-4" />
                    {t("sections.allergies.add")}
                  </Button>
                </div>

                {!!allergies.length && (
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeAllergy(item)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label={t("sections.allergies.remove")}
                        >
                          <X className="size-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {errors.allergies && (
                  <p className="text-sm text-destructive">
                    {errors.allergies.message as string}
                  </p>
                )}
              </section>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 cursor-pointer rounded-full border-2 border-solid border-primary text-base font-semibold hover:bg-primary hover:text-card"
                  onClick={handleBack}
                >
                  <ArrowLeft
                    className={cn("size-4", isArabic && "rotate-180")}
                  />
                  {t("actions.back")}
                </Button>

                <Button
                  type="button"
                  className="h-12 flex-1 cursor-pointer rounded-full text-base font-semibold"
                  onClick={() => {
                    if (validateStep(2)) {
                      updateStep(3);
                    }
                  }}
                >
                  {t("actions.continue")}
                  <ArrowRight
                    className={cn("size-4", isArabic && "rotate-180")}
                  />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key={`step-3-${locale}`}
              {...motionProps}
              className="space-y-5"
            >
              <section className="space-y-2.5">
                <div>
                  <h2 className="text-base font-black sm:text-lg">
                    {t("sections.family.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.family.description")}
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-3">
                  {HOUSEHOLD_TYPES.map((value) => (
                    <AuthOptionCard
                      key={value}
                      icon={FAMILY_ICONS[value]}
                      title={t(`options.familyTypes.${value}`)}
                      active={familyType === value}
                      onClick={() => selectSingleValue("householdType", value)}
                    />
                  ))}
                </div>

                {errors.householdType && (
                  <p className="text-sm text-destructive">
                    {errors.householdType.message as string}
                  </p>
                )}
              </section>

              <section className="space-y-2.5">
                <div>
                  <h2 className="text-base font-black sm:text-lg">
                    {t("sections.level.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.level.description")}
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-3">
                  {COOKING_SKILL_LEVELS.map((value) => (
                    <AuthOptionCard
                      key={value}
                      icon={LEVEL_ICONS[value]}
                      title={t(`options.levels.${value}`)}
                      description={t(`options.levelDescriptions.${value}`)}
                      active={cookingLevel === value}
                      onClick={() =>
                        selectSingleValue("cookingSkillLevel", value)
                      }
                    />
                  ))}
                </div>

                {errors.cookingSkillLevel && (
                  <p className="text-sm text-destructive">
                    {errors.cookingSkillLevel.message as string}
                  </p>
                )}
              </section>

              <section className="space-y-2.5">
                <div>
                  <h2 className="text-base font-black sm:text-lg">
                    {t("sections.tools.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.tools.description")}
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {KITCHEN_TOOLS.map((value) => (
                    <AuthOptionCard
                      key={value}
                      icon={TOOL_ICONS[value]}
                      title={t(`options.tools.${value}`)}
                      active={availableTools.includes(value)}
                      onClick={() =>
                        toggleMultiValue("availableKitchenTools", value)
                      }
                    />
                  ))}
                </div>

                {errors.availableKitchenTools && (
                  <p className="text-sm text-destructive">
                    {errors.availableKitchenTools.message as string}
                  </p>
                )}
              </section>

              <section className="space-y-2.5">
                <div>
                  <h2 className="text-base font-black sm:text-lg">
                    {t("sections.goals.title")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t("sections.goals.description")}
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {PRIMARY_COOKING_GOALS.map((value) => (
                    <AuthOptionCard
                      key={value}
                      icon={GOAL_ICONS[value]}
                      title={t(`options.goals.${value}`)}
                      active={primaryGoal === value}
                      onClick={() =>
                        selectSingleValue("primaryCookingGoal", value)
                      }
                    />
                  ))}
                </div>

                {errors.primaryCookingGoal && (
                  <p className="text-sm text-destructive">
                    {errors.primaryCookingGoal.message as string}
                  </p>
                )}
              </section>

              <div className="flex cursor-pointer flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 cursor-pointer rounded-full border-2 border-solid border-primary text-base font-semibold hover:bg-primary hover:text-card"
                  onClick={handleBack}
                >
                  <ArrowLeft
                    className={cn("size-4", isArabic && "rotate-180")}
                  />
                  {t("actions.back")}
                </Button>

                <Button
                  type="submit"
                  className="h-12 flex-1 cursor-pointer rounded-full text-base font-semibold"
                  disabled={isSubmitting || isGoogleSubmitting}
                >
                  {isSubmitting ? t("actions.loading") : t("actions.finish")}
                  <ArrowRight
                    className={cn("size-4", isArabic && "rotate-180")}
                  />
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {t("privacyCaption")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

function StepIndicator({
  currentStep,
  label,
}: {
  currentStep: Step;
  label: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[1, 2, 3].map((value) => (
          <span
            key={value}
            className={cn(
              "h-1 flex-1 rounded-full",
              value <= currentStep ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>

      <p className="text-sm font-semibold text-primary">{label}</p>
    </div>
  );
}

function OptionChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40",
      )}
    >
      {active && <Check className="size-4" />}
      {children}
    </button>
  );
}
