export interface Result {
  /** Characters typed ÷ 5 ÷ minutes — the standard definition of a word. */
  grossWpm: number;
  /** Gross WPM with uncorrected errors deducted. The number that counts. */
  netWpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  characters: number;
  seconds: number;
}

/**
 * Scores a typing attempt.
 *
 * A "word" is five characters including the space, which is the convention
 * every typing test uses — counting actual words would make a passage of short
 * words score far higher than one of long words at the same physical speed.
 */
export function score(target: string, typed: string, seconds: number): Result {
  const minutes = Math.max(seconds, 1) / 60;

  let correct = 0;
  let incorrect = 0;

  for (let index = 0; index < typed.length; index += 1) {
    if (index < target.length && typed[index] === target[index]) correct += 1;
    else incorrect += 1;
  }

  const grossWpm = typed.length / 5 / minutes;
  // Net WPM deducts one word per uncorrected error, the standard penalty.
  const netWpm = Math.max(0, grossWpm - incorrect / minutes / 5);

  return {
    grossWpm,
    netWpm,
    accuracy: typed.length > 0 ? (correct / typed.length) * 100 : 100,
    correct,
    incorrect,
    characters: typed.length,
    seconds,
  };
}

/** Passages with ordinary punctuation and word length — not lorem ipsum. */
export const PASSAGES: { id: string; label: string; text: string }[] = [
  {
    id: "short",
    label: "Short",
    text: "The first rule of any technology used in a business is that automation applied to an efficient operation will magnify the efficiency. The second is that automation applied to an inefficient operation will magnify the inefficiency.",
  },
  {
    id: "medium",
    label: "Medium",
    text: "It is a curious thing about maps that they are always out of date. The coastline shifts, the river finds a new channel, a village empties and its name stays printed for another forty years. A map is not a picture of the land; it is a picture of what somebody believed about the land on a particular afternoon, and every road you drive on was once an argument somebody won.",
  },
  {
    id: "long",
    label: "Long",
    text: "Consider the ordinary paperclip. It has no moving parts, requires no instruction, and has resisted redesign for over a century — not for want of trying. Patent offices hold hundreds of improvements, each cleverer than the last, and every one of them has failed against a single loop of bent wire. The lesson is not that innovation is futile. It is that a solved problem stays solved, and that recognising which problems are already solved is most of the skill. Anyone can add a feature; knowing when to stop is the rarer talent, and it is almost never rewarded.",
  },
  {
    id: "code",
    label: "Punctuation-heavy",
    text: "const results = items.filter((item) => item.status === \"active\").map(({ id, name }) => ({ id, label: name.trim() })); if (!results.length) { throw new Error(\"nothing matched\"); }",
  },
];
