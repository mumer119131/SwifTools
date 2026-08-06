import { TEMPERATURE_CATEGORY, getCategory } from "@/lib/units";

/**
 * Volume Converter configuration. The units themselves live in `@/lib/units`, shared
 * with the other type converters and every pair page, so a corrected ratio
 * fixes all of them at once.
 */
export const categoryId: string = "volume";

export const defaultFrom = "l";
export const defaultTo = "galus";

/** Temperature has no ratio table — its scales carry offsets too. */
export const isTemperature = categoryId === TEMPERATURE_CATEGORY;

export const category = getCategory(categoryId);
