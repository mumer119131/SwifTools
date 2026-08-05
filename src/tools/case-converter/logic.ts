/**
 * Words that stay lowercase inside a title unless they lead or trail it.
 * Follows the Chicago Manual of Style's short-word rule.
 */
const minorWords = new Set([
  "a", "an", "the", "and", "but", "or", "nor", "for", "yet", "so",
  "at", "by", "in", "of", "on", "to", "up", "as", "per", "via", "from", "into", "with", "over",
]);

/**
 * Splits any input into its constituent words, whatever convention it arrived
 * in. This is what lets "getUserID", "get_user_id" and "Get User ID" all round-
 * trip to the same word list — including the ID/User boundary, which a naive
 * `[A-Z]` split gets wrong.
 */
export function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

export interface CaseVariant {
  key: string;
  label: string;
  description: string;
  transform: (input: string) => string;
}

export const caseVariants: readonly CaseVariant[] = [
  {
    key: "sentence",
    label: "Sentence case",
    description: "First letter of each sentence capitalised.",
    transform: (input) =>
      input
        .toLowerCase()
        .replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gu, (match) => match.toUpperCase()),
  },
  {
    key: "lower",
    label: "lowercase",
    description: "Everything lowercase.",
    transform: (input) => input.toLowerCase(),
  },
  {
    key: "upper",
    label: "UPPERCASE",
    description: "Everything uppercase.",
    transform: (input) => input.toUpperCase(),
  },
  {
    key: "title",
    label: "Title Case",
    description: "Major words capitalised, short joining words left lowercase.",
    transform: (input) => {
      const words = input.toLowerCase().split(/(\s+)/);
      const lastIndex = words.length - 1;
      return words
        .map((word, index) => {
          if (!word.trim()) return word;
          const isEdge = index === 0 || index === lastIndex;
          return !isEdge && minorWords.has(word) ? word : capitalise(word);
        })
        .join("");
    },
  },
  {
    key: "capitalised",
    label: "Capitalised Case",
    description: "Every word capitalised, no exceptions.",
    transform: (input) => input.replace(/\S+/g, capitalise),
  },
  {
    key: "camel",
    label: "camelCase",
    description: "For JavaScript variables and JSON keys.",
    transform: (input) =>
      splitWords(input)
        .map((word, index) => (index === 0 ? word.toLowerCase() : capitalise(word)))
        .join(""),
  },
  {
    key: "pascal",
    label: "PascalCase",
    description: "For class and component names.",
    transform: (input) => splitWords(input).map(capitalise).join(""),
  },
  {
    key: "snake",
    label: "snake_case",
    description: "For Python, Ruby and database columns.",
    transform: (input) => splitWords(input).map((word) => word.toLowerCase()).join("_"),
  },
  {
    key: "constant",
    label: "CONSTANT_CASE",
    description: "For environment variables and constants.",
    transform: (input) => splitWords(input).map((word) => word.toUpperCase()).join("_"),
  },
  {
    key: "kebab",
    label: "kebab-case",
    description: "For URLs, CSS classes and file names.",
    transform: (input) => splitWords(input).map((word) => word.toLowerCase()).join("-"),
  },
  {
    key: "dot",
    label: "dot.case",
    description: "For config keys and namespaces.",
    transform: (input) => splitWords(input).map((word) => word.toLowerCase()).join("."),
  },
  {
    key: "alternating",
    label: "aLtErNaTiNg",
    description: "Alternating capitals.",
    transform: (input) => {
      let letterIndex = 0;
      return [...input]
        .map((character) => {
          if (!/\p{L}/u.test(character)) return character;
          const result = letterIndex % 2 === 0 ? character.toLowerCase() : character.toUpperCase();
          letterIndex += 1;
          return result;
        })
        .join("");
    },
  },
  {
    key: "inverse",
    label: "iNVERSE cASE",
    description: "Swaps the case of every letter.",
    transform: (input) =>
      [...input]
        .map((character) =>
          character === character.toUpperCase()
            ? character.toLowerCase()
            : character.toUpperCase(),
        )
        .join(""),
  },
];
