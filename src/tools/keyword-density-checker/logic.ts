/** Words with no topical signal — excluded from single-word counts. */
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "at", "for", "with", "as",
  "by", "from", "is", "are", "was", "were", "be", "been", "being", "it", "its", "this", "that",
  "these", "those", "i", "you", "he", "she", "we", "they", "them", "his", "her", "their", "our",
  "not", "no", "so", "do", "does", "did", "have", "has", "had", "will", "would", "can", "could",
  "should", "there", "here", "what", "which", "who", "when", "where", "how", "all", "any", "than",
  "then", "into", "out", "up", "down", "about", "over", "more", "most", "some", "such", "only",
  "just", "also", "very", "your", "my", "me", "us", "him", "each", "other", "own", "same", "too",
]);

export interface KeywordRow {
  phrase: string;
  count: number;
  /** Share of all counted terms, as a percentage. */
  density: number;
}

export interface DensityReport {
  totalWords: number;
  uniqueWords: number;
  /** Unique words ÷ total words — a rough richness measure. */
  lexicalDiversity: number;
  single: KeywordRow[];
  pairs: KeywordRow[];
  triples: KeywordRow[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    // Keep apostrophes and hyphens so "don't" and "long-tail" stay whole.
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^[-']+|[-']+$/g, ""))
    .filter(Boolean);
}

/**
 * Counts n-grams over the token stream.
 *
 * Single words drop stop words, because "the" topping the list tells you
 * nothing. Phrases keep them — "cost of living" is a real phrase and removing
 * "of" would destroy it — but a phrase made *entirely* of stop words is noise
 * and is discarded.
 */
function countNGrams(tokens: string[], size: number): Map<string, number> {
  const counts = new Map<string, number>();

  for (let index = 0; index + size <= tokens.length; index += 1) {
    const window = tokens.slice(index, index + size);

    if (size === 1) {
      if (window[0].length < 3 || STOP_WORDS.has(window[0])) continue;
    } else if (window.every((word) => STOP_WORDS.has(word))) {
      continue;
    }

    const phrase = window.join(" ");
    counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
  }

  return counts;
}

function toRows(counts: Map<string, number>, total: number, limit: number): KeywordRow[] {
  return [...counts.entries()]
    .filter(([, count]) => count > 1 || counts.size < 10)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: total > 0 ? (count / total) * 100 : 0,
    }));
}

export function analyseDensity(text: string, limit = 15): DensityReport {
  const tokens = tokenize(text);
  const totalWords = tokens.length;
  const unique = new Set(tokens);

  return {
    totalWords,
    uniqueWords: unique.size,
    lexicalDiversity: totalWords > 0 ? (unique.size / totalWords) * 100 : 0,
    single: toRows(countNGrams(tokens, 1), totalWords, limit),
    pairs: toRows(countNGrams(tokens, 2), Math.max(1, totalWords - 1), limit),
    triples: toRows(countNGrams(tokens, 3), Math.max(1, totalWords - 2), limit),
  };
}

export type DensityVerdict = "low" | "healthy" | "high";

/**
 * Density thresholds are rules of thumb, not algorithmic penalties — modern
 * search engines don't score a percentage. Above ~3% is where prose typically
 * starts reading as repetitive to a human, which is the real problem.
 */
export function verdictFor(density: number): DensityVerdict {
  if (density > 3) return "high";
  if (density < 0.5) return "low";
  return "healthy";
}
