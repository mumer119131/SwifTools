import { TEMPERATURE_CATEGORY, getCategory } from "@/lib/units";

/**
 * Temperature Converter configuration. The units themselves live in `@/lib/units`, shared
 * with the other type converters and every pair page, so a corrected ratio
 * fixes all of them at once.
 */
export const categoryId: string = "temperature";

export const defaultFrom = "c";
export const defaultTo = "f";

/** Temperature has no ratio table — its scales carry offsets too. */
export const isTemperature = categoryId === TEMPERATURE_CATEGORY;

export const category = getCategory(categoryId);
