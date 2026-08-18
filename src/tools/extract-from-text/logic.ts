export type Kind = "email" | "url" | "phone" | "number" | "hashtag" | "mention" | "ip" | "date";

export interface Extractor {
  id: Kind;
  label: string;
  pattern: RegExp;
  note: string;
}

/**
 * Patterns for pulling structured values out of prose.
 *
 * These are deliberately pragmatic rather than specification-complete. A fully
 * RFC 5322 compliant email pattern is several hundred characters long, matches
 * addresses nobody has ever used, and still cannot tell you whether an address
 * exists. The aim here is to find the things a person would point at, which is
 * a different and more useful job.
 */
export const EXTRACTORS: Extractor[] = [
  {
    id: "email",
    label: "Email addresses",
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    note: "Pragmatic, not RFC-complete — the full specification matches addresses nobody uses.",
  },
  {
    id: "url",
    label: "URLs",
    pattern: /\bhttps?:\/\/[^\s<>"')\]]+/gi,
    note: "Requires a scheme, so bare domains like example.com are not matched.",
  },
  {
    id: "phone",
    label: "Phone numbers",
    pattern: /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d{2,4}(?:[\s.-]?\d{2,4}){1,3}/g,
    note: "Formats vary enormously by country; expect some false positives on long numbers.",
  },
  {
    id: "number",
    label: "Numbers",
    pattern: /-?\d+(?:[.,]\d+)*/g,
    note: "Includes decimals and thousands separators.",
  },
  {
    id: "hashtag",
    label: "Hashtags",
    pattern: /#[a-zA-Z][\w-]*/g,
    note: "Must start with a letter, so #1 and colour codes are excluded.",
  },
  {
    id: "mention",
    label: "@ mentions",
    pattern: /(?<![\w.])@[a-zA-Z0-9_]{2,}/g,
    note: "Excludes the local part of an email address.",
  },
  {
    id: "ip",
    label: "IP addresses",
    pattern: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
    note: "Range-checked, so 999.1.1.1 is not matched.",
  },
  {
    id: "date",
    label: "Dates",
    pattern: /\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g,
    note: "ISO and slash formats. Ambiguous between day-first and month-first, as those always are.",
  },
];

export interface Result {
  values: string[];
  total: number;
  duplicates: number;
}

export function extract(
  input: string,
  kind: Kind,
  options: { unique: boolean; sort: boolean; lowercase: boolean },
): Result {
  const extractor = EXTRACTORS.find((entry) => entry.id === kind);
  if (!extractor) return { values: [], total: 0, duplicates: 0 };

  // The pattern is global and stateful, so it is rebuilt rather than reused —
  // sharing one across calls carries lastIndex over and skips matches.
  const pattern = new RegExp(extractor.pattern.source, extractor.pattern.flags);
  let found = [...input.matchAll(pattern)].map((match) => match[0].trim()).filter(Boolean);

  if (options.lowercase) found = found.map((value) => value.toLowerCase());

  const total = found.length;
  let values = found;

  if (options.unique) values = [...new Set(values)];
  if (options.sort) values = [...values].sort((a, b) => a.localeCompare(b));

  return { values, total, duplicates: total - values.length };
}

export const SEPARATORS = [
  { id: "\n", label: "New line" },
  { id: ", ", label: "Comma" },
  { id: "; ", label: "Semicolon" },
  { id: " ", label: "Space" },
];
