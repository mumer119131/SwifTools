import { getCategory } from "@/config/categories";
import type { Tool } from "@/config/tools";

/**
 * Relevance scoring for the ⌘K palette.
 *
 * cmdk's built-in filter is a fuzzy subsequence matcher, which is far too
 * permissive for a catalogue this size: "bmi" matches "Merge PDF" because the
 * letters b, m and i appear in that order somewhere across its keywords
 * ("com**b**ine", "**m**erger", "onl**i**ne"). It scores low, but it still
 * matches — and rendering results grouped by category then put that low match
 * above the exact one.
 *
 * This scores explicitly instead, so an exact name match always outranks a
 * keyword match, which always outranks a description match, and fuzzy matching
 * only runs when nothing else matched at all.
 */

export interface SearchResult {
  tool: Tool;
  score: number;
  /** Why this matched, shown when the reason isn't the tool's name. */
  reason: string | null;
}

/** Points per match kind. The gaps are wide so tiers can never interleave. */
const SCORE = {
  nameExact: 1000,
  nameStartsWith: 850,
  initials: 820,
  nameWordStartsWith: 700,
  keywordExact: 620,
  nameContains: 500,
  slugContains: 420,
  keywordStartsWith: 380,
  keywordContains: 240,
  categoryStartsWith: 200,
  descriptionContains: 120,
  fuzzy: 40,
} as const;

