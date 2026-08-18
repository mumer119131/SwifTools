import type { Tool } from "@/config/tools";

/**
 * Ranks tools by how related they actually are.
 *
 * The previous implementation took the first few tools in the category in
 * registry order, which meant every developer tool recommended the same four —
 * whichever happened to be declared first. Nothing pointed at the other 28, so
 * they collected no internal links, and a visitor who had just formatted some
 * SQL was offered a Base64 encoder.
 *
 * Relatedness here is token overlap between names and keywords, weighted so
 * that rare words count for more than common ones. Without that weighting
 * "generator", "online" and "converter" dominate and everything looks related
 * to everything, which is the same failure in a more expensive form.
 */

/** Words that carry no signal about what a tool does. */
const STOP_TOKENS = new Set([
  "a", "an", "and", "the", "to", "for", "of", "in", "on", "with", "your", "my",
  "free", "online", "tool", "tools", "generator", "converter", "calculator",
  "maker", "create", "make", "how", "what", "is", "it", "you", "from", "by",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOP_TOKENS.has(token));
}

/** Name and keyword tokens for one tool, deduplicated. */
function tokensFor(tool: Tool): Set<string> {
  const tokens = new Set<string>(tokenize(tool.name));
  for (const keyword of tool.keywords) {
    for (const token of tokenize(keyword)) tokens.add(token);
  }
  return tokens;
}

interface Index {
  tokens: Map<string, Set<string>>;
  /** How many tools use each token, for the rarity weighting. */
  frequency: Map<string, number>;
  /**
   * Tools nobody would otherwise link to, assigned to their closest match.
   *
   * Ranking alone leaves a handful of tools with no inbound links at all —
   * ones distinctive enough that they never make another tool's top six. A
   * page nothing links to is a page a crawler reaches only through a category
   * listing, so each is adopted by whichever tool is most related to it.
   *
   * Populated lazily, because building it needs the ranking that needs the
   * index.
   */
  adopted: Map<string, Tool[]> | null;
}

/**
 * Built once per tool list and cached.
 *
 * `getRelatedTools` is called during the static render of every one of the ~280
 * tool pages, so rebuilding the index each time would mean tokenising the whole
 * registry ~280 times. The identity check matches the pattern used elsewhere in
 * the codebase: compare the source array, never a truthiness test, so an
 * undefined list can't collide with a stale cache.
 */
let cache: { source: readonly Tool[]; index: Index } | null = null;

function indexOf(tools: readonly Tool[]): Index {
  if (cache !== null && cache.source === tools) return cache.index;

  const tokens = new Map<string, Set<string>>();
  const frequency = new Map<string, number>();

  for (const tool of tools) {
    const set = tokensFor(tool);
    tokens.set(`${tool.category}/${tool.slug}`, set);
    for (const token of set) frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }

  const index: Index = { tokens, frequency, adopted: null };
  cache = { source: tools, index };
  return index;
}

/**
 * Rarity weight, capped.
 *
 * The cap is what stops one coincidental word deciding the whole result.
 * Uncapped, "how many hosts in a /24" and "how many tiles" shared the token
 * "many" — rare enough to score above five, which put a subnet calculator next
 * to a tile calculator. Likewise "sign message with secret key" and an
 * Instagram DM mockup share "message". No single word should be able to
 * outrank belonging to the same category.
 */
function weight(token: string, index: Index, total: number): number {
  const seen = index.frequency.get(token) ?? 1;
  return Math.min(Math.log(1 + total / seen), MAX_TOKEN_WEIGHT);
}

const MAX_TOKEN_WEIGHT = 2.2;
const SAME_CATEGORY_BONUS = 5;
const POPULAR_BONUS = 0.4;

/**
 * Shared tokens needed before a tool from another category is taken seriously.
 *
 * One word in common between categories is nearly always coincidence. Two or
 * more is usually a genuine relationship — "compress image" and "compress pdf"
 * really do belong near each other.
 */
const CROSS_CATEGORY_MIN_TOKENS = 2;
const CROSS_CATEGORY_PENALTY = 0.25;

