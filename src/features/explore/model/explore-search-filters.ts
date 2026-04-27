export const SMART_FILTER_GROUPS = [
  {
    key: "time",
    options: ["quickMeal", "under20Min", "budget", "savesTime"] as const,
  },
  {
    key: "desire",
    options: ["savoury", "sweet", "light", "spicy"] as const,
  },
  {
    key: "mood",
    options: ["healthy", "comfort", "crispy", "fullMeal"] as const,
  },
] as const;

export const BASIC_FILTER_GROUPS = [
  {
    key: "kitchen",
    options: ["italian", "egyptian", "japanese", "mexican", "indian"] as const,
  },
  {
    key: "mealType",
    options: ["breakfast", "lunch", "dinner", "snack", "dessert"] as const,
  },
  {
    key: "dishType",
    options: ["pasta", "seafood", "soup", "salad", "pizza"] as const,
  },
] as const;

export const HEALTH_FILTER_OPTIONS = [
  "keto",
  "vegan",
  "highProtein",
  "lowCalorie",
] as const;

export const OCCASION_FILTER_OPTIONS = [
  "quickMeal",
  "familyDinner",
  "romanticDinner",
  "healthyMealPrep",
] as const;

export const ALL_FILTER_OPTION_KEYS = [
  ...SMART_FILTER_GROUPS.flatMap((group) => group.options),
  ...BASIC_FILTER_GROUPS.flatMap((group) => group.options),
  ...HEALTH_FILTER_OPTIONS,
  ...OCCASION_FILTER_OPTIONS,
] as const;

export type FilterOptionKey = (typeof ALL_FILTER_OPTION_KEYS)[number];

export type ExploreFiltersDraft = Record<FilterOptionKey, boolean>;

export function createEmptyExploreFiltersDraft(): ExploreFiltersDraft {
  return ALL_FILTER_OPTION_KEYS.reduce(
    (acc, key) => {
      acc[key] = false;
      return acc;
    },
    {} as ExploreFiltersDraft,
  );
}

export function toggleExploreFilterOption(
  draft: ExploreFiltersDraft,
  key: FilterOptionKey,
): ExploreFiltersDraft {
  return {
    ...draft,
    [key]: !draft[key],
  };
}

export function getSelectedExploreFilterKeys(draft: ExploreFiltersDraft): FilterOptionKey[] {
  return ALL_FILTER_OPTION_KEYS.filter((key) => draft[key]);
}

export function getSelectedExploreFiltersCount(draft: ExploreFiltersDraft): number {
  return getSelectedExploreFilterKeys(draft).length;
}
