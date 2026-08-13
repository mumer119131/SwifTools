import { pick } from "@/lib/random";
import {
  FIRST_NAMES_F,
  FIRST_NAMES_M,
  FIRST_NAMES_N,
  LAST_NAMES,
} from "@/lib/wordlists";

export type Style = "any" | "feminine" | "masculine" | "neutral";
export type Parts = "full" | "first" | "last";

function firstNamePool(style: Style): string[] {
  switch (style) {
    case "feminine":
      return FIRST_NAMES_F;
    case "masculine":
      return FIRST_NAMES_M;
    case "neutral":
      return FIRST_NAMES_N;
    default:
      return [...FIRST_NAMES_F, ...FIRST_NAMES_M, ...FIRST_NAMES_N];
  }
}

/**
 * Generates names, avoiding duplicates within a single batch.
 *
 * The pool is large enough that repeats are rare but not impossible, and a list
 * of twenty names with the same one twice looks like a bug even when it isn't.
 */
export function generate(style: Style, parts: Parts, count: number): string[] {
  const firsts = firstNamePool(style);
  const wanted = Math.max(1, Math.min(200, Math.floor(count)));

  const seen = new Set<string>();
  const names: string[] = [];

  // Bounded so an impossible request (more names than combinations) still ends.
  for (let attempt = 0; attempt < wanted * 40 && names.length < wanted; attempt += 1) {
    const first = pick(firsts) ?? "";
    const last = pick(LAST_NAMES) ?? "";

    const name = parts === "first" ? first : parts === "last" ? last : `${first} ${last}`;
    if (seen.has(name)) continue;

    seen.add(name);
    names.push(name);
  }

  return names;
}
