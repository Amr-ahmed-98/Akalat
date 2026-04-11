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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { type FieldPath, useForm } from "react-hook-form";
import { type ZodIssue } from "zod";

import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { cn } from "@/src/shared/lib/utils";
import { AuthOptionCard } from "./AuthOptionCard";
import { GoogleAuthButton } from "./GoogleAuthButton";
import {
  COOKING_LEVELS,
  CUISINES,
  DIETARY_PREFERENCES,
  FAMILY_TYPES,
  GOALS,
  TOOLS,
} from "../model/register-options";
import {
  createRegisterAccountSchema,
  createRegisterKitchenSchema,
  createRegisterPreferencesSchema,
  createRegisterSchema,
  type RegisterFormData,
} from "../model/schema";

type Step = 1 | 2 | 3;

const defaultValues: RegisterFormData = {
  fullName: "",
  email: "",
  password: "",
  authProvider: "credentials",
  dietaryPreferences: [],
  favoriteCuisines: [],
  allergies: [],
  cookingLevel: "",
  familyType: "",
  primaryGoal: "",
  availableTools: [],
};

const stepFields: Record<Step, FieldPath<RegisterFormData>[]> = {
  1: ["fullName", "email", "password"],
  2: ["dietaryPreferences", "favoriteCuisines", "allergies"],
  3: ["cookingLevel", "familyType", "primaryGoal", "availableTools"],
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
  largeFamily: Users,
};

const LEVEL_ICONS: Record<string, LucideIcon> = {
  beginner: Sparkles,
  intermediate: ChefHat,
  advanced: Flame,
};

const TOOL_ICONS: Record<string, LucideIcon> = {
  oven: CookingPot,
  airFryer: Wind,
  blender: Sparkles,
  pressureCooker: Timer,
  knifeSet: UtensilsCrossed,
  pot: Soup,
  grill: Flame,
  other: ChefHat,
};

const GOAL_ICONS: Record<string, LucideIcon> = {
  saveTime: Clock3,
  eatHealthier: HeartPulse,
  learnSkills: GraduationCap,
  saveMoney: Wallet,
};

