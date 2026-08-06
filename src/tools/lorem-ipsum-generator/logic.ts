export type Unit = "paragraphs" | "sentences" | "words" | "list";
export type Flavour = "latin" | "english";
export type OutputFormat = "plain" | "html";

const LATIN = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation
ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate
velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt
culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error
voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore
veritatis quasi architecto beatae vitae dicta explicabo nemo enim`
  .split(/\s+/)
  .filter(Boolean);

/**
 * A plain-English word list. Latin placeholder is traditional, but it makes it
 * hard to judge whether a line length or a heading actually reads well — real
 * words with realistic length distribution do that better.
 */
const ENGLISH = `the quick design system builds a clear layout for every screen size and reading
context people scan before they read so headings carry weight while body copy stays calm and
even spacing gives structure without lines or boxes colour marks meaning never decoration and
motion explains what changed rather than drawing attention to itself good defaults beat options
most of the time because the fastest interface is one that needs no configuration at all type
sets the tone contrast makes it legible and restraint keeps it usable over long sessions`
  .split(/\s+/)
  .filter(Boolean);

function pick(words: string[], count: number, offset: number): string[] {
  // Deterministic sampling from a rotating offset — output is stable between
  // renders, so the text doesn't churn on every keystroke.
  return Array.from({ length: count }, (_, index) => words[(offset + index * 7) % words.length]);
}

function buildSentence(words: string[], offset: number, index: number): string {
  const length = 8 + ((index * 5) % 10);
  const sentence = pick(words, length, offset + index * 13).join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

export interface GenerateOptions {
  unit: Unit;
  count: number;
  flavour: Flavour;
  /** Opens with the traditional "Lorem ipsum dolor sit amet…". */
  startWithLorem: boolean;
  format: OutputFormat;
}

export function generate(options: GenerateOptions): string {
  const words = options.flavour === "latin" ? LATIN : ENGLISH;
  const count = Math.max(1, Math.min(200, Math.floor(options.count)));

  if (options.unit === "words") {
    const text = pick(words, count, 0).join(" ");
    const cased = text.charAt(0).toUpperCase() + text.slice(1);
    return options.format === "html" ? `<p>${cased}</p>` : cased;
  }

  if (options.unit === "sentences") {
    const sentences = Array.from({ length: count }, (_, index) =>
      buildSentence(words, 0, index),
    );
    if (options.startWithLorem && options.flavour === "latin") {
      sentences[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    }
    const text = sentences.join(" ");
    return options.format === "html" ? `<p>${text}</p>` : text;
  }

  if (options.unit === "list") {
    const items = Array.from({ length: count }, (_, index) => {
      const item = pick(words, 4 + (index % 4), index * 11).join(" ");
      return item.charAt(0).toUpperCase() + item.slice(1);
    });
    return options.format === "html"
      ? `<ul>\n${items.map((item) => `  <li>${item}</li>`).join("\n")}\n</ul>`
      : items.map((item) => `• ${item}`).join("\n");
  }

  const paragraphs = Array.from({ length: count }, (_, paragraphIndex) => {
    const sentenceCount = 4 + (paragraphIndex % 3);
    const sentences = Array.from({ length: sentenceCount }, (_, index) =>
      buildSentence(words, paragraphIndex * 29, index),
    );
    if (paragraphIndex === 0 && options.startWithLorem && options.flavour === "latin") {
      sentences[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    }
    return sentences.join(" ");
  });

  return options.format === "html"
    ? paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n\n")
    : paragraphs.join("\n\n");
}

export function countStats(text: string): { words: number; characters: number } {
  const stripped = text.replace(/<[^>]+>/g, " ");
  return {
    words: stripped.split(/\s+/).filter(Boolean).length,
    characters: text.length,
  };
}
