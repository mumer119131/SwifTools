export interface SlugOptions {
  separator: "-" | "_" | ".";
  lowercase: boolean;
  /** Drops "a", "the", "of" and friends — shorter, still readable. */
  removeStopWords: boolean;
  maxLength: number;
  /** Appends -2, -3 … so a batch is always safe to use as URLs. */
  deduplicate: boolean;
}

export const defaultOptions: SlugOptions = {
  separator: "-",
  lowercase: true,
  removeStopWords: false,
  maxLength: 60,
  deduplicate: true,
};

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "in", "on", "at", "to", "for", "with", "by",
  "from", "is", "are", "was", "were", "be", "as", "it", "its", "that", "this",
]);

/**
 * Characters that have a conventional word-equivalent rather than a base
 * letter. Transliterating these keeps the slug readable where stripping them
 * would silently merge distinct titles.
 */
const TRANSLITERATE: Record<string, string> = {
  ß: "ss",
  æ: "ae",
  Æ: "ae",
  œ: "oe",
  Œ: "oe",
  ø: "o",
  Ø: "o",
  đ: "d",
  Đ: "d",
  ł: "l",
  Ł: "l",
  ı: "i",
  "&": " and ",
  "@": " at ",
  "%": " percent ",
  "+": " plus ",
  "€": " euro ",
  "£": " pound ",
  "$": " dollar ",
};

/**
 * Folds a title down to a URL-safe slug.
 *
 * Accents are removed via NFD normalisation, which splits a character into its
 * base letter plus a combining mark, so the marks can be stripped in one pass —
 * "Café Münster" becomes "cafe-munster" rather than losing the letters entirely.
 */
export function slugify(title: string, options: SlugOptions): string {
  let working = title.trim();

  for (const [character, replacement] of Object.entries(TRANSLITERATE)) {
    working = working.split(character).join(replacement);
  }

  working = working
    .normalize("NFD")
    // Strip combining diacritical marks left behind by the decomposition.
    .replace(/[̀-ͯ]/g, "");

  if (options.lowercase) working = working.toLowerCase();

  let words = working
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (options.removeStopWords && words.length > 1) {
    const kept = words.filter((word) => !STOP_WORDS.has(word.toLowerCase()));
    // Never return an empty slug just because every word was a stop word.
    if (kept.length > 0) words = kept;
  }

  let slug = words.join(options.separator);

  if (options.maxLength > 0 && slug.length > options.maxLength) {
    slug = slug.slice(0, options.maxLength);
    // Trim back to a word boundary so the slug doesn't end mid-word.
    const lastBreak = slug.lastIndexOf(options.separator);
    if (lastBreak > options.maxLength * 0.5) slug = slug.slice(0, lastBreak);
  }

  return slug.replace(
    new RegExp(`^\\${options.separator}+|\\${options.separator}+$`, "g"),
    "",
  );
}

export interface SlugRow {
  source: string;
  slug: string;
  /** True when a numeric suffix was added to avoid a collision. */
  deduplicated: boolean;
}

export function slugifyAll(input: string, options: SlugOptions): SlugRow[] {
  const lines = input.split("\n").map((line) => line.trim()).filter(Boolean);
  const seen = new Map<string, number>();

  return lines.map((source) => {
    const base = slugify(source, options);
    if (!base) return { source, slug: "", deduplicated: false };

    if (!options.deduplicate) return { source, slug: base, deduplicated: false };

    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    return {
      source,
      slug: count === 0 ? base : `${base}${options.separator}${count + 1}`,
      deduplicated: count > 0,
    };
  });
}
