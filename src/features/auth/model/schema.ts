import { z } from "zod";

import {
  COOKING_LEVELS,
  CUISINES,
  DIETARY_PREFERENCES,
  FAMILY_TYPES,
  GOALS,
  TOOLS,
} from "./register-options";

type Translate = (key: string) => string;

export type AuthProvider = "credentials" | "google";

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  authProvider: AuthProvider;
  dietaryPreferences: string[];
  favoriteCuisines: string[];
  allergies: string[];
  cookingLevel: string;
  familyType: string;
  primaryGoal: string;
  availableTools: string[];
};

export type ForgotPasswordFormData = {
  email: string;
};

export type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const emailRule = (t: Translate) =>
  z
    .string()
    .min(1, t("emailRequired"))
    .email(t("emailInvalid"));

const passwordRule = (t: Translate) =>
  z
    .string()
    .min(8, t("passwordMin"))
    .regex(/[A-Z]/, t("passwordUpper"))
    .regex(/[0-9]/, t("passwordNumber"))
    .regex(/[@$!%*?&]/, t("passwordSpecial"));

const nameRule = (t: Translate) =>
  z
    .string()
    .min(3, t("nameMin"))
    .max(50, t("nameMax"));

const oneOf = (values: readonly string[], message: string) =>
  z
    .string()
    .min(1, message)
    .refine((value) => values.includes(value), {
      message,
    });

const manyOf = (values: readonly string[], message: string) =>
  z
    .array(
      z.string().refine((value) => values.includes(value), {
        message,
      }),
    )
    .min(1, message);

export const createLoginSchema = (t: Translate) =>
  z.object({
    email: emailRule(t),
    password: z.string().min(1, t("passwordRequired")),
  });

export const createRegisterAccountSchema = (t: Translate) =>
  z.object({
    fullName: nameRule(t),
    email: emailRule(t),
    password: passwordRule(t),
    authProvider: z.enum(["credentials", "google"]).default("credentials"),
  });

export const createRegisterPreferencesSchema = (t: Translate) =>
  z.object({
    dietaryPreferences: manyOf(
      DIETARY_PREFERENCES,
      t("dietaryRequired"),
    ),
    favoriteCuisines: manyOf(CUISINES, t("cuisineRequired")),
    allergies: z
      .array(z.string().min(1))
      .max(10, t("allergiesMax"))
      .default([]),
  });

export const createRegisterKitchenSchema = (t: Translate) =>
  z.object({
    cookingLevel: oneOf(
      COOKING_LEVELS,
      t("cookingLevelRequired"),
    ),
    familyType: oneOf(FAMILY_TYPES, t("familyTypeRequired")),
    primaryGoal: oneOf(GOALS, t("goalRequired")),
    availableTools: manyOf(TOOLS, t("toolsRequired")),
  });

export const createRegisterSchema = (
  t: Translate,
  authProvider: AuthProvider = "credentials",
) => {
  const sharedSchema = createRegisterPreferencesSchema(t).merge(
    createRegisterKitchenSchema(t),
  );

  if (authProvider === "google") {
    return sharedSchema.extend({
      fullName: z.string().default(""),
      email: z.string().default(""),
      password: z.string().default(""),
      authProvider: z.literal("google"),
    });
  }

  return createRegisterAccountSchema(t).merge(sharedSchema);
};

export const createForgotPasswordSchema = (t: Translate) =>
  z.object({
    email: emailRule(t),
  });

export const createResetPasswordSchema = (t: Translate) =>
  z
    .object({
      password: passwordRule(t),
      confirmPassword: z
        .string()
        .min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });