import { TEMPERATURE_CATEGORY, getCategory } from "@/lib/units";

/**
 * Data Size Converter configuration. The units themselves live in `@/lib/units`, shared
 * with the other type converters and every pair page, so a corrected ratio
 * fixes all of them at once.
 */
export const categoryId: string = "data";

export const defaultFrom = "MB";
export const defaultTo = "GB";

/** Temperature has no ratio table — its scales carry offsets too. */
export const isTemperature = categoryId === TEMPERATURE_CATEGORY;

export const category = getCategory(categoryId);
