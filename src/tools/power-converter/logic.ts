import { TEMPERATURE_CATEGORY, getCategory } from "@/lib/units";

/**
 * Power Converter configuration. The units live in `@/lib/units`, shared with the
 * other type converters and every pair page, so a corrected ratio fixes all of
 * them at once.
 */
export const categoryId: string = "power";

export const defaultFrom = "kw";
export const defaultTo = "hp";

/** Temperature has no ratio table — its scales carry offsets too. */
export const isTemperature = categoryId === TEMPERATURE_CATEGORY;

export const category = getCategory(categoryId);