export function scoreRelation(
  tool: Tool,
  candidate: Tool,
  tools: readonly Tool[],
): number {
  const index = indexOf(tools);
  const total = tools.length;

  const mine = index.tokens.get(`${tool.category}/${tool.slug}`);
  const theirs = index.tokens.get(`${candidate.category}/${candidate.slug}`);
  if (!mine || !theirs) return 0;

  let score = 0;
  let shared = 0;
  for (const token of mine) {
    if (theirs.has(token)) {
      score += weight(token, index, total);
      shared += 1;
    }
  }

  const sameCategory = candidate.category === tool.category;

  // Category is a strong prior, not the only signal: a tool from elsewhere can
  // still win, but it has to earn it with more than one word in common.
  if (sameCategory) score += SAME_CATEGORY_BONUS;
  else if (shared < CROSS_CATEGORY_MIN_TOKENS) score *= CROSS_CATEGORY_PENALTY;

  if (candidate.popular) score += POPULAR_BONUS;

  return score;
}

/**
 * The tools most worth showing next to this one.
 *
 * Search-only tools — the ~98 unit pair pages — are kept in their own pool.
 * They are the best possible suggestions for each other, and would swamp
 * everything else if offered to browsable tools: a visitor on Compress Image
 * does not want sixteen weight conversions.
 */
const key = (tool: Tool): string => `${tool.category}/${tool.slug}`;

/** The ranked list, before any orphan adoption. */
function rank(tool: Tool, tools: readonly Tool[], limit: number): Tool[] {
  const wantSearchOnly = tool.searchOnly === true;

  const scored = tools
    .filter(
      (candidate) =>
        key(candidate) !== key(tool) &&
        candidate.status === "live" &&
        (candidate.searchOnly === true) === wantSearchOnly,
    )
    .map((candidate) => ({ candidate, score: scoreRelation(tool, candidate, tools) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        // A stable tiebreak, so the output does not depend on sort implementation.
        a.candidate.slug.localeCompare(b.candidate.slug),
    );

  const picked = scored.slice(0, limit).map((entry) => entry.candidate);

  // A search-only page with no siblings left would show nothing at all, which
  // is worse than falling back to its category.
  if (picked.length < limit && wantSearchOnly) {
    const seen = new Set(picked.map(key));
    for (const candidate of tools) {
      if (picked.length >= limit) break;
      if (candidate.searchOnly || candidate.status !== "live") continue;
      if (candidate.category !== tool.category) continue;
      if (seen.has(key(candidate))) continue;
      picked.push(candidate);
    }
  }

  return picked;
}

/**
 * Works out which tools receive no inbound links, and hands each to its closest
 * relative.
 *
 * Runs once per tool list. The host is whichever live tool ranks the orphan
 * highest, which keeps the added link relevant rather than arbitrary.
 */
function adoptions(tools: readonly Tool[], limit: number): Map<string, Tool[]> {
  const inbound = new Set<string>();
  const live = tools.filter((tool) => tool.status === "live");

  for (const tool of live) {
    for (const related of rank(tool, tools, limit)) inbound.add(key(related));
  }

  const map = new Map<string, Tool[]>();

  for (const orphan of live) {
    if (inbound.has(key(orphan))) continue;

    let host: Tool | null = null;
    let best = -Infinity;
    for (const candidate of live) {
      if (key(candidate) === key(orphan)) continue;
      if ((candidate.searchOnly === true) !== (orphan.searchOnly === true)) continue;
      const score = scoreRelation(candidate, orphan, tools);
      if (score > best) {
        best = score;
        host = candidate;
      }
    }

    if (host) {
      const list = map.get(key(host)) ?? [];
      list.push(orphan);
      map.set(key(host), list);
    }
  }

  return map;
}

export function relatedTools(tool: Tool, tools: readonly Tool[], limit = 6): Tool[] {
  const index = indexOf(tools);
  index.adopted ??= adoptions(tools, limit);

  const picked = rank(tool, tools, limit);
  const orphans = index.adopted.get(key(tool));
  if (!orphans || orphans.length === 0) return picked;

  // The adopted tools take the last slots, so the genuinely best matches stay
  // at the top where they are read.
  const seen = new Set(picked.map(key));
  const kept = picked.slice(0, Math.max(0, limit - orphans.length));
  for (const orphan of orphans) {
    if (!seen.has(key(orphan))) kept.push(orphan);
  }

  return kept.slice(0, limit);
}
