import type {
  CookingSkillLevel,
  DietaryPreference,
  FavoriteCuisine,
  HouseholdType,
  KitchenTool,
  PrimaryCookingGoal,
} from "./types";

export const DIETARY_PREFERENCES = [
  "keto",
  "vegan",
  "vegetarian",
  "paleo",
  "low-carb",
] as const satisfies readonly DietaryPreference[];

export const CUISINES = ["arabic", "asian", "italian", "french"] as const satisfies readonly FavoriteCuisine[];

export const COOKING_SKILL_LEVELS = [
  "beginner",
  "intermediate",
  "professional",
] as const satisfies readonly CookingSkillLevel[];

export const HOUSEHOLD_TYPES = ["single", "couple", "family"] as const satisfies readonly HouseholdType[];

export const PRIMARY_COOKING_GOALS = [
  "save-time",
  "healthy-eating",
  "learn-skills",
  "save-money",
] as const satisfies readonly PrimaryCookingGoal[];

export const KITCHEN_TOOLS = [
  "oven",
  "air-fryer",
  "pressure-cooker",
  "blender",
  "hand-blender",
  "pot",
  "microwave",
  "stand-mixer",
] as const satisfies readonly KitchenTool[];