interface Indexed {
  tool: Tool;
  name: string;
  nameWords: string[];
  initials: string;
  slug: string;
  keywords: string[];
  category: string;
  description: string;
  haystack: string;
}

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/** Splits on anything that isn't a letter or digit, so "png-to-jpg" tokenises. */
function tokenise(value: string): string[] {
  return normalise(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/**
 * Words that carry intent but almost no discriminating power. "png to jpg" is
 * about png and jpg; the "to" must not let a tool outrank another just because
 * its name happens to contain it.
 */
const STOP_TOKENS = new Set([
  "a", "an", "the", "to", "of", "for", "and", "in", "on", "with", "from", "my",
  "is", "into", "as", "at", "by",
  // Question words. People type whole sentences — "what is the molar mass of
  // caffeine" — and "what" is a near-perfect prefix of "WhatsApp", which is not
  // what they were asking about.
  "how", "what", "why", "when", "where", "which", "do", "does", "did", "can",
  "i", "me", "you", "it", "am", "are", "be", "should", "would", "will",
]);

/** Cap on what a stop token may contribute, however well it matches. */
const STOP_TOKEN_CAP = 30;

let cache: { source: readonly Tool[]; index: Indexed[] } | null = null;

/** Built once per tool list — the registry is static, so this never rebuilds. */
function buildIndex(tools: readonly Tool[]): Indexed[] {
  if (cache !== null && cache.source === tools) return cache.index;

  const index = tools.map((tool) => {
    const name = normalise(tool.name);
    const nameWords = tokenise(tool.name);
    const keywords = tool.keywords.map(normalise);
    const category = normalise(getCategory(tool.category)?.label ?? tool.category);
    const description = normalise(tool.description);
    const slug = tool.slug.replace(/-/g, " ");

    return {
      tool,
      name,
      nameWords,
      initials: nameWords.map((word) => word[0]).join(""),
      slug,
      keywords,
      category,
      description,
      haystack: [name, slug, category, keywords.join(" "), description].join(" "),
    };
  });

  cache = { source: tools, index };
  return index;
}

/** Scores one token against one tool, returning the best single match found. */
function scoreToken(entry: Indexed, token: string): { score: number; reason: string | null } {
  if (entry.name === token) return { score: SCORE.nameExact, reason: null };
  if (entry.name.startsWith(token)) return { score: SCORE.nameStartsWith, reason: null };

  // "wc" finds Word Counter — only worth it for genuinely short queries, or
  // every two-letter token would drag in unrelated tools.
  if (token.length >= 2 && token.length <= 4 && entry.initials === token) {
    return { score: SCORE.initials, reason: null };
  }

  if (entry.nameWords.some((word) => word.startsWith(token))) {
    return { score: SCORE.nameWordStartsWith, reason: null };
  }

  const exactKeyword = entry.keywords.find((keyword) => keyword === token);
  if (exactKeyword) return { score: SCORE.keywordExact, reason: exactKeyword };

  if (entry.name.includes(token)) return { score: SCORE.nameContains, reason: null };
  if (entry.slug.includes(token)) return { score: SCORE.slugContains, reason: null };

  const startsKeyword = entry.keywords.find((keyword) =>
    keyword.split(" ").some((word) => word.startsWith(token)),
  );
  if (startsKeyword) return { score: SCORE.keywordStartsWith, reason: startsKeyword };

  const containsKeyword = entry.keywords.find((keyword) => keyword.includes(token));
  if (containsKeyword) return { score: SCORE.keywordContains, reason: containsKeyword };

  if (entry.category.startsWith(token)) {
    return { score: SCORE.categoryStartsWith, reason: `${entry.category} tools` };
  }

  if (entry.description.includes(token)) {
    return { score: SCORE.descriptionContains, reason: entry.tool.description };
  }

  return { score: 0, reason: null };
}

/** Ordered subsequence match, used only when nothing scored at all. */
function fuzzyMatches(haystack: string, token: string): boolean {
  let cursor = 0;
  for (const character of token) {
    cursor = haystack.indexOf(character, cursor);
    if (cursor === -1) return false;
    cursor += 1;
  }
  return true;
}

export function searchTools(query: string, tools: readonly Tool[]): SearchResult[] {
  const tokens = tokenise(query);
  if (tokens.length === 0) return [];

  const index = buildIndex(tools);
  const whole = normalise(query).replace(/\s+/g, " ");

  const scored: SearchResult[] = [];
  /**
   * Entries that matched most of the query but not all of it. Only consulted
   * when nothing matched in full — see below.
   */
  const partial: SearchResult[] = [];

  for (const entry of index) {
    let total = 0;
    let reason: string | null = null;
    let missed = 0;
    let best = 0;

    for (const token of tokens) {
      const result = scoreToken(entry, token);
      const isStop = STOP_TOKENS.has(token) && tokens.length > 1;

      if (result.score === 0) {
        // A stop word failing to match is not disqualifying — it carries no
        // intent of its own.
        if (!isStop) missed += 1;
        continue;
      }

      total += isStop ? Math.min(result.score, STOP_TOKEN_CAP) : result.score;
      // Only real tokens count towards the strength test below: a stop word
      // matching a name strongly says nothing about intent.
      if (!isStop) best = Math.max(best, result.score);
      // Report the reason from the strongest non-name match.
      if (result.reason && !reason) reason = result.reason;
    }

    if (missed === 0) {
      // The whole query matching a name or a keyword outright is the strongest
      // signal there is: someone typing "png to jpg" wants the tool that lists
      // exactly that, not one whose name happens to share two of the words.
      if (entry.name === whole || entry.keywords.includes(whole)) {
        total += 1200;
      } else if (tokens.length > 1) {
        if (entry.name.includes(whole)) total += 400;
        else if (entry.haystack.includes(whole)) total += 150;
      }
    } else {
      // A token nothing in the registry uses — "solution" in "ph of a
      // solution", "4.7k" in "4.7k resistor color". Charged a flat penalty per
      // miss rather than disqualifying, but only when the tokens that did land
      // actually name the tool: a stray description hit is not enough, or one
      // unknown word would drag in everything it half-touches.
      if (best < SCORE.keywordStartsWith) continue;
      total -= missed * 200;
    }

    // Tie-breakers: prefer what people actually use, and prefer working tools.
    if (entry.tool.popular) total += 45;
    if (entry.tool.status === "live") total += 25;
    // A shorter name is the more specific tool for the same match quality.
    total -= Math.min(entry.name.length, 40) * 0.5;

    (missed === 0 ? scored : partial).push({ tool: entry.tool, score: total, reason });
  }

  // A partial match is only worth showing when it beats everything that matched
  // in full — "ph of a solution" should reach the pH calculator even though a
  // tool whose description happens to contain both "ph" and "solution" matched
  // every word. The penalty above is what makes that comparison honest.
  const strongest = scored.reduce((best, entry) => Math.max(best, entry.score), 0);
  scored.push(...partial.filter((entry) => entry.score > strongest));

  if (scored.length === 0) {
    // Nothing matched strictly — fall back to fuzzy so a typo still finds
    // something, but rank every hit below any real match would have been.
    for (const entry of index) {
      if (tokens.every((token) => fuzzyMatches(entry.haystack, token))) {
        scored.push({ tool: entry.tool, score: SCORE.fuzzy, reason: "similar match" });
      }
    }
  }

  return scored.sort(
    (a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name),
  );
}
