import { defaultCategories } from "@/data/categories";

const KNOWN_CATEGORY_IDS = new Set(defaultCategories.map((category) => category.id));

const NAME_TO_ID = new Map(
  defaultCategories.map((category) => [category.name.toLowerCase(), category.id])
);

const ALIASES = {
  "personal care": "personal",
  "personal-care": "personal",
  "personal_care": "personal",
  personalcare: "personal",
  "other expense": "other-expense",
  "other expenses": "other-expense",
  "other-income": "other-income",
  "other income": "other-income",
};

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-_&]/g, "")
    .replace(/&/g, " and ")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function normalizeCategoryKey(value) {
  if (!value || typeof value !== "string") {
    return "other-expense";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "other-expense";
  }

  const lowered = trimmed.toLowerCase();
  if (KNOWN_CATEGORY_IDS.has(lowered)) {
    return lowered;
  }

  if (NAME_TO_ID.has(lowered)) {
    return NAME_TO_ID.get(lowered);
  }

  if (ALIASES[lowered]) {
    return ALIASES[lowered];
  }

  const slug = slugify(trimmed);
  if (KNOWN_CATEGORY_IDS.has(slug)) {
    return slug;
  }

  if (ALIASES[slug]) {
    return ALIASES[slug];
  }

  return slug || "other-expense";
}

export function getCategoryColor(rawCategory, fallback = "#94a3b8") {
  const key = normalizeCategoryKey(rawCategory);
  const match = defaultCategories.find((category) => category.id === key);
  return match?.color || fallback;
}
