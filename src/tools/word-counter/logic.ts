export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  /** Minutes, at 225 wpm — the widely-cited average for adult silent reading. */
  readingMinutes: number;
  /** Minutes, at 150 wpm — a comfortable speaking pace. */
  speakingMinutes: number;
}

/** Words that carry no signal in a frequency list. */
const stopWords = new Set([
  "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "at", "for", "with", "as",
  "by", "from", "is", "are", "was", "were", "be", "been", "being", "it", "its", "this", "that",
  "these", "those", "i", "you", "he", "she", "we", "they", "them", "his", "her", "their", "our",
  "not", "no", "so", "do", "does", "did", "have", "has", "had", "will", "would", "can", "could",
  "should", "there", "here", "what", "which", "who", "when", "where", "how", "all", "any", "than",
  "then", "into", "out", "up", "down", "about", "over", "more", "most", "some", "such", "only",
]);

/**
 * `Intl.Segmenter` counts words the way a human would across scripts — it
 * handles CJK, which has no spaces, and doesn't split "don't" into two.
 * Whitespace splitting is the fallback for the few engines without it.
 */
function countWords(text: string): number {
  if (!text.trim()) return 0;

  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
    let count = 0;
    for (const segment of segmenter.segment(text)) {
      if (segment.isWordLike) count += 1;
    }
    return count;
  }

  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function analyseText(text: string): TextStats {
  const words = countWords(text);
  const trimmed = text.trim();

  // Sentence ends are terminal punctuation followed by whitespace or the end.
  const sentences = trimmed ? (trimmed.match(/[^.!?…]+[.!?…]+(\s|$)|[^.!?…]+$/g) ?? []).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter((block) => block.trim()).length : 0;

  return {
    words,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    sentences,
    paragraphs,
    readingMinutes: words / 225,
    speakingMinutes: words / 150,
  };
}

export interface WordFrequency {
  word: string;
  count: number;
  /** Share of all counted words, 0–100. */
  density: number;
}

export function wordFrequencies(text: string, limit = 10): WordFrequency[] {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  if (words.length === 0) return [];

  const counts = new Map<string, number>();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count, density: (count / words.length) * 100 }));
}

/** "1 min", "4 min", "under a minute" — never "0.3 minutes". */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "—";
  if (minutes < 1) return "under a minute";
  return `${Math.round(minutes)} min`;
}
