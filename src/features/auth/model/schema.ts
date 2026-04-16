import { z } from "zod";
import {
  COOKING_SKILL_LEVELS,
  CUISINES,
  DIETARY_PREFERENCES,
  HOUSEHOLD_TYPES,
  KITCHEN_TOOLS,
  PRIMARY_COOKING_GOALS,
} from "./register-options";
import type {
  AuthProvider,
  CookingProfileInput,
  CookingSkillLevel,
  DietaryPreference,
  FavoriteCuisine,
  HouseholdType,
  KitchenTool,
  PrimaryCookingGoal,
} from "./types";

type Translate = (key: string) => string;

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  authProvider: AuthProvider;
  dietaryPreferences: DietaryPreference[];
  favoriteCuisines: FavoriteCuisine[];
  allergies: string[];
  householdType: HouseholdType | "";
  cookingSkillLevel: CookingSkillLevel | "";
  primaryCookingGoal: PrimaryCookingGoal | "";
  availableKitchenTools: KitchenTool[];
  otherKitchenTools: string[];
};

export type ForgotPasswordFormData = {
  email: string;
};

export type OtpVerificationFormData = {
  otp: string;
};

export type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export const defaultRegisterFormValues: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  authProvider: "credentials",
  dietaryPreferences: [],
  favoriteCuisines: [],
  allergies: [],
  householdType: "",
  cookingSkillLevel: "",
  primaryCookingGoal: "",
  availableKitchenTools: [],
  otherKitchenTools: [],
};

const emailRule = (t: Translate) =>
  z.string().min(1, t("emailRequired")).email(t("emailInvalid"));

const passwordRule = (t: Translate) =>
  z
    .string()
    .min(8, t("passwordMin"))
    .regex(/[A-Z]/, t("passwordUpper"))
    .regex(/[0-9]/, t("passwordNumber"))
    .regex(/[@$!%*?&]/, t("passwordSpecial"));

const nameRule = (t: Translate) =>
  z.string().min(3, t("nameMin")).max(50, t("nameMax"));

const oneOf = <T extends string>(values: readonly T[], message: string) =>
  z
    .string()
    .min(1, message)
    .refine((value): value is T => values.includes(value as T), {
      message,
    });

const manyOf = <T extends string>(values: readonly T[], message: string) =>
  z
    .array(
      z.string().refine((value): value is T => values.includes(value as T), {
        message,
      }),
    )
    .min(1, message);

const allergiesRule = (t: Translate) =>
  z
    .array(z.string().trim().min(1))
    .max(10, t("allergiesMax"))
    .default([]);

const otherKitchenToolsRule = (t: Translate) =>
  z
    .array(z.string().trim().min(1))
    .max(10, t("otherToolsMax"))
    .default([]);

export const createLoginSchema = (t: Translate) =>
  z.object({
    email: emailRule(t),
    password: z.string().min(1, t("passwordRequired")),
  });

export const createRegisterAccountSchema = (
  t: Translate,
  authProvider: AuthProvider = "credentials",
) => {
  if (authProvider === "google") {
    return z.object({
      name: nameRule(t),
      email: z.string().default(""),
      password: z.string().default(""),
      confirmPassword: z.string().default(""),
      authProvider: z.literal("google"),
    });
  }

  return z
    .object({
      name: nameRule(t),
      email: emailRule(t),
      password: passwordRule(t),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
      authProvider: z.literal("credentials"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });
};

export const createRegisterPreferencesSchema = (t: Translate) =>
  z.object({
    dietaryPreferences: manyOf(DIETARY_PREFERENCES, t("dietaryRequired")),
    favoriteCuisines: manyOf(CUISINES, t("cuisineRequired")),
    allergies: allergiesRule(t),
  });

export const createRegisterKitchenSchema = (t: Translate) =>
  z.object({
    householdType: oneOf(HOUSEHOLD_TYPES, t("familyTypeRequired")),
    cookingSkillLevel: oneOf(COOKING_SKILL_LEVELS, t("cookingLevelRequired")),
    primaryCookingGoal: oneOf(PRIMARY_COOKING_GOALS, t("goalRequired")),
    availableKitchenTools: manyOf(KITCHEN_TOOLS, t("toolsRequired")),
    otherKitchenTools: otherKitchenToolsRule(t),
  });

export const createRegisterSchema = (
  t: Translate,
  authProvider: AuthProvider = "credentials",
) =>
  createRegisterAccountSchema(t, authProvider)
    .merge(createRegisterPreferencesSchema(t))
    .merge(createRegisterKitchenSchema(t));

export const createForgotPasswordSchema = (t: Translate) =>
  z.object({
    email: emailRule(t),
  });

export const createOtpSchema = (t: Translate) =>
  z.object({
    otp: z
      .string()
      .min(1, t("otpRequired"))
      .length(6, t("otpLength"))
      .regex(/^\d{6}$/, t("otpDigits")),
  });

export const createResetPasswordSchema = (t: Translate) =>
  z
    .object({
      newPassword: passwordRule(t),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

export function toCookingProfileInput(data: RegisterFormData): CookingProfileInput {
  return {
    householdType: data.householdType || null,
    cookingSkillLevel: data.cookingSkillLevel || null,
    primaryCookingGoal: data.primaryCookingGoal || null,
    dietaryPreferences: data.dietaryPreferences,
    favoriteCuisines: data.favoriteCuisines,
    allergies: data.allergies,
    availableKitchenTools: data.availableKitchenTools,
    otherKitchenTools: data.otherKitchenTools,
  };
}