export function RegisterForm() {
  const t = useTranslations("Auth.register");
  const tValidation = useTranslations("Auth.validation");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [allergyInput, setAllergyInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    const provider = searchParams.get("provider");
    const requestedStep = searchParams.get("step");

    if (provider === "google") {
      setValue("authProvider", "google");
      setStep(requestedStep === "3" ? 3 : 2);
      return;
    }

    if (requestedStep === "2" || requestedStep === "3") {
      setStep(requestedStep === "3" ? 3 : 2);
    }
  }, [searchParams, setValue]);

  const isGoogleFlow = watch("authProvider") === "google";
  const dietaryPreferences = watch("dietaryPreferences");
  const favoriteCuisines = watch("favoriteCuisines");
  const allergies = watch("allergies");
  const cookingLevel = watch("cookingLevel");
  const familyType = watch("familyType");
  const primaryGoal = watch("primaryGoal");
  const availableTools = watch("availableTools");

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

  const validateStep = (currentStep: Step) => {
    clearErrors(stepFields[currentStep]);

    const values = getValues();

    if (currentStep === 1) {
      if (values.authProvider === "google") {
        return true;
      }

      const result = createRegisterAccountSchema(tValidation).safeParse({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
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
      cookingLevel: values.cookingLevel,
      familyType: values.familyType,
      primaryGoal: values.primaryGoal,
      availableTools: values.availableTools,
    });

    if (!result.success) {
      applyIssues(result.error.issues);
      return false;
    }

    return true;
  };

  const handleGoogleFlow = () => {
    setValue("authProvider", "google", {
      shouldDirty: true,
      shouldTouch: true,
    });

    setStep(2);
    router.replace(`/${locale}/register?provider=google&step=2`, {
      scroll: false,
    });
  };

  const toggleDietaryPreference = (value: string) => {
    const current = getValues("dietaryPreferences");
    const hasValue = current.includes(value);

    let next: string[];

    if (value === "none") {
      next = hasValue ? current.filter((item) => item !== value) : ["none"];
    } else if (hasValue) {
      next = current.filter((item) => item !== value);
    } else {
      next = [...current.filter((item) => item !== "none"), value];
    }

    setValue("dietaryPreferences", next, {
      shouldDirty: true,
      shouldTouch: true,
    });

    clearErrors("dietaryPreferences");
  };

  const toggleMultiValue = (
    field: "favoriteCuisines" | "availableTools",
    value: string,
  ) => {
    const current = getValues(field);
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    setValue(field, next, {
      shouldDirty: true,
      shouldTouch: true,
    });

    clearErrors(field);
  };

  const selectSingleValue = (
    field: "cookingLevel" | "familyType" | "primaryGoal",
    value: string,
  ) => {
    setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
    });

    clearErrors(field);
  };

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

  const handleFinalSubmit = handleSubmit((values) => {
    clearErrors();

    const result = createRegisterSchema(
      tValidation,
      values.authProvider,
    ).safeParse(values);

    if (!result.success) {
      applyIssues(result.error.issues);

      const fields = result.error.issues.map((issue) => issue.path[0]);

      if (
        fields.some((field) =>
          ["fullName", "email", "password"].includes(String(field)),
        )
      ) {
        setStep(1);
      } else if (
        fields.some((field) =>
          ["dietaryPreferences", "favoriteCuisines", "allergies"].includes(
            String(field),
          ),
        )
      ) {
        setStep(2);
      } else {
        setStep(3);
      }

      return;
    }

    console.log("register payload", result.data);
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
            {t("googleConnectedNotice")}
          </div>
        )}
      </div>

      <form className="space-y-5" noValidate onSubmit={handleFinalSubmit}>
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div key="step-1" {...motionProps} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="register-name"
                    className="block text-sm font-semibold"
                  >
                    {t("fields.fullName.label")}
                  </label>

                  <Input
                    id="register-name"
                    autoComplete="name"
                    placeholder={t("fields.fullName.placeholder")}
                    {...register("fullName")}
                    className="h-12 bg-card"
                  />

                  {errors.fullName && (
                    <p className="text-sm text-destructive">
                      {errors.fullName.message}
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
                      className="pe-12 h-12 bg-card"
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
              </div>

              <Button
                type="button"
                className="h-12 w-full rounded-full text-base font-semibold cursor-pointer"
                onClick={() => {
                  if (validateStep(1)) {
                    setStep(2);
                  }
                }}
              >
                {t("actions.continue")}
                <ArrowRight
                  className={cn("size-4", isArabic && "rotate-180")}
                />
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

              <GoogleAuthButton
                label={t("actions.google")}
                onClick={handleGoogleFlow}
                className="cursor-pointer"
              />

              <p className="text-center text-sm text-muted-foreground">
                {t("footer.haveAccount")}{" "}
                <Link
                  href={`/${locale}/login`}
                  className="font-semibold text-primary hover:underline px-1"
                >
                  {t("footer.login")}
                </Link>
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step-2" {...motionProps} className="space-y-5">
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
                    placeholder={t("sections.allergies.placeholder")}
                    className="h-12 bg-card"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-1/4 rounded-2xl px-4 border-dashed border-primary border-2 text-primary cursor-pointer hover:bg-primary hover:text-card"
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
                  className="h-12 flex-1 rounded-full text-base font-semibold cursor-pointer border-2 border-solid border-primary hover:bg-primary hover:text-card"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft
                    className={cn("size-4", isArabic && "rotate-180")}
                  />
                  {t("actions.back")}
                </Button>

                <Button
                  type="button"
                  className="h-12 flex-1 rounded-full text-base font-semibold cursor-pointer"
                  onClick={() => {
                    if (validateStep(2)) {
                      setStep(3);
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
            <motion.div key="step-3" {...motionProps} className="space-y-5">
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
                  {FAMILY_TYPES.map((value) => (
                    <AuthOptionCard
                      key={value}
                      icon={FAMILY_ICONS[value]}
                      title={t(`options.familyTypes.${value}`)}
                      active={familyType === value}
                      onClick={() => selectSingleValue("familyType", value)}
                    />
                  ))}
                </div>

                {errors.familyType && (
                  <p className="text-sm text-destructive">
                    {errors.familyType.message as string}
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
                  {COOKING_LEVELS.map((value) => (
                    <AuthOptionCard
                      key={value}
                      icon={LEVEL_ICONS[value]}
                      title={t(`options.levels.${value}`)}
                      description={t(`options.levelDescriptions.${value}`)}
                      active={cookingLevel === value}
                      onClick={() => selectSingleValue("cookingLevel", value)}
                    />
                  ))}
                </div>

                {errors.cookingLevel && (
                  <p className="text-sm text-destructive">
                    {errors.cookingLevel.message as string}
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
                  {TOOLS.map((value) => (
                    <AuthOptionCard
                      key={value}
                      icon={TOOL_ICONS[value]}
                      title={t(`options.tools.${value}`)}
                      active={availableTools.includes(value)}
                      onClick={() => toggleMultiValue("availableTools", value)}
                    />
                  ))}
                </div>

                {errors.availableTools && (
                  <p className="text-sm text-destructive">
                    {errors.availableTools.message as string}
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
                  {GOALS.map((value) => (
                    <AuthOptionCard
                      key={value}
                      icon={GOAL_ICONS[value]}
                      title={t(`options.goals.${value}`)}
                      active={primaryGoal === value}
                      onClick={() => selectSingleValue("primaryGoal", value)}
                    />
                  ))}
                </div>

                {errors.primaryGoal && (
                  <p className="text-sm text-destructive">
                    {errors.primaryGoal.message as string}
                  </p>
                )}
              </section>

              <div className="flex flex-col gap-3 sm:flex-row cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 rounded-full text-base font-semibold cursor-pointer border-2 border-solid border-primary hover:bg-primary hover:text-card"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft
                    className={cn("size-4", isArabic && "rotate-180")}
                  />
                  {t("actions.back")}
                </Button>

                <Button
                  type="submit"
                  className="h-12 flex-1 rounded-full text-base font-semibold cursor-pointer"
                  disabled={isSubmitting}
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
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer",
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
