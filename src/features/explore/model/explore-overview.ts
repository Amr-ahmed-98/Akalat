export const QUICK_PROCEDURE_ITEMS = [
  { id: "scan", path: "/explore/scan", labelKey: "scan", icon: "scan" },
  { id: "manual", path: "/explore/manual-add", labelKey: "manualAdd", icon: "manual" },
  { id: "saved", path: "/explore/saved-recipes", labelKey: "savedRecipes", icon: "saved" },
  { id: "inventory", path: "/explore/inventory", labelKey: "myInventory", icon: "inventory" },
] as const;

export const SAMPLE_INVENTORY_INGREDIENT_KEYS = [
  "avocado",
  "tomatoes",
  "spinach",
  "pepper",
  "garlic",
  "garlicPowder",
] as const;

export const SMART_VISION_STATS = [
  { key: "recipes" },
  { key: "expiring" },
] as const;

export type QuickProcedureItem = (typeof QUICK_PROCEDURE_ITEMS)[number];
export type QuickProcedureIcon = QuickProcedureItem["icon"];
export type InventoryIngredientKey = (typeof SAMPLE_INVENTORY_INGREDIENT_KEYS)[number];
export type SmartVisionStatKey = (typeof SMART_VISION_STATS)[number]["key"];
